import React, { useState } from 'react';
import type { FullSubmission, TeamDetails, ProblemDetails, SolutionFeasibility, AIReadiness, Declaration } from '../../types/prajna';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { GOVT_DEPARTMENTS } from '../../data/govtDepartments';
import { PhotoUploader } from './PhotoUploader';
import { SDGGridSelector } from './SDGGridSelector';
import { AIReadinessForm } from './AIReadinessForm';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { Send, Save, CheckCircle2, FileText, Sparkles, Building, MapPin } from 'lucide-react';

interface SubmissionFormProps {
  onSubmissionComplete: (submission: FullSubmission) => void;
  lang?: Language;
  onNewSchoolRegistered?: (schoolName: string, district: string) => void;
}

const INITIAL_SUBMISSION: FullSubmission = {
  id: `PRJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  submissionDate: new Date().toISOString().split('T')[0],
  team: {
    schoolName: '',
    schoolDistrict: 'Tiruppur',
    schoolAddress: '',
    teamName: '',
    teamCategory: 'Senior (Grades 11 & 12)',
    teamLeadName: '',
    teamLeadPhone: '',
    teamLeadEmail: '',
    member2Name: '',
    member3Name: '',
    guideTeacherName: '',
    guideTeacherPhone: '',
    guideTeacherEmail: ''
  },
  problem: {
    problemTitle: '',
    problemLocation: '',
    district: 'Tiruppur',
    responsibleDept: 'Public Works Department (PWD)',
    stakeholdersAffected: '',
    whyItMatters: '',
    photoCloseUp: '',
    photoWideAngle: '',
    photoTeamOnSite: '',
    videoUrl: ''
  },
  solution: {
    solutionSummary: '',
    uniqueness: '',
    resourcesRequired: '',
    estimatedCost: '',
    estimatedTime: '',
    expectedImpact: '',
    canBecomeStartup: 'Maybe',
    whoWouldPay: ['Government', 'Public'],
    potentialBeneficiaries: '',
    incubationSupport: 'Yes',
    iprFiling: 'Need Guidance'
  },
  sdg: {
    selectedSdgs: [6, 11]
  },
  ai: {
    usedAI: 'No',
    aiTools: [],
    aiPurposes: [],
    aiDeclaration: false
  },
  attachments: {
    pptFileName: '',
    pdfReportFileName: '',
    prototypeImagesFileName: '',
    cadDrawingsFileName: '',
    researchDocsFileName: ''
  },
  declaration: {
    photoPermission: false,
    truthfulInfo: false,
    originalIdea: false,
    promotionalUse: false,
    abideRules: false
  }
};

const DISTRICTS_TN = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode',
  'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet',
  'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const PAYING_STAKEHOLDERS = [
  'Government',
  'Schools',
  'Industries',
  'Public',
  'NGOs',
  'CSR',
  'Private Companies',
  'Beneficiaries'
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  onSubmissionComplete,
  lang = 'en',
  onNewSchoolRegistered
}) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState<FullSubmission>(() => {
    try {
      const saved = localStorage.getItem('prajna_2026_draft');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSION;
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
      return INITIAL_SUBMISSION;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedSubmission, setCompletedSubmission] = useState<FullSubmission | null>(null);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('prajna_2026_draft', JSON.stringify(formData));
    } catch (e) {
      console.warn('LocalStorage save quota exceeded (ignored gracefully):', e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const updateTeam = (field: keyof TeamDetails, value: any) => {
    setFormData(prev => ({ ...prev, team: { ...prev.team, [field]: value } }));
  };

  const updateProblem = (field: keyof ProblemDetails, value: any) => {
    setFormData(prev => ({ ...prev, problem: { ...prev.problem, [field]: value } }));
  };

  const updateSolution = (field: keyof SolutionFeasibility, value: any) => {
    setFormData(prev => ({ ...prev, solution: { ...prev.solution, [field]: value } }));
  };

  const togglePayingStakeholder = (stakeholder: string) => {
    const current = formData.solution.whoWouldPay || [];
    if (current.includes(stakeholder)) {
      updateSolution('whoWouldPay', current.filter(s => s !== stakeholder));
    } else {
      updateSolution('whoWouldPay', [...current, stakeholder]);
    }
  };

  const updateAI = (field: keyof AIReadiness, value: any) => {
    setFormData(prev => ({ ...prev, ai: { ...prev.ai, [field]: value } }));
  };

  const updateDeclaration = (field: keyof Declaration, value: boolean) => {
    setFormData(prev => ({ ...prev, declaration: { ...prev.declaration, [field]: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = formData.declaration;
    if (!d.photoPermission || !d.truthfulInfo || !d.originalIdea || !d.promotionalUse || !d.abideRules) {
      alert('⚠️ Please complete and check all 5 items in Section 9 (Declaration) before submitting.');
      return;
    }

    if (formData.team.schoolName && onNewSchoolRegistered) {
      onNewSchoolRegistered(formData.team.schoolName, formData.team.schoolDistrict);
    }

    const gatedSubmission: FullSubmission = {
      ...formData,
      auditInfo: {
        status: 'PENDING_APPROVAL',
        auditDate: new Date().toLocaleDateString('en-IN')
      }
    };

    // Save final submission safely & trigger Cloud Sync immediately
    handleSaveDraft();
    setCompletedSubmission(gatedSubmission);
    setShowSuccessModal(true);
    onSubmissionComplete(gatedSubmission);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Registration Success Modal */}
      {completedSubmission && (
        <SubmissionSuccessModal
          submission={completedSubmission}
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onSubmissionComplete(completedSubmission);
          }}
          onViewScorecard={() => {
            setShowSuccessModal(false);
            onSubmissionComplete(completedSubmission);
          }}
        />
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-[#FFD700] text-[#2A0000] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
            Official Innovation Submission Portal
          </span>
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-[#1F0000] text-amber-200 hover:text-white px-3.5 py-1.5 rounded-lg border border-[#D4AF37]/40 text-xs font-bold transition"
          >
            <Save className="w-4 h-4 text-[#FFD700]" />
            <span>{savedSuccess ? 'Draft Saved!' : t.saveDraft}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
          {t.submissionFormTitle}
        </h1>
        <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-3xl">
          Complete the field observation metrics, geotagged problem ownership, feasibility analysis, and 3 mandatory authenticity photos below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================= SECTION 1: PARTICIPANT & SCHOOL DETAILS ================= */}
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
            <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                {t.sec1Title}
              </h3>
              <p className="text-xs text-amber-200/70">Enter official school details & team contact information.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.schoolName} *</label>
              <input
                type="text"
                required
                value={formData.team.schoolName}
                onChange={(e) => updateTeam('schoolName', e.target.value)}
                placeholder="e.g. Govt Higher Secondary School, Udumalpet"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.schoolDistrict} *</label>
              <select
                value={formData.team.schoolDistrict}
                onChange={(e) => updateTeam('schoolDistrict', e.target.value)}
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                {DISTRICTS_TN.map((d) => (
                  <option key={d} value={d} className="bg-[#1F0000] text-white">{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.teamName} *</label>
              <input
                type="text"
                required
                value={formData.team.teamName}
                onChange={(e) => updateTeam('teamName', e.target.value)}
                placeholder="e.g. Amaravathi Eco Innovators"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.teamCategory} *</label>
              <input
                type="text"
                disabled
                value="Senior (Grades 11 & 12)"
                className="w-full bg-[#150000] border border-[#D4AF37]/20 rounded-xl px-3 py-2.5 text-xs text-amber-200 font-bold opacity-80"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.teamLeadName} *</label>
              <input
                type="text"
                required
                value={formData.team.teamLeadName}
                onChange={(e) => updateTeam('teamLeadName', e.target.value)}
                placeholder="Student Team Lead Full Name"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.teamLeadPhone} *</label>
              <input
                type="tel"
                required
                value={formData.team.teamLeadPhone}
                onChange={(e) => updateTeam('teamLeadPhone', e.target.value)}
                placeholder="10-digit WhatsApp Number"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">Team Lead Email (Optional)</label>
              <input
                type="email"
                value={formData.team.teamLeadEmail || ''}
                onChange={(e) => updateTeam('teamLeadEmail', e.target.value)}
                placeholder="student@gmail.com"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.member2Name} *</label>
              <input
                type="text"
                required
                value={formData.team.member2Name}
                onChange={(e) => updateTeam('member2Name', e.target.value)}
                placeholder="2nd Student Member Full Name"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.member3Name} *</label>
              <input
                type="text"
                required
                value={formData.team.member3Name}
                onChange={(e) => updateTeam('member3Name', e.target.value)}
                placeholder="3rd Student Member Full Name"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.guideTeacherName} *</label>
              <input
                type="text"
                required
                value={formData.team.guideTeacherName}
                onChange={(e) => updateTeam('guideTeacherName', e.target.value)}
                placeholder="Escort / Guide Teacher Full Name"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.guideTeacherPhone} *</label>
              <input
                type="tel"
                required
                value={formData.team.guideTeacherPhone}
                onChange={(e) => updateTeam('guideTeacherPhone', e.target.value)}
                placeholder="Teacher Contact Number"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">Teacher Email (Optional)</label>
              <input
                type="email"
                value={formData.team.guideTeacherEmail || ''}
                onChange={(e) => updateTeam('guideTeacherEmail', e.target.value)}
                placeholder="teacher@school.edu.in"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: LOCAL GEOTAGGED PROBLEM ================= */}
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
            <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                {t.sec2Title}
              </h3>
              <p className="text-xs text-amber-200/70">Identify a real, observable problem in your local neighborhood or campus.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.problemTitle} *</label>
              <input
                type="text"
                required
                value={formData.problem.problemTitle}
                onChange={(e) => updateProblem('problemTitle', e.target.value)}
                placeholder="e.g. Unfiltered Agricultural Drain Water Seepage in Village Well"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.problemLocation} *</label>
              <input
                type="text"
                required
                value={formData.problem.problemLocation}
                onChange={(e) => updateProblem('problemLocation', e.target.value)}
                placeholder="Exact village, street, or campus location (e.g. Main Gate, Kaniyur Village)"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-[#FFD700] uppercase tracking-wider">{t.responsibleDept} *</label>
              <select
                value={formData.problem.responsibleDept}
                onChange={(e) => updateProblem('responsibleDept', e.target.value)}
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-bold"
              >
                {GOVT_DEPARTMENTS.map((cat) => (
                  <optgroup key={cat.category} label={cat.category} className="bg-[#1F0000] text-[#FFD700] font-bold">
                    {cat.departments.map((d) => (
                      <option key={d.id} value={d.name} className="bg-[#1F0000] text-white font-normal">
                        {d.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.stakeholders} *</label>
              <input
                type="text"
                required
                value={formData.problem.stakeholdersAffected}
                onChange={(e) => updateProblem('stakeholdersAffected', e.target.value)}
                placeholder="e.g. 150 farming families, school children, local bus commuters"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.whyItMatters} *</label>
              <textarea
                required
                rows={3}
                value={formData.problem.whyItMatters}
                onChange={(e) => updateProblem('whyItMatters', e.target.value)}
                placeholder="Explain why this problem needs urgent resolution. What happens if ignored?"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: 3 MANDATORY PHOTOS ================= */}
        <PhotoUploader
          photoCloseUp={formData.problem.photoCloseUp || ''}
          photoWideAngle={formData.problem.photoWideAngle || ''}
          photoTeamOnSite={formData.problem.photoTeamOnSite || ''}
          videoUrl={formData.problem.videoUrl || ''}
          onChange={updateProblem}
        />

        {/* ================= SECTION 4 & 5: PROPOSED SOLUTION & FEASIBILITY ================= */}
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
            <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                {t.sec4Title}
              </h3>
              <p className="text-xs text-amber-200/70">Outline your practical, feasible solution and cost breakdown.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.solutionSummary} *</label>
              <textarea
                required
                rows={3}
                value={formData.solution.solutionSummary}
                onChange={(e) => updateSolution('solutionSummary', e.target.value)}
                placeholder="Describe your practical solution, mechanism, or prototype design."
                className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-bold text-amber-100">{t.uniqueness} *</label>
                <input
                  type="text"
                  required
                  value={formData.solution.uniqueness}
                  onChange={(e) => updateSolution('uniqueness', e.target.value)}
                  placeholder="What makes your approach novel or better than existing methods?"
                  className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-amber-100">{t.resources} *</label>
                <input
                  type="text"
                  required
                  value={formData.solution.resourcesRequired}
                  onChange={(e) => updateSolution('resourcesRequired', e.target.value)}
                  placeholder="e.g. PVC Pipes, Solar Sensor, Local Masonry"
                  className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-amber-100">{t.estimatedCost} *</label>
                <input
                  type="text"
                  required
                  value={formData.solution.estimatedCost}
                  onChange={(e) => updateSolution('estimatedCost', e.target.value)}
                  placeholder="Estimated budget in INR (e.g. ₹ 4,500)"
                  className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-amber-100">{t.estimatedTime} *</label>
                <input
                  type="text"
                  required
                  value={formData.solution.estimatedTime}
                  onChange={(e) => updateSolution('estimatedTime', e.target.value)}
                  placeholder="e.g. 2 Weeks, 1 Month"
                  className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-amber-100">{t.canBecomeStartup}</label>
              <div className="flex gap-4">
                {['Yes', 'No', 'Maybe'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="canBecomeStartup"
                      value={opt}
                      checked={formData.solution.canBecomeStartup === opt}
                      onChange={(e) => updateSolution('canBecomeStartup', e.target.value)}
                      className="accent-[#FFD700]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#FFD700] uppercase tracking-wider">
              {t.whoWouldPay}
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYING_STAKEHOLDERS.map((stk) => {
                const isSelected = (formData.solution.whoWouldPay || []).includes(stk);
                return (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => togglePayingStakeholder(stk)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-amber-400 text-[#2A0000] border-amber-300 font-bold'
                        : 'bg-[#1F0000] text-amber-100/80 border-[#D4AF37]/30'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {stk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block font-bold text-amber-100">{t.beneficiaries} *</label>
            <textarea
              required
              rows={2}
              value={formData.solution.potentialBeneficiaries}
              onChange={(e) => updateSolution('potentialBeneficiaries', e.target.value)}
              placeholder="Detail specifically who gains from this solution (local community members, farmers, municipal body, etc.)."
              className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
            />
          </div>
        </div>

        {/* ================= SECTION 6: SDG GRID SELECTOR ================= */}
        <SDGGridSelector
          selectedSdgs={formData.sdg.selectedSdgs}
          onChange={(selected) => setFormData(prev => ({ ...prev, sdg: { selectedSdgs: selected } }))}
        />

        {/* ================= SECTION 7: AI READINESS FORM ================= */}
        <AIReadinessForm
          aiData={formData.ai}
          onChange={updateAI}
        />

        {/* ================= SECTION 8: ATTACHMENTS (OPTIONAL) ================= */}
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
            <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                {t.sec8Title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3.5 rounded-xl space-y-2">
              <label className="text-xs font-bold text-amber-100">PPT Pitch Deck (Optional)</label>
              <input
                type="text"
                value={formData.attachments.pptFileName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, attachments: { ...prev.attachments, pptFileName: e.target.value } }))}
                placeholder="File name or Drive link"
                className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3.5 rounded-xl space-y-2">
              <label className="text-xs font-bold text-amber-100">PDF Report (Optional)</label>
              <input
                type="text"
                value={formData.attachments.pdfReportFileName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, attachments: { ...prev.attachments, pdfReportFileName: e.target.value } }))}
                placeholder="File name or Drive link"
                className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>

            <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3.5 rounded-xl space-y-2">
              <label className="text-xs font-bold text-amber-100">Prototype / CAD Drawings (Optional)</label>
              <input
                type="text"
                value={formData.attachments.cadDrawingsFileName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, attachments: { ...prev.attachments, cadDrawingsFileName: e.target.value } }))}
                placeholder="File name or CAD link"
                className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-amber-100/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 9: DECLARATION ================= */}
        <div className="bg-gradient-to-b from-[#2A0000] to-[#3D0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
            <div className="bg-[#FFD700] text-[#2A0000] p-2.5 rounded-xl font-black shadow-md">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#FFD700] font-serif uppercase tracking-wider">
                {t.sec9Title}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'photoPermission', label: 'The photographs are captured by our team on-site or used with verified permission.' },
              { key: 'truthfulInfo', label: 'The information and metrics provided in this dossier are true and accurate.' },
              { key: 'originalIdea', label: 'The proposed solution is the original work of our student team.' },
              { key: 'promotionalUse', label: 'Organizers may use submitted materials for evaluation, reports, publications, and promotional purposes with due acknowledgement.' },
              { key: 'abideRules', label: 'I agree to abide by all rules and military discipline guidelines of PRAJNA 2026.' }
            ].map(({ key, label }) => (
              <div key={key} className="bg-[#1F0000] border border-[#D4AF37]/30 p-3.5 rounded-xl flex items-start gap-3 hover:border-[#FFD700] transition">
                <input
                  type="checkbox"
                  id={key}
                  checked={formData.declaration[key as keyof Declaration]}
                  onChange={(e) => updateDeclaration(key as keyof Declaration, e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#FFD700] cursor-pointer"
                />
                <label htmlFor={key} className="text-xs text-amber-100 leading-snug cursor-pointer font-medium">
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D4AF37]/30">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto bg-[#1F0000] border border-[#D4AF37] text-[#FFD700] font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#2A0000] transition"
            >
              {t.saveDraft}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm shadow-xl transition-all bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#2A0000] hover:shadow-amber-500/40 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{t.submitDossier}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
