import { useState, useEffect } from 'react';
import { HeaderNav } from './components/prajna/HeaderNav';
import { HeroBanner } from './components/prajna/HeroBanner';
import { PrincipalVideoSection } from './components/prajna/PrincipalVideoSection';
import { GuidelinesSection } from './components/prajna/GuidelinesSection';
import { SubmissionForm } from './components/prajna/SubmissionForm';
import { EvaluationSheet } from './components/prajna/EvaluationSheet';
import { AlumniPublicGallery } from './components/prajna/AlumniPublicGallery';
import { TNDistrictMap } from './components/prajna/TNDistrictMap';
import { JuryPanel } from './components/prajna/JuryPanel';
import { OrganiserAuditDesk } from './components/prajna/OrganiserAuditDesk';
import { FAQSection } from './components/prajna/FAQSection';
import { FloatingIntroVideoModal } from './components/prajna/FloatingIntroVideoModal';
import { PrajnaFooter } from './components/prajna/PrajnaFooter';
import type { FullSubmission, AuditStatus } from './types/prajna';
import type { Language } from './data/translations';
import { INITIAL_SCHOOLS } from './data/participatingSchools';
import type { SchoolEntry } from './data/participatingSchools';
import {
  fetchCloudSubmissions,
  addCloudSubmission,
  updateSubmissionAuditStatus,
  deleteSubmissionFromCloud,
  saveCloudSubmissions
} from './services/cloudSync';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'submit' | 'scorecard' | 'gallery' | 'map' | 'jury' | 'faq' | 'organiser'>('overview');
  const [lang, setLang] = useState<Language>('en');
  const [schools, setSchools] = useState<SchoolEntry[]>(INITIAL_SCHOOLS);
  const [isIntroVideoOpen, setIsIntroVideoOpen] = useState(true);

  const [currentSubmission, setCurrentSubmission] = useState<FullSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('prajna_2026_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.team && parsed.team.teamName) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [userSubmittedList, setUserSubmittedList] = useState<FullSubmission[]>([]);

  // Real-time Cloud Database Synchronization
  useEffect(() => {
    // Initial fetch on site load
    fetchCloudSubmissions().then(list => {
      if (list && list.length > 0) {
        setUserSubmittedList(list);
      }
    });

    // Auto-sync every 5 seconds for real-time Organiser updates
    const interval = setInterval(async () => {
      const list = await fetchCloudSubmissions();
      if (list && Array.isArray(list)) {
        setUserSubmittedList(list);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshCloud = async () => {
    const list = await fetchCloudSubmissions();
    if (list && Array.isArray(list)) {
      setUserSubmittedList(list);
    }
  };

  useEffect(() => {
    // Check query params for jury or organiser
    const params = new URLSearchParams(window.location.search);
    if (params.get('jury') === 'true' || params.get('tab') === 'jury') {
      setActiveTab('jury');
    } else if (params.get('organiser') === 'true' || params.get('tab') === 'organiser') {
      setActiveTab('organiser');
    }
  }, []);

  // Update school marquee list dynamically from approved (VERIFIED) submissions only
  useEffect(() => {
    const verifiedSubs = userSubmittedList.filter(s => s.auditInfo?.status === 'VERIFIED');
    verifiedSubs.forEach(s => {
      if (s.team.schoolName) {
        const exists = schools.some(sc => sc.name.toLowerCase() === s.team.schoolName.toLowerCase());
        if (!exists) {
          setSchools(prev => [
            {
              id: `sch-${Date.now()}`,
              name: s.team.schoolName,
              district: s.team.schoolDistrict || 'Tamil Nadu',
              badgeSymbol: '🎓',
              category: 'Registered School'
            },
            ...prev
          ]);
        }
      }
    });
  }, [userSubmittedList]);

  const handleNewSchoolRegistered = (schoolName: string, district: string) => {
    const exists = schools.some(s => s.name.toLowerCase() === schoolName.toLowerCase());
    if (!exists) {
      const newEntry: SchoolEntry = {
        id: `sch-${Date.now()}`,
        name: schoolName,
        district: district || 'Tamil Nadu',
        badgeSymbol: '🎓',
        category: 'Registered School'
      };
      setSchools(prev => [newEntry, ...prev]);
    }
  };

  const handleSubmissionComplete = async (submission: FullSubmission) => {
    const gatedSubmission: FullSubmission = {
      ...submission,
      auditInfo: {
        status: 'PENDING_APPROVAL',
        auditDate: new Date().toLocaleDateString('en-IN')
      }
    };

    setCurrentSubmission(gatedSubmission);
    const updatedList = await addCloudSubmission(gatedSubmission);
    setUserSubmittedList(updatedList);
    setActiveTab('scorecard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubmissionFromGallery = (sub: FullSubmission) => {
    setCurrentSubmission(sub);
    setActiveTab('scorecard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAudit = async (submissionId: string, status: AuditStatus, remark?: string) => {
    const updatedList = await updateSubmissionAuditStatus(submissionId, status, remark);
    setUserSubmittedList(updatedList);

    if (currentSubmission && currentSubmission.id === submissionId) {
      setCurrentSubmission(prev => prev ? {
        ...prev,
        auditInfo: {
          status,
          remark,
          auditDate: new Date().toLocaleDateString('en-IN')
        }
      } : null);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    const updatedList = await deleteSubmissionFromCloud(submissionId);
    setUserSubmittedList(updatedList);

    if (currentSubmission && currentSubmission.id === submissionId) {
      setCurrentSubmission(null);
      localStorage.removeItem('prajna_2026_draft');
    }
  };

  const handleClearAllStorage = async () => {
    localStorage.removeItem('prajna_2026_user_submissions');
    localStorage.removeItem('prajna_2026_draft');
    await saveCloudSubmissions([]);
    setUserSubmittedList([]);
    setCurrentSubmission(null);
    alert('All cloud database records & local browser cache have been cleared.');
  };

  return (
    <div className="min-h-screen bg-[#150000] text-white font-sans selection:bg-[#FFD700] selection:text-[#2A0000]">
      {/* Header Bar */}
      <HeaderNav
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        hasSubmission={Boolean(currentSubmission)}
        lang={lang}
        onLanguageToggle={setLang}
        onOpenIntroVideoModal={() => setIsIntroVideoOpen(true)}
      />

      {/* Floating Intro Video Screen */}
      <FloatingIntroVideoModal
        isOpen={isIntroVideoOpen}
        onClose={() => setIsIntroVideoOpen(false)}
      />

      {/* Main View Router */}
      <main>
        {activeTab === 'overview' && (
          <div>
            <HeroBanner
              onStartClick={() => setActiveTab('submit')}
              onRulesClick={() => {
                const el = document.getElementById('guidelines-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              lang={lang}
              schools={schools}
            />

            {/* Principal Welcome Video Address */}
            <div id="principal-video-anchor">
              <PrincipalVideoSection />
            </div>

            <div id="guidelines-anchor">
              <GuidelinesSection onGoToForm={() => setActiveTab('submit')} />
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <SubmissionForm
            onSubmissionComplete={handleSubmissionComplete}
            lang={lang}
            onNewSchoolRegistered={handleNewSchoolRegistered}
          />
        )}

        {activeTab === 'scorecard' && (
          <div>
            {currentSubmission ? (
              <EvaluationSheet
                submission={currentSubmission}
                onEditSubmission={() => setActiveTab('submit')}
              />
            ) : (
              <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-[#FFD700]">No Active Submission Found</h2>
                <p className="text-xs text-amber-100/70 max-w-md mx-auto leading-relaxed">
                  Click below to fill out the PRAJNA 2026 Community Innovation Submission Form and generate your official Field Dossier.
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-[#8B0000] text-[#FFD700] border border-[#D4AF37] px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg hover:bg-[#600000] transition"
                >
                  Start Innovation Proposal Submission
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <AlumniPublicGallery
            userSubmissions={userSubmittedList}
            onSelectSubmissionForView={handleSelectSubmissionFromGallery}
          />
        )}

        {activeTab === 'map' && (
          <TNDistrictMap
            userSubmissions={userSubmittedList}
            onSelectSubmission={handleSelectSubmissionFromGallery}
          />
        )}

        {activeTab === 'jury' && (
          <JuryPanel userSubmissions={userSubmittedList} />
        )}

        {activeTab === 'organiser' && (
          <OrganiserAuditDesk
            userSubmissions={userSubmittedList}
            onUpdateAudit={handleUpdateAudit}
            onDeleteSubmission={handleDeleteSubmission}
            onClearAllStorage={handleClearAllStorage}
            onRefreshCloud={handleRefreshCloud}
            onSelectSubmissionView={handleSelectSubmissionFromGallery}
          />
        )}

        {activeTab === 'faq' && (
          <FAQSection />
        )}
      </main>

      {/* Prajna Footer */}
      <PrajnaFooter
        onOpenJuryLogin={() => setActiveTab('jury')}
        onOpenOrganiserDesk={() => setActiveTab('organiser')}
      />
    </div>
  );
}

export default App;
