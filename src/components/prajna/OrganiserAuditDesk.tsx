import React, { useState } from 'react';
import type { FullSubmission, AuditStatus } from '../../types/prajna';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search, Lock, RefreshCw, Eye, MessageSquare, Image, Copy, Trash2, RotateCcw } from 'lucide-react';

interface OrganiserAuditDeskProps {
  userSubmissions: FullSubmission[];
  onUpdateAudit: (submissionId: string, status: AuditStatus, remark?: string) => void;
  onDeleteSubmission?: (submissionId: string) => void;
  onClearAllStorage?: () => void;
  onRefreshCloud?: () => void;
  onSelectSubmissionView?: (sub: FullSubmission) => void;
}

export const OrganiserAuditDesk: React.FC<OrganiserAuditDeskProps> = ({
  userSubmissions,
  onUpdateAudit,
  onDeleteSubmission,
  onClearAllStorage,
  onRefreshCloud,
  onSelectSubmissionView
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'PENDING_APPROVAL' | 'VERIFIED' | 'REVISION_REQUESTED' | 'REJECTED'>('all');
  const [activeRemarkId, setActiveRemarkId] = useState<string | null>(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const allSubmissions = userSubmissions;
  const pendingCount = allSubmissions.filter(s => (s.auditInfo?.status || 'PENDING_APPROVAL') === 'PENDING_APPROVAL').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'ORGANISER2026' || passcode === 'PRAJNA2026' || passcode === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Organiser Passcode. Please contact Team Prajna Secretariat.');
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshCloud) {
      await onRefreshCloud();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Automatic Duplicate Idea Scanner
  const checkForDuplicates = (sub: FullSubmission) => {
    const title = sub.problem.problemTitle.toLowerCase();
    const matches = allSubmissions.filter(s => s.id !== sub.id && s.problem.problemTitle.toLowerCase().includes(title.substring(0, 15)));
    return matches.length > 0 ? matches[0] : null;
  };

  // Photo Completeness Check
  const getPhotoAudit = (sub: FullSubmission) => {
    const photos = [sub.problem.photoCloseUp, sub.problem.photoWideAngle, sub.problem.photoTeamOnSite].filter(Boolean);
    return {
      count: photos.length,
      complete: photos.length === 3
    };
  };

  const filteredSubmissions = allSubmissions.filter(sub => {
    const textMatch =
      sub.team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.problem.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!textMatch) return false;

    const auditStatus = sub.auditInfo?.status || 'PENDING_APPROVAL';
    if (filterStatus === 'all') return true;
    if (filterStatus === 'flagged') {
      const photoAudit = getPhotoAudit(sub);
      const dup = checkForDuplicates(sub);
      return !photoAudit.complete || Boolean(dup) || auditStatus === 'REVISION_REQUESTED';
    }
    return auditStatus === filterStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-8 shadow-2xl space-y-6 text-center text-white">
          <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">Organiser Audit & Verification Desk</h2>
            <p className="text-xs text-amber-200/70 mt-1">
              Restricted portal for Team Prajna Event Anchors to verify 3-photo field authenticity & original ideas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase mb-1">Organiser Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter Passcode (ORGANISER2026)"
                className="w-full bg-[#1F0000] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-black text-sm py-3 rounded-xl shadow-lg transition"
            >
              Authenticate & Open Audit Desk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-8 text-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2A0000] border-2 border-[#D4AF37] p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-[#8B0000] text-[#FFD700] p-3 rounded-xl border border-[#D4AF37]/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-serif text-white">Organiser Verification & Audit Desk</h2>
              <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4AF37]">
                ORGANISER ACCESS
              </span>
            </div>
            <p className="text-xs text-amber-200/80">
              Verify 3-photo physical authenticity, scan for duplicate ideas, delete entries, and request corrected re-uploads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualRefresh}
            className="text-xs text-[#FFD700] hover:text-white bg-[#8B0000] px-3.5 py-1.5 rounded-lg border border-[#D4AF37] font-extrabold flex items-center gap-1.5 transition shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Cloud Submissions</span>
          </button>

          {onClearAllStorage && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all stored browser data & submissions?')) {
                  onClearAllStorage();
                }
              }}
              className="text-xs text-rose-300 hover:text-white bg-rose-950 px-3 py-1.5 rounded-lg border border-rose-500/40 font-bold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Cache & Reset Data</span>
            </button>
          )}

          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-amber-200/70 hover:text-white bg-[#1F0000] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 font-mono"
          >
            Lock Desk
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/30">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-200/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Team, School, ID, or Title..."
            className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-amber-100/40 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterStatus === 'all' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]' : 'bg-[#2A0000] text-amber-100/70'
            }`}
          >
            All ({allSubmissions.length})
          </button>

          <button
            onClick={() => setFilterStatus('PENDING_APPROVAL')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
              filterStatus === 'PENDING_APPROVAL' ? 'bg-amber-600 text-white' : 'bg-[#2A0000] text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>📥 Pending Approval ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterStatus === 'VERIFIED' ? 'bg-emerald-800 text-emerald-200' : 'bg-[#2A0000] text-emerald-400'
            }`}
          >
            Published to Public
          </button>

          <button
            onClick={() => setFilterStatus('REVISION_REQUESTED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterStatus === 'REVISION_REQUESTED' ? 'bg-amber-800 text-amber-200' : 'bg-[#2A0000] text-amber-400'
            }`}
          >
            Revision Requested
          </button>
        </div>
      </div>

      {/* Submissions List Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <ShieldCheck className="w-12 h-12 text-[#FFD700] mx-auto" />
          <h3 className="text-xl font-bold font-serif text-white">No Registered Submissions Found</h3>
          <p className="text-xs text-amber-100/70 max-w-md mx-auto">
            Submissions will appear here live as participating school teams complete their proposals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map(sub => {
            const photoAudit = getPhotoAudit(sub);
            const duplicateMatch = checkForDuplicates(sub);
            const currentAuditStatus = sub.auditInfo?.status || 'PENDING_APPROVAL';
            const isWritingRemark = activeRemarkId === sub.id;

            return (
              <div
                key={sub.id}
                className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-[#D4AF37] transition"
              >
                {/* Top Row: Ref ID + School + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#FFD700] bg-[#1F0000] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        {sub.id}
                      </span>
                      <h3 className="font-bold text-white text-base font-serif">{sub.team.teamName}</h3>
                      <span className="text-xs text-amber-200/70">• {sub.team.schoolName} ({sub.team.schoolDistrict})</span>
                    </div>
                    <p className="text-xs text-amber-100/70 mt-1">
                      Team Lead: <strong className="text-white">{sub.team.teamLeadName}</strong> (Ph: {sub.team.teamLeadPhone}) | Guide: {sub.team.guideTeacherName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {currentAuditStatus === 'PENDING_APPROVAL' && (
                      <span className="inline-flex items-center gap-1 bg-amber-900 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-400 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        PENDING ORGANISER APPROVAL
                      </span>
                    )}
                    {currentAuditStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PUBLISHED TO PUBLIC
                      </span>
                    )}
                    {currentAuditStatus === 'REVISION_REQUESTED' && (
                      <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        REVISION REQUESTED
                      </span>
                    )}
                    {currentAuditStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 bg-rose-950 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/40">
                        <XCircle className="w-3.5 h-3.5" />
                        REJECTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Title & Geotagged Info */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-amber-200">Problem Title:</span>{' '}
                    <strong className="text-white font-bold text-sm">{sub.problem.problemTitle}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-amber-200">Location & Govt Dept:</span> {sub.problem.problemLocation} • <span className="bg-[#8B0000] text-[#FFD700] px-1.5 py-0.5 rounded font-bold">{sub.problem.responsibleDept}</span>
                  </div>
                </div>

                {/* Automatic Scanner Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {/* Photo Badge */}
                  {photoAudit.complete ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-900/60 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <Image className="w-3.5 h-3.5" />
                      3/3 Photos Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-900/80 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500/40 font-bold animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Missing Photo Proof ({photoAudit.count}/3 Uploaded)
                    </span>
                  )}

                  {/* Duplicate Badge */}
                  {duplicateMatch && (
                    <span className="inline-flex items-center gap-1 bg-rose-900/80 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-500/40 font-bold">
                      <Copy className="w-3.5 h-3.5 text-rose-400" />
                      Potential Duplicate of {duplicateMatch.id} ({duplicateMatch.team.teamName})
                    </span>
                  )}
                </div>

                {/* 3 Uploaded Photos Preview Strip */}
                <div className="grid grid-cols-3 gap-3 bg-[#1F0000] p-3 rounded-xl border border-[#D4AF37]/20">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] text-amber-200/70 font-bold">1. Close-Up</div>
                    {sub.problem.photoCloseUp ? (
                      <img src={sub.problem.photoCloseUp} alt="Close up" className="w-full h-20 object-cover rounded border border-[#D4AF37]/30" />
                    ) : (
                      <div className="h-20 bg-[#2A0000] rounded flex items-center justify-center text-[10px] text-amber-200/40">No Image</div>
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-[10px] text-amber-200/70 font-bold">2. Wide-Angle</div>
                    {sub.problem.photoWideAngle ? (
                      <img src={sub.problem.photoWideAngle} alt="Wide angle" className="w-full h-20 object-cover rounded border border-[#D4AF37]/30" />
                    ) : (
                      <div className="h-20 bg-[#2A0000] rounded flex items-center justify-center text-[10px] text-amber-200/40">No Image</div>
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-[10px] text-amber-200/70 font-bold">3. Team On-Site</div>
                    {sub.problem.photoTeamOnSite ? (
                      <img src={sub.problem.photoTeamOnSite} alt="Team" className="w-full h-20 object-cover rounded border border-[#D4AF37]/30" />
                    ) : (
                      <div className="h-20 bg-[#2A0000] rounded flex items-center justify-center text-[10px] text-amber-200/40">No Image</div>
                    )}
                  </div>
                </div>

                {/* Display Organiser Remark if set */}
                {sub.auditInfo?.remark && (
                  <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-[#FFD700] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Organiser Remark to Student Team:</span>
                    </div>
                    <p className="text-amber-100 leading-relaxed italic">{sub.auditInfo.remark}</p>
                  </div>
                )}

                {/* Organiser Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/20">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        onUpdateAudit(sub.id, 'VERIFIED');
                        setActiveRemarkId(null);
                      }}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish to Public</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveRemarkId(sub.id);
                        setRemarkInput(sub.auditInfo?.remark || '');
                      }}
                      className="flex items-center gap-1 bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Request Revision</span>
                    </button>

                    {onDeleteSubmission && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete submission ${sub.id} (${sub.team.teamName})? It will be removed from all screens and cloud storage.`)) {
                            onDeleteSubmission(sub.id);
                          }
                        }}
                        className="flex items-center gap-1 bg-rose-900 hover:bg-rose-800 text-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Entry</span>
                      </button>
                    )}
                  </div>

                  {onSelectSubmissionView && (
                    <button
                      onClick={() => onSelectSubmissionView(sub)}
                      className="flex items-center gap-1 text-xs text-[#FFD700] hover:underline font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Dossier</span>
                    </button>
                  )}
                </div>

                {/* Organiser Remark Input Box */}
                {isWritingRemark && (
                  <div className="bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/40 space-y-3 mt-3 animate-fadeIn">
                    <label className="block text-xs font-bold text-[#FFD700]">
                      Specific Feedback / Instructions to Team ({sub.id}):
                    </label>
                    <textarea
                      rows={2}
                      value={remarkInput}
                      onChange={e => setRemarkInput(e.target.value)}
                      placeholder="e.g., Photos 2 & 3 are missing/unclear. Please visit location site and re-upload wide-angle environmental proof."
                      className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-xl p-2.5 text-xs text-white placeholder-amber-100/40 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveRemarkId(null)}
                        className="px-3 py-1 rounded text-xs text-amber-200/70 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onUpdateAudit(sub.id, 'REVISION_REQUESTED', remarkInput);
                          setActiveRemarkId(null);
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow"
                      >
                        Save & Send Revision Request to Team
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
