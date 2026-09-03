import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { EvaluationSheet } from './EvaluationSheet';
import { SDGS_DATA } from '../../data/sdgs';
import {
  ShieldCheck, Lock, Star, CheckCircle, Trophy, CheckCircle2,
  FileText, Eye, Maximize2, X, BookOpen,
  Sparkles, Building2, MapPin, Users, HelpCircle
} from 'lucide-react';

interface JuryPanelProps {
  userSubmissions: FullSubmission[];
}

export const JuryPanel: React.FC<JuryPanelProps> = ({ userSubmissions }) => {
  const [viewMode, setViewMode] = useState<'leaderboard' | 'login'>('leaderboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('prajna_jury_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);

  const allSubmissions = userSubmissions.filter(s => s && s.id && s.team && s.problem);
  const [selectedSub, setSelectedSub] = useState<FullSubmission | null>(allSubmissions.length > 0 ? allSubmissions[0] : null);

  // Auto-select first item if selectedSub is null but items exist
  React.useEffect(() => {
    if (!selectedSub && allSubmissions.length > 0) {
      setSelectedSub(allSubmissions[0]);
    }
  }, [allSubmissions.length]);

  // Jury View & Modal Controls
  const [activeJuryTab, setActiveJuryTab] = useState<'combined' | 'dossier' | 'scoring'>('combined');
  const [showFullDossierModal, setShowFullDossierModal] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  // Interactive Jury Scoring State
  const [scores, setScores] = useState<{
    authenticity: number;
    problemDepth: number;
    feasibility: number;
    sdgImpact: number;
    startupViability: number;
    notes: string;
  }>({
    authenticity: selectedSub?.evaluationScore?.authenticityScore || 25,
    problemDepth: selectedSub?.evaluationScore?.problemDepthScore || 24,
    feasibility: selectedSub?.evaluationScore?.solutionFeasibilityScore || 23,
    sdgImpact: selectedSub?.evaluationScore?.sdgImpactScore || 15,
    startupViability: selectedSub?.evaluationScore?.startupViabilityScore || 9,
    notes: 'Strong on-site photographic evidence and realistic government department mapping.'
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toUpperCase();
    if (
      clean === 'PRAJNA2026' ||
      clean === 'JURY123' ||
      clean === 'ADMIN' ||
      clean === 'JURY' ||
      clean === 'PRAJNA'
    ) {
      try {
        sessionStorage.setItem('prajna_jury_auth', 'true');
      } catch (e) {}
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const currentTotal = scores.authenticity + scores.problemDepth + scores.feasibility + scores.sdgImpact + scores.startupViability;

  const handleSaveJuryScore = () => {
    if (!selectedSub) return;
    selectedSub.evaluationScore = {
      authenticityScore: scores.authenticity,
      problemDepthScore: scores.problemDepth,
      solutionFeasibilityScore: scores.feasibility,
      sdgImpactScore: scores.sdgImpact,
      startupViabilityScore: scores.startupViability,
      totalScore: currentTotal,
      juryScored: true
    };
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const photosUploadedCount = selectedSub
    ? [selectedSub.problem.photoCloseUp, selectedSub.problem.photoWideAngle, selectedSub.problem.photoTeamOnSite].filter(Boolean).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 space-y-8 text-white">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#FFD700] shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
                PRAJNA 2026 Qualified Finalists & Live Jury Evaluation
              </h2>
              <p className="text-xs text-amber-100/80 mt-0.5">
                Official shortlist of community innovation projects. Jury members can review full field dossiers and score entries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                viewMode === 'leaderboard'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] border-[#FFD700] shadow'
                  : 'bg-[#1F0000] text-amber-200 border-[#D4AF37]/40 hover:text-white'
              }`}
            >
              🏆 Public Leaderboard
            </button>

            <button
              onClick={() => setViewMode('login')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                viewMode === 'login'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] border-[#FFD700] shadow'
                  : 'bg-[#1F0000] text-amber-200 border-[#D4AF37]/40 hover:text-white'
              }`}
            >
              🔒 Judge Scoring Desk
            </button>
          </div>
        </div>
      </div>

      {allSubmissions.length === 0 ? (
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <Trophy className="w-12 h-12 text-[#FFD700] mx-auto" />
          <h3 className="text-xl font-bold font-serif text-white">No Finalist Entries Registered Yet</h3>
          <p className="text-xs text-amber-100/70 max-w-md mx-auto leading-relaxed">
            Registered team submissions will appear on the Live Finalist Leaderboard as school teams complete their proposals.
          </p>
        </div>
      ) : (
        <>
          {/* Public Leaderboard View */}
          {viewMode === 'leaderboard' && (
            <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-lg font-bold text-white font-serif">Selected Finalist Projects</h3>
                </div>
                <span className="text-xs text-amber-200 font-bold bg-[#1F0000] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {allSubmissions.length} Projects Shortlisted
                </span>
              </div>

              <div className="space-y-4">
                {allSubmissions.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-[#FFD700] transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black rounded-xl flex items-center justify-center text-sm shadow shrink-0">
                        #{idx + 1}
                      </div>

                      <div className="space-y-1">
                        <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          {sub.team.schoolName} ({sub.problem.district})
                        </span>
                        <h4 className="font-extrabold text-white text-base font-serif">{sub.problem.problemTitle}</h4>
                        <p className="text-xs text-amber-200/70">
                          Team: <strong className="text-white">{sub.team.teamName}</strong> • Lead: {sub.team.teamLeadName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pre-Screening Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Judge Authentication Modal View */}
          {viewMode === 'login' && !isAuthenticated && (
            <div className="max-w-md mx-auto bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-8 space-y-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/40 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-white">Jury Panel Authentication</h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  Enter official evaluator passcode to access live scoring desk & field dossiers.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Evaluator Passcode</label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Evaluator Passcode"
                    className="w-full bg-[#1F0000] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
                  />
                  {passcodeError && (
                    <p className="text-xs text-rose-400 mt-1">Incorrect Passcode. Please check with event anchors.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black text-sm py-3.5 rounded-xl shadow-lg transition"
                >
                  Authenticate & Open Jury Desk
                </button>
              </form>
            </div>
          )}

          {/* Authenticated Judge Workspace */}
          {viewMode === 'login' && isAuthenticated && selectedSub && (
            <div className="space-y-6">
              {/* Controls & Workspace Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#2A0000] border-2 border-[#D4AF37] p-5 sm:p-6 rounded-2xl shadow-2xl">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
                      OFFICIAL JURY PANEL EVALUATION DESK
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                      Dossier ID: {selectedSub.id}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-white mt-1">
                    {selectedSub.problem.problemTitle}
                  </h2>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    {selectedSub.team.schoolName} ({selectedSub.problem.district}) • Team: <strong>{selectedSub.team.teamName}</strong> • Lead: {selectedSub.team.teamLeadName}
                  </p>
                </div>

                {/* View Tabs & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#150000] p-1 rounded-xl border border-[#D4AF37]/40">
                    <button
                      onClick={() => setActiveJuryTab('combined')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        activeJuryTab === 'combined'
                          ? 'bg-[#8B0000] text-[#FFD700] border border-[#FFD700]/50 shadow'
                          : 'text-amber-200/70 hover:text-white'
                      }`}
                    >
                      📋 Combined View
                    </button>
                    <button
                      onClick={() => setActiveJuryTab('dossier')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        activeJuryTab === 'dossier'
                          ? 'bg-[#8B0000] text-[#FFD700] border border-[#FFD700]/50 shadow'
                          : 'text-amber-200/70 hover:text-white'
                      }`}
                    >
                      📖 Idea Dossier
                    </button>
                    <button
                      onClick={() => setActiveJuryTab('scoring')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        activeJuryTab === 'scoring'
                          ? 'bg-[#8B0000] text-[#FFD700] border border-[#FFD700]/50 shadow'
                          : 'text-amber-200/70 hover:text-white'
                      }`}
                    >
                      ✍️ Scoring Matrix
                    </button>
                  </div>

                  <button
                    onClick={() => setShowFullDossierModal(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black text-xs px-3.5 py-2 rounded-xl shadow transition hover:from-[#FFD700] hover:to-[#D4AF37]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Printable Dossier Modal</span>
                  </button>

                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-xs text-amber-200/70 hover:text-white bg-[#1F0000] px-3 py-2 rounded-xl border border-[#D4AF37]/30 font-mono"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Main Evaluation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Finalists Leaderboard (4 Cols on desktop) */}
                <div className="lg:col-span-4 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <h3 className="font-bold font-serif text-white text-base">Shortlisted Entries</h3>
                    <span className="text-xs text-amber-200 font-bold bg-[#1F0000] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                      {allSubmissions.length} Finalists
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                    {allSubmissions.map((sub, idx) => {
                      const isSelected = selectedSub.id === sub.id;
                      const scoreVal = sub.evaluationScore?.totalScore || 90;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSub(sub);
                            setScores({
                              authenticity: sub.evaluationScore?.authenticityScore || 25,
                              problemDepth: sub.evaluationScore?.problemDepthScore || 24,
                              feasibility: sub.evaluationScore?.solutionFeasibilityScore || 23,
                              sdgImpact: sub.evaluationScore?.sdgImpactScore || 15,
                              startupViability: sub.evaluationScore?.startupViabilityScore || 9,
                              notes: 'Strong evidence and practical metrics.'
                            });
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#8B0000] border-[#FFD700] text-white shadow-lg ring-1 ring-[#FFD700]'
                              : 'bg-[#1F0000] border-[#D4AF37]/30 text-amber-100/80 hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-black text-[#FFD700] bg-[#150000] px-2 py-1 rounded border border-[#D4AF37]/30">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white line-clamp-1">{sub.problem.problemTitle}</div>
                              <div className="text-[10px] text-amber-200/70 line-clamp-1">{sub.team.schoolName}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-[#FFD700] bg-[#150000] px-2 py-1 rounded shrink-0">
                            {scoreVal}/100
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Dossier Details & Scoring Panel (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Idea Dossier Overview Card (Shown in Combined and Dossier Tabs) */}
                  {(activeJuryTab === 'combined' || activeJuryTab === 'dossier') && (
                    <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
                      {/* Dossier Card Header */}
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#FFD700]" />
                          <h3 className="text-lg font-black font-serif text-white">
                            FIELD DOSSIER: Complete Innovation Brief
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowFullDossierModal(true)}
                          className="flex items-center gap-1 text-xs text-[#FFD700] hover:underline font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Official PDF Dossier</span>
                        </button>
                      </div>

                      {/* Section 1: Team & School Profile */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-2.5 py-1 rounded border border-[#D4AF37]/30">
                          1. School & Team Profile
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div>
                            <span className="text-amber-200/70">School Name:</span>{' '}
                            <strong className="text-white">{selectedSub.team.schoolName}</strong>
                          </div>
                          <div>
                            <span className="text-amber-200/70">District:</span>{' '}
                            <strong className="text-white">{selectedSub.team.schoolDistrict || selectedSub.problem.district}</strong>
                          </div>
                          <div>
                            <span className="text-amber-200/70">Team Name:</span>{' '}
                            <strong className="text-white">{selectedSub.team.teamName}</strong> ({selectedSub.team.teamCategory})
                          </div>
                          <div>
                            <span className="text-amber-200/70">Team Lead:</span>{' '}
                            <strong className="text-white">{selectedSub.team.teamLeadName}</strong> ({selectedSub.team.teamLeadPhone})
                          </div>
                          <div>
                            <span className="text-amber-200/70">Members:</span>{' '}
                            <span className="text-amber-100">{selectedSub.team.member2Name}, {selectedSub.team.member3Name}</span>
                          </div>
                          <div>
                            <span className="text-amber-200/70">Guide Teacher:</span>{' '}
                            <span className="text-amber-100">{selectedSub.team.guideTeacherName} ({selectedSub.team.guideTeacherPhone})</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Problem Statement & Root Cause */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-2.5 py-1 rounded border border-[#D4AF37]/30">
                          2. Geotagged Local Issue & Government Ownership
                        </span>
                        <div className="space-y-3 text-xs bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div>
                            <span className="text-amber-200/70 font-bold block mb-0.5">Problem Title:</span>
                            <h4 className="text-sm font-extrabold text-[#FFD700]">{selectedSub.problem.problemTitle}</h4>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-amber-200/70 font-bold flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Geotagged Location:
                              </span>
                              <span className="text-white">{selectedSub.problem.problemLocation}</span>
                            </div>

                            <div>
                              <span className="text-amber-200/70 font-bold flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Responsible Govt Dept:
                              </span>
                              <span className="bg-[#8B0000] text-[#FFD700] font-extrabold px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                                {selectedSub.problem.responsibleDept}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-amber-200/70 font-bold flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-400" /> Affected Stakeholders:
                            </span>
                            <span className="text-amber-100">{selectedSub.problem.stakeholdersAffected}</span>
                          </div>

                          <div>
                            <span className="text-amber-200/70 font-bold flex items-center gap-1 mb-1">
                              <HelpCircle className="w-3.5 h-3.5 text-[#FFD700]" /> Why Problem Matters (Root Factor Analysis):
                            </span>
                            <div className="bg-[#150000] p-3 rounded-lg border border-[#D4AF37]/20 text-amber-100/90 leading-relaxed font-normal">
                              {selectedSub.problem.whyItMatters || 'No root factor analysis provided.'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Photo Verification Evidence */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-2.5 py-1 rounded border border-[#D4AF37]/30">
                            3. On-Site Photo Verification Evidence ({photosUploadedCount}/3 Uploaded)
                          </span>
                          <span className="text-[10px] text-amber-200/70 italic">Click image to enlarge</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Close Up */}
                          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-2 rounded-xl text-center space-y-1.5">
                            <div className="text-[10px] font-bold text-amber-200 uppercase">1. Close-Up View</div>
                            {selectedSub.problem.photoCloseUp ? (
                              <div
                                onClick={() => setPreviewPhoto({ url: selectedSub.problem.photoCloseUp!, title: '1. Close-Up View Evidence' })}
                                className="relative group cursor-pointer overflow-hidden rounded-lg border border-[#D4AF37]/30"
                              >
                                <img
                                  src={selectedSub.problem.photoCloseUp}
                                  alt="Close-Up"
                                  className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                  <Maximize2 className="w-5 h-5 text-[#FFD700]" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-28 bg-[#150000] rounded-lg flex items-center justify-center text-[10px] text-amber-200/40">
                                No Photo Uploaded
                              </div>
                            )}
                          </div>

                          {/* Wide Angle */}
                          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-2 rounded-xl text-center space-y-1.5">
                            <div className="text-[10px] font-bold text-amber-200 uppercase">2. Wide-Angle Context</div>
                            {selectedSub.problem.photoWideAngle ? (
                              <div
                                onClick={() => setPreviewPhoto({ url: selectedSub.problem.photoWideAngle!, title: '2. Wide-Angle Context Evidence' })}
                                className="relative group cursor-pointer overflow-hidden rounded-lg border border-[#D4AF37]/30"
                              >
                                <img
                                  src={selectedSub.problem.photoWideAngle}
                                  alt="Wide-Angle"
                                  className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                  <Maximize2 className="w-5 h-5 text-[#FFD700]" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-28 bg-[#150000] rounded-lg flex items-center justify-center text-[10px] text-amber-200/40">
                                No Photo Uploaded
                              </div>
                            )}
                          </div>

                          {/* Team On-Site */}
                          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-2 rounded-xl text-center space-y-1.5">
                            <div className="text-[10px] font-bold text-amber-200 uppercase">3. Team On-Site</div>
                            {selectedSub.problem.photoTeamOnSite ? (
                              <div
                                onClick={() => setPreviewPhoto({ url: selectedSub.problem.photoTeamOnSite!, title: '3. Team On-Site Verification' })}
                                className="relative group cursor-pointer overflow-hidden rounded-lg border border-[#D4AF37]/30"
                              >
                                <img
                                  src={selectedSub.problem.photoTeamOnSite}
                                  alt="Team On-Site"
                                  className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                  <Maximize2 className="w-5 h-5 text-[#FFD700]" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-28 bg-[#150000] rounded-lg flex items-center justify-center text-[10px] text-amber-200/40">
                                No Photo Uploaded
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Proposed Solution & Technical Specs */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-2.5 py-1 rounded border border-[#D4AF37]/30">
                          4. Proposed Solution & Costing Specifications
                        </span>
                        <div className="space-y-3 text-xs bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div>
                            <span className="text-amber-200/70 font-bold block mb-1">Solution Summary:</span>
                            <div className="bg-[#150000] p-3 rounded-lg border border-[#D4AF37]/20 text-amber-100/90 leading-relaxed font-normal">
                              {selectedSub.solution.solutionSummary}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-amber-200/70 font-bold">Uniqueness:</span>{' '}
                              <span className="text-amber-100">{selectedSub.solution.uniqueness}</span>
                            </div>
                            <div>
                              <span className="text-amber-200/70 font-bold">Required Resources:</span>{' '}
                              <span className="text-amber-100">{selectedSub.solution.resourcesRequired}</span>
                            </div>
                            <div>
                              <span className="text-amber-200/70 font-bold">Estimated Cost:</span>{' '}
                              <strong className="text-[#FFD700]">₹ {selectedSub.solution.estimatedCost}</strong>
                            </div>
                            <div>
                              <span className="text-amber-200/70 font-bold">Estimated Timeframe:</span>{' '}
                              <span className="text-amber-100">{selectedSub.solution.estimatedTime}</span>
                            </div>
                            <div>
                              <span className="text-amber-200/70 font-bold">Startup Viability:</span>{' '}
                              <strong className="text-emerald-400">{selectedSub.solution.canBecomeStartup}</strong>
                            </div>
                            <div>
                              <span className="text-amber-200/70 font-bold">Paying Stakeholders:</span>{' '}
                              <span className="text-amber-100">{(selectedSub.solution.whoWouldPay || []).join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 5: SDGs & AI Usage */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider block mb-1">
                            Mapped UN SDGs ({(selectedSub.sdg.selectedSdgs || []).length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedSub.sdg.selectedSdgs || []).map(sdgId => {
                              const sdgItem = SDGS_DATA.find(s => s.id === sdgId);
                              return (
                                <span
                                  key={sdgId}
                                  style={{ backgroundColor: sdgItem?.color || '#8B0000' }}
                                  className="text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"
                                >
                                  SDG {sdgId}: {sdgItem?.shortTitle || ''}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30 text-xs">
                          <span className="text-[10px] font-extrabold text-[#FFD700] uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Sparkles className="w-3.5 h-3.5" /> AI Usage Transparency
                          </span>
                          <div className="text-amber-100 space-y-1">
                            <div>Used AI: <strong>{selectedSub.ai.usedAI}</strong></div>
                            {selectedSub.ai.usedAI === 'Yes' && (
                              <div className="text-[11px] text-amber-200/80">
                                Tools: {(selectedSub.ai.aiTools || []).join(', ')} | Purposes: {(selectedSub.ai.aiPurposes || []).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Jury Scoring Matrix (Shown in Combined and Scoring Tabs) */}
                  {(activeJuryTab === 'combined' || activeJuryTab === 'scoring') && (
                    <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
                        <div>
                          <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Live Evaluation Matrix</span>
                          <h3 className="text-xl font-black font-serif text-white">Rate Submission Marks (Max 100)</h3>
                          <p className="text-xs text-amber-200/70 mt-0.5">
                            Adjust sliders below according to field evidence completeness, problem depth, solution feasibility, SDG impact, and scalability.
                          </p>
                        </div>

                        <div className="bg-[#1F0000] border-2 border-[#FFD700] px-4 py-2 rounded-2xl text-center shrink-0">
                          <div className="text-[10px] font-bold text-[#FFD700] uppercase">Total Marks</div>
                          <div className="text-2xl font-black font-mono text-white">{currentTotal}/100</div>
                        </div>
                      </div>

                      {/* 5 Evaluation Criteria Sliders */}
                      <div className="space-y-5 text-xs">
                        {/* Criterion 1 */}
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div className="flex justify-between font-bold text-white">
                            <span>1. On-Site Authenticity & 3-Photo Evidence (Max 25)</span>
                            <span className="text-[#FFD700] font-mono">{scores.authenticity} / 25</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={scores.authenticity}
                            onChange={(e) => setScores(prev => ({ ...prev, authenticity: Number(e.target.value) }))}
                            className="w-full accent-[#FFD700]"
                          />
                        </div>

                        {/* Criterion 2 */}
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div className="flex justify-between font-bold text-white">
                            <span>2. Geotagged Problem Depth & Govt Department Ownership (Max 25)</span>
                            <span className="text-[#FFD700] font-mono">{scores.problemDepth} / 25</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={scores.problemDepth}
                            onChange={(e) => setScores(prev => ({ ...prev, problemDepth: Number(e.target.value) }))}
                            className="w-full accent-[#FFD700]"
                          />
                        </div>

                        {/* Criterion 3 */}
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div className="flex justify-between font-bold text-white">
                            <span>3. Technical Solution Feasibility, Costing & Timeline (Max 25)</span>
                            <span className="text-[#FFD700] font-mono">{scores.feasibility} / 25</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={scores.feasibility}
                            onChange={(e) => setScores(prev => ({ ...prev, feasibility: Number(e.target.value) }))}
                            className="w-full accent-[#FFD700]"
                          />
                        </div>

                        {/* Criterion 4 */}
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div className="flex justify-between font-bold text-white">
                            <span>4. UN SDG Impact Alignment (Max 15)</span>
                            <span className="text-[#FFD700] font-mono">{scores.sdgImpact} / 15</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="15"
                            value={scores.sdgImpact}
                            onChange={(e) => setScores(prev => ({ ...prev, sdgImpact: Number(e.target.value) }))}
                            className="w-full accent-[#FFD700]"
                          />
                        </div>

                        {/* Criterion 5 */}
                        <div className="space-y-2 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
                          <div className="flex justify-between font-bold text-white">
                            <span>5. Commercial & Startup Scalability (Max 10)</span>
                            <span className="text-[#FFD700] font-mono">{scores.startupViability} / 10</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={scores.startupViability}
                            onChange={(e) => setScores(prev => ({ ...prev, startupViability: Number(e.target.value) }))}
                            className="w-full accent-[#FFD700]"
                          />
                        </div>
                      </div>

                      {savedSuccessMsg && (
                        <div className="bg-emerald-950 border border-emerald-500/50 p-3 rounded-xl text-center text-xs font-bold text-emerald-300">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Jury Evaluation Score Saved Successfully!
                        </div>
                      )}

                      <button
                        onClick={handleSaveJuryScore}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-black text-sm py-3.5 rounded-xl shadow-lg transition"
                      >
                        Save & Submit Official Jury Marks ({currentTotal}/100)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Lightbox Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#1F0000] border-2 border-[#D4AF37] rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h4 className="text-sm font-bold text-[#FFD700] font-serif">{previewPhoto.title}</h4>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 rounded-lg bg-[#2A0000] text-amber-200 hover:text-white border border-[#D4AF37]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full Official Field Dossier Printable PDF Modal Overlay */}
      {showFullDossierModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative max-w-5xl w-full bg-[#1A0000] border-2 border-[#D4AF37] rounded-2xl overflow-hidden shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-[#2A0000] p-4 border-b border-[#D4AF37]/40 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FFD700]" />
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  Official Field Dossier View — Ref ID: <span className="text-[#FFD700] font-mono">{selectedSub.id}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowFullDossierModal(false)}
                className="p-1.5 rounded-xl bg-[#1F0000] text-amber-200 hover:text-white border border-[#D4AF37]/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Renders full EvaluationSheet component */}
            <div className="overflow-y-auto p-4 flex-1">
              <EvaluationSheet submission={selectedSub} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

