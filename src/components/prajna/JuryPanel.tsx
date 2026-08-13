import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { ShieldCheck, Lock, Star, CheckCircle, Trophy, CheckCircle2 } from 'lucide-react';

interface JuryPanelProps {
  userSubmissions: FullSubmission[];
}

export const JuryPanel: React.FC<JuryPanelProps> = ({ userSubmissions }) => {
  const [viewMode, setViewMode] = useState<'leaderboard' | 'login'>('leaderboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);

  const allSubmissions = userSubmissions;
  const [selectedSub, setSelectedSub] = useState<FullSubmission | null>(allSubmissions.length > 0 ? allSubmissions[0] : null);

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
    if (passcode.trim() === 'PRAJNA2026' || passcode.trim() === 'JURY123' || passcode.trim() === 'admin') {
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
              PRAJNA 2026 Qualified Finalists & Live Standings
            </h2>
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
              🔒 Judge Scoring Access
            </button>
          </div>
        </div>
        <p className="text-xs text-amber-100/80">
          Official shortlist of community innovation projects selected for Event Day.
        </p>
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

          {/* Judge Login & Scoring Portal View */}
          {viewMode === 'login' && !isAuthenticated && (
            <div className="max-w-md mx-auto bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-8 space-y-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/40 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-white">Jury Panel Authentication</h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  Enter official evaluator passcode to access live scoring desk.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Evaluator Passcode</label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Passcode (PRAJNA2026)"
                    className="w-full bg-[#1F0000] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
                  />
                  {passcodeError && (
                    <p className="text-xs text-rose-400 mt-1">Incorrect Passcode. Try PRAJNA2026</p>
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

          {/* Authenticated Judge Live Matrix Desk */}
          {viewMode === 'login' && isAuthenticated && selectedSub && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2A0000] border-2 border-[#D4AF37] p-6 rounded-2xl shadow-2xl">
                <div>
                  <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
                    OFFICIAL JURY PANEL PORTAL
                  </span>
                  <h2 className="text-2xl font-black font-serif text-white mt-1">
                    PRAJNA 2026 Evaluation Matrix & Finalist Leaderboard
                  </h2>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-xs text-amber-200/70 hover:text-white bg-[#1F0000] px-3.5 py-2 rounded-xl border border-[#D4AF37]/30 font-mono"
                >
                  Logout Jury Mode
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Finalists List */}
                <div className="lg:col-span-5 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <h3 className="font-bold font-serif text-white text-base">Leaderboard & Entries</h3>
                    <span className="text-xs text-amber-200 font-bold">{allSubmissions.length} Projects</span>
                  </div>

                  <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
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
                              ? 'bg-[#8B0000] border-[#FFD700] text-white shadow-lg'
                              : 'bg-[#1F0000] border-[#D4AF37]/30 text-amber-100/80 hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-black text-[#FFD700] bg-[#150000] px-2 py-1 rounded border border-[#D4AF37]/30">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white line-clamp-1">{sub.problem.problemTitle}</div>
                              <div className="text-[10px] text-amber-200/70">{sub.team.schoolName}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-[#FFD700] bg-[#150000] px-2 py-1 rounded">
                            {scoreVal}/100
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Entry Jury Matrix Form */}
                <div className="lg:col-span-7 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Currently Evaluating</span>
                      <h3 className="text-xl font-black font-serif text-white">{selectedSub.problem.problemTitle}</h3>
                      <p className="text-xs text-amber-200/70 mt-0.5">
                        {selectedSub.team.schoolName} ({selectedSub.problem.district}) • Lead: {selectedSub.team.teamLeadName}
                      </p>
                    </div>

                    <div className="bg-[#1F0000] border-2 border-[#FFD700] px-4 py-2 rounded-2xl text-center shrink-0">
                      <div className="text-[10px] font-bold text-[#FFD700] uppercase">Live Score</div>
                      <div className="text-xl font-black font-mono text-white">{currentTotal}/100</div>
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
