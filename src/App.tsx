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
  clearAllCloudSubmissions
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

  // Real-time Cloud Database Synchronization & Auto-Polling
  useEffect(() => {
    let inFlight = false;

    const syncData = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const list = await fetchCloudSubmissions();
        if (list && Array.isArray(list) && list.length > 0) {
          setUserSubmittedList(list);
        }
      } catch (e) {
        console.error('Auto-sync error:', e);
      } finally {
        inFlight = false;
      }
    };

    // Initial load
    syncData();

    // Smooth periodic background refresh (every 15s when active tab is open)
    const interval = setInterval(() => {
      if (!document.hidden) {
        syncData();
      }
    }, 15000);

    // Immediate sync on window focus / visibility change
    const handleFocusOrVisible = () => {
      if (!document.hidden) {
        syncData();
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
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

  // Update school marquee list dynamically from ALL registered/submitted teams in the queue (without waiting for organiser approval!)
  useEffect(() => {
    const submittedTeamEntries: SchoolEntry[] = userSubmittedList
      .filter(s => s && s.team && (s.team.teamName || s.team.schoolName))
      .map((s, idx) => {
        const isVerified = s.auditInfo?.status === 'VERIFIED';
        return {
          id: `team-queue-${s.id || idx}`,
          name: s.team.schoolName || 'Tamil Nadu School',
          teamName: s.team.teamName || 'Innovation Team',
          district: s.team.schoolDistrict || s.problem?.district || 'Tamil Nadu',
          badgeSymbol: isVerified ? '🏆' : '🚀',
          category: isVerified ? 'Verified Finalist' : 'Submitted Team (Queue)',
          status: s.auditInfo?.status || 'PENDING_APPROVAL',
          submissionId: s.id
        };
      });

    // Merge with initial partner schools without duplicates
    const combined = [...submittedTeamEntries];
    INITIAL_SCHOOLS.forEach(initSch => {
      const exists = combined.some(c => c.name.toLowerCase() === initSch.name.toLowerCase());
      if (!exists) {
        combined.push(initSch);
      }
    });

    setSchools(combined);
  }, [userSubmittedList]);

  const handleSubmissionComplete = async (submission: FullSubmission) => {
    const gatedSubmission: FullSubmission = {
      ...submission,
      auditInfo: {
        status: 'PENDING_APPROVAL',
        auditDate: new Date().toLocaleDateString('en-IN')
      }
    };

    setCurrentSubmission(gatedSubmission);
    // Optimistically update list so it instantly appears in organiser desk & queue
    setUserSubmittedList(prev => [gatedSubmission, ...prev.filter(s => s.id !== gatedSubmission.id)]);
    
    // Send to cloud database
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
    await clearAllCloudSubmissions();
    setUserSubmittedList([]);
    setCurrentSubmission(null);
    alert('All cloud database records & local browser cache have been cleared.');
  };

  return (
    <div className="min-h-screen bg-[#150000] text-white font-sans selection:bg-[#FFD700] selection:text-[#2A0000]">
      {/* Header Bar */}
      <HeaderNav
        activeTab={activeTab as any}
        setActiveTab={(t) => {
          setIsIntroVideoOpen(false);
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
              onStartClick={() => {
                setIsIntroVideoOpen(false);
                setActiveTab('submit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRulesClick={() => {
                const el = document.getElementById('guidelines-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              lang={lang}
              schools={schools}
            />

            {/* Sainik - A Way of Life Video Section */}
            <div id="principal-video-anchor">
              <PrincipalVideoSection />
            </div>

            <div id="guidelines-anchor">
              <GuidelinesSection onGoToForm={() => {
                setIsIntroVideoOpen(false);
                setActiveTab('submit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <SubmissionForm
            onSubmissionComplete={handleSubmissionComplete}
            lang={lang}
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
        onOpenJuryLogin={() => {
          setIsIntroVideoOpen(false);
          setActiveTab('jury');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenOrganiserDesk={() => {
          setIsIntroVideoOpen(false);
          setActiveTab('organiser');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
