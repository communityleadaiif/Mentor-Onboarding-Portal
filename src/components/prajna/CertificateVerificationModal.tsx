import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { SAMPLE_SUBMISSIONS } from '../../data/sampleSubmissions';
import { ShieldCheck, Search, CheckCircle, XCircle } from 'lucide-react';

interface CertificateVerificationModalProps {
  userSubmissions: FullSubmission[];
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  userSubmissions,
  isOpen,
  onClose
}) => {
  const [searchId, setSearchId] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<FullSubmission | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const allSubmissions = [...userSubmissions, ...SAMPLE_SUBMISSIONS];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = searchId.trim().toLowerCase();

    const match = allSubmissions.find(s =>
      s.id.toLowerCase().includes(cleanQuery) ||
      s.team.schoolName.toLowerCase().includes(cleanQuery) ||
      s.team.teamName.toLowerCase().includes(cleanQuery)
    );

    setVerifiedResult(match || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-white">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-lg font-bold text-white font-serif">
              Certificate Authenticity Verification Portal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-amber-100">
            Enter Registration / Certificate ID (e.g. PRJ-2026-001) *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. PRJ-2026-001"
              className="flex-1 bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
            />
            <button
              type="submit"
              className="bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] border border-[#D4AF37] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" />
              Verify
            </button>
          </div>
        </form>

        {/* Results View */}
        {searched && (
          <div>
            {verifiedResult ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-500/60 rounded-xl p-5 space-y-4 shadow-xl animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <span className="bg-emerald-800 text-emerald-100 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      Official Verified Record
                    </span>
                    <h4 className="text-base font-bold text-emerald-200 font-serif mt-0.5">
                      Sainik School Verified Authentic Certificate
                    </h4>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-emerald-100/90">
                  <div>
                    <span className="text-emerald-300 font-bold">Dossier ID:</span>{' '}
                    <span className="font-mono">{verifiedResult.id}</span>
                  </div>
                  <div>
                    <span className="text-emerald-300 font-bold">School Name:</span>{' '}
                    {verifiedResult.team.schoolName} ({verifiedResult.team.schoolDistrict})
                  </div>
                  <div>
                    <span className="text-emerald-300 font-bold">Team Name:</span>{' '}
                    {verifiedResult.team.teamName} ({verifiedResult.team.teamCategory})
                  </div>
                  <div>
                    <span className="text-emerald-300 font-bold">Project Title:</span>{' '}
                    {verifiedResult.problem.problemTitle}
                  </div>
                  <div>
                    <span className="text-emerald-300 font-bold">Issue Date:</span>{' '}
                    {verifiedResult.submissionDate}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-5 text-center space-y-2 text-red-200">
                <XCircle className="w-8 h-8 text-red-400 mx-auto" />
                <h4 className="text-sm font-bold">Certificate Not Found</h4>
                <p className="text-xs text-red-300/80">
                  No matching record was found for "{searchId}". Please check the Certificate ID for typos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
