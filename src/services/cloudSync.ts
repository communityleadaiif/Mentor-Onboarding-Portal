import type { FullSubmission, AuditStatus } from '../types/prajna';

const CLOUD_API_URL = 'https://script.google.com/macros/s/AKfycbw9DQgpxEwtse34geGhGnpQv7zxJHuxMZ-xrxQUzWrALNqoOFUqSM2zxXW7pcJ4SKm4/exec';

export const fetchCloudSubmissions = async (): Promise<FullSubmission[]> => {
  try {
    const res = await fetch(`${CLOUD_API_URL}?_t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const rawText = await res.text();
    let cloudData: any;
    try {
      cloudData = JSON.parse(rawText);
    } catch (e) {
      console.warn('Could not parse cloud JSON response:', rawText);
      cloudData = [];
    }
    const cloudList = Array.isArray(cloudData) ? cloudData : [];

    // Filter out placeholder/test objects that aren't valid submissions
    const isValidSubmission = (s: any) =>
      s &&
      typeof s === 'object' &&
      typeof s.id === 'string' &&
      s.team &&
      typeof s.team === 'object' &&
      s.problem &&
      typeof s.problem === 'object';
    const cleanCloudList = cloudList.filter(isValidSubmission);

    // Merge with local storage cache to ensure zero loss if any newly submitted item hasn't synced yet
    let mergedList = [...cleanCloudList];
    try {
      const local = localStorage.getItem('prajna_2026_user_submissions');
      if (local) {
        const localList: FullSubmission[] = JSON.parse(local);
        if (Array.isArray(localList)) {
          const cloudIds = new Set(cleanCloudList.map(c => c.id));
          localList.forEach(loc => {
            if (loc && loc.id && !cloudIds.has(loc.id) && isValidSubmission(loc)) {
              mergedList.push(loc);
            }
          });
        }
      }
    } catch (e) {}

    // Synchronize local storage cache to match canonical database
    localStorage.setItem('prajna_2026_user_submissions', JSON.stringify(mergedList));
    return mergedList;
  } catch (err) {
    console.warn('Cloud API fetch warning (using local fallback):', err);
    try {
      const local = localStorage.getItem('prajna_2026_user_submissions');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  }
};

export const saveCloudSubmissions = async (submissions: FullSubmission[]): Promise<boolean> => {
  try {
    // Save to local storage cache first
    localStorage.setItem('prajna_2026_user_submissions', JSON.stringify(submissions));

    const isGoogleScript = CLOUD_API_URL.includes('script.google.com');
    const method = isGoogleScript ? 'POST' : 'PUT';
    const contentType = isGoogleScript ? 'text/plain' : 'application/json';

    const res = await fetch(CLOUD_API_URL, {
      method,
      redirect: 'follow',
      headers: {
        'Content-Type': contentType
      },
      body: JSON.stringify(submissions)
    });

    return res.ok;
  } catch (err) {
    console.error('Cloud API save error:', err);
    return false;
  }
};

export const addCloudSubmission = async (newSubmission: FullSubmission): Promise<FullSubmission[]> => {
  try {
    await triggerDatabaseBackup('PRE-ADD');
    // Ensure default status is PENDING_APPROVAL for organiser pre-screening gate
    const submissionWithGate: FullSubmission = {
      ...newSubmission,
      auditInfo: newSubmission.auditInfo || {
        status: 'PENDING_APPROVAL',
        auditDate: new Date().toLocaleDateString('en-IN')
      }
    };

    // 1. Fetch current live list from cloud so we never overwrite other teams
    let existingList: FullSubmission[] = [];
    try {
      const cloudList = await fetchCloudSubmissions();
      if (Array.isArray(cloudList) && cloudList.length > 0) {
        existingList = cloudList;
      }
    } catch (e) {
      console.warn('Could not fetch cloud before adding, using local fallback:', e);
    }

    // 2. Fallback to local storage if cloud fetch was empty
    if (existingList.length === 0) {
      try {
        const local = localStorage.getItem('prajna_2026_user_submissions');
        if (local) existingList = JSON.parse(local);
      } catch (e) {}
    }

    // 3. Merge new submission into full list
    const updatedList = [
      submissionWithGate,
      ...existingList.filter(s => s && s.id && s.id !== newSubmission.id)
    ];

    // 4. Save to local storage cache immediately
    localStorage.setItem('prajna_2026_user_submissions', JSON.stringify(updatedList));

    // 5. Send merged full database update to Google Apps Script
    await saveCloudSubmissions(updatedList);

    return updatedList;
  } catch (err) {
    console.error('Error adding submission to cloud:', err);
    return [newSubmission];
  }
};

export const updateSubmissionAuditStatus = async (
  submissionId: string,
  status: AuditStatus,
  remark?: string
): Promise<FullSubmission[]> => {
  try {
    await triggerDatabaseBackup('PRE-AUDIT');
    const currentList = await fetchCloudSubmissions();
    const updatedList = currentList.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          auditInfo: {
            status,
            remark,
            auditDate: new Date().toLocaleDateString('en-IN')
          }
        };
      }
      return s;
    });

    await saveCloudSubmissions(updatedList);
    return updatedList;
  } catch (err) {
    console.error('Error updating audit status in cloud:', err);
    return [];
  }
};

export const deleteSubmissionFromCloud = async (submissionId: string): Promise<FullSubmission[]> => {
  try {
    await triggerDatabaseBackup('PRE-DELETE');
    let currentList = await fetchCloudSubmissions();
    const updatedList = currentList.filter(s => s.id !== submissionId);

    // Save updated local storage cache immediately
    localStorage.setItem('prajna_2026_user_submissions', JSON.stringify(updatedList));

    // Send explicit tombstone delete action to Google Apps Script
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        action: 'delete',
        id: submissionId
      })
    });

    return updatedList;
  } catch (err) {
    console.error('Error deleting submission from cloud:', err);
    return [];
  }
};

export const clearAllCloudSubmissions = async (): Promise<boolean> => {
  try {
    await triggerDatabaseBackup('PRE-CLEAR');
    localStorage.removeItem('prajna_2026_user_submissions');
    localStorage.removeItem('prajna_2026_draft');

    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        action: 'clear_all'
      })
    });

    return res.ok;
  } catch (err) {
    console.error('Error clearing cloud submissions:', err);
    return false;
  }
};

// ==================== v2: VERSION HISTORY & PHOTO MANAGEMENT ====================

export const triggerDatabaseBackup = async (label: string = 'PRE-WRITE'): Promise<void> => {
  try {
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'backup_database', label })
    });
  } catch (err) {
    console.warn('Backup trigger failed (non-blocking):', err);
  }
};

export const uploadPhotoToDrive = async (
  submissionId: string,
  photoType: 'closeUp' | 'wideAngle' | 'teamOnSite',
  base64Data: string
): Promise<{ status: string; url?: string; fileId?: string }> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'upload_photo', submissionId, photoType, base64Data })
    });
    return await res.json();
  } catch (err) {
    console.error('Photo upload failed:', err);
    return { status: 'error' };
  }
};

export const updateSheetPhotoLinks = async (
  submissionId: string,
  photoLinks: { closeUp?: string; wideAngle?: string; teamOnSite?: string }
): Promise<{ status: string; message?: string }> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'update_sheet_photo_links', submissionId, photoLinks })
    });
    return await res.json();
  } catch (err) {
    console.error('Sheet photo link update failed:', err);
    return { status: 'error' };
  }
};

export const createBackupSpreadsheet = async (): Promise<{
  status: string; url?: string; name?: string; rowsCopied?: number;
}> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'create_backup_sheet' })
    });
    return await res.json();
  } catch (err) {
    console.error('Backup spreadsheet creation failed:', err);
    return { status: 'error' };
  }
};

export const authenticateOrganiser = async (
  passcode: string
): Promise<{ status: string; token?: string; message?: string }> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'authenticate_organiser', passcode })
    });
    return await res.json();
  } catch (err) {
    console.error('Organiser auth failed:', err);
    return { status: 'error', message: 'Network error during authentication.' };
  }
};
