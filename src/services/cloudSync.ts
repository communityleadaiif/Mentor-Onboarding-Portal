import type { FullSubmission, AuditStatus } from '../types/prajna';

const CLOUD_API_URL = 'https://script.google.com/macros/s/AKfycbyj_EuwoOtaZkJ4E1PEylxsx8yTtuRJZm0r1_CNC3tyY4tKZk47I5ZuhNccEyS2Auqv/exec';

export const fetchCloudSubmissions = async (): Promise<FullSubmission[]> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'GET',
      redirect: 'follow',
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

    // Synchronize local storage cache to match canonical cloud database
    localStorage.setItem('prajna_2026_user_submissions', JSON.stringify(cleanCloudList));
    return cleanCloudList;
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
    const currentList = await fetchCloudSubmissions();

    // Ensure default status is PENDING_APPROVAL for organiser pre-screening gate
    const submissionWithGate: FullSubmission = {
      ...newSubmission,
      auditInfo: newSubmission.auditInfo || {
        status: 'PENDING_APPROVAL',
        auditDate: new Date().toLocaleDateString('en-IN')
      }
    };

    const updatedList = [submissionWithGate, ...currentList.filter(s => s.id !== newSubmission.id)];
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
