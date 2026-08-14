import type { FullSubmission, AuditStatus } from '../types/prajna';

const CLOUD_API_URL = 'https://jsonbin-zeta.vercel.app/api/bins/1Rxxq8C6te';

export const fetchCloudSubmissions = async (): Promise<FullSubmission[]> => {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const cloudData = await res.json();
    const cloudList = Array.isArray(cloudData) ? cloudData : [];

    // Get any locally stored submissions on this device
    let localList: FullSubmission[] = [];
    try {
      const local = localStorage.getItem('prajna_2026_user_submissions');
      localList = local ? JSON.parse(local) : [];
    } catch (e) {
      localList = [];
    }

    // Filter out placeholder/test objects that aren't valid submissions
    const isValidSubmission = (s: any) => s && s.id && s.team && typeof s.team === 'object';
    const cleanCloudList = cloudList.filter(isValidSubmission);
    const cleanLocalList = localList.filter(isValidSubmission);

    // Find local submissions that are not in the cloud list
    const missingInCloud = cleanLocalList.filter(localSub => 
      !cleanCloudList.some(cloudSub => cloudSub.id === localSub.id)
    );

    if (missingInCloud.length > 0) {
      // Merge local into cloud list
      const mergedList = [...missingInCloud, ...cleanCloudList];
      // Save the merged list back to the cloud database
      await saveCloudSubmissions(mergedList);
      return mergedList;
    }

    // If no missing, synchronize local storage to match cloud
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
    const currentList = await fetchCloudSubmissions();
    const updatedList = currentList.filter(s => s.id !== submissionId);
    await saveCloudSubmissions(updatedList);
    return updatedList;
  } catch (err) {
    console.error('Error deleting submission from cloud:', err);
    return [];
  }
};
