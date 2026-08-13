import { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { SDGS_DATA } from '../../data/sdgs';
import { ThumbsUp, Building, Globe, Filter, ShieldCheck, HeartHandshake, Eye, Sparkles } from 'lucide-react';

interface AlumniPublicGalleryProps {
  userSubmissions: FullSubmission[];
  onSelectSubmissionForView: (submission: FullSubmission) => void;
}

export const AlumniPublicGallery: React.FC<AlumniPublicGalleryProps> = ({
  userSubmissions,
  onSelectSubmissionForView
}) => {
  // Only display entries approved & verified by Organiser
  const allSubmissions = userSubmissions.filter(s => s.auditInfo?.status === 'VERIFIED');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    allSubmissions.forEach(s => {
      initial[s.id] = s.publicVotes || 0;
    });
    return initial;
  });

  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [mentorModalSub, setMentorModalSub] = useState<FullSubmission | null>(null);
  const [mentorSuccessMsg, setMentorSuccessMsg] = useState(false);

  const handleVote = (id: string) => {
    if (hasVoted[id]) return;
    setVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setHasVoted(prev => ({ ...prev, [id]: true }));
  };

  const filteredSubmissions = allSubmissions.filter(s => {
    if (selectedDistrict === 'All') return true;
    return s.problem.district === selectedDistrict;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Public & Alumni Entrepreneur Rating Portal</span>
          </div>
          <span className="text-xs text-amber-200/80">
            Geotagged Local Issues • Tamil Nadu
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Community Problem Repository & Innovation Showcase
        </h2>
        <p className="text-sm text-amber-100/90 leading-relaxed max-w-3xl">
          Empowering alumni entrepreneurs, government officials, and citizens to review authentic community problems identified by school students, upvote impactful solutions, and offer direct incubation mentorship!
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#2A0000] border border-[#D4AF37]/40 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filter By District:</span>
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-[#1F0000] text-white border border-[#D4AF37]/40 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
        >
          <option value="All">All Tamil Nadu Districts ({allSubmissions.length} Submissions)</option>
          {Array.from(new Set(allSubmissions.map(s => s.problem.district))).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Main Submissions Showcase Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">No Live Submissions In This Selection</h3>
          <p className="text-xs text-amber-100/70 max-w-md mx-auto leading-relaxed">
            School teams are currently submitting their geotagged community innovation proposals. Registered proposals will appear here live!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubmissions.map((sub) => {
            const voteCount = votes[sub.id] || 0;
            const voted = hasVoted[sub.id];

            return (
              <div
                key={sub.id}
                className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-5 shadow-xl hover:border-[#D4AF37] transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                    <span className="font-mono text-xs font-bold text-[#FFD700] bg-[#1F0000] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                      {sub.id}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      Audited & Qualified
                    </span>
                  </div>

                  {/* School & Team Info */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                      <Building className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>{sub.team.schoolName}</span>
                    </div>
                    <h3 className="text-lg font-black font-serif text-white mt-1 leading-snug">
                      {sub.problem.problemTitle}
                    </h3>
                    <p className="text-xs text-amber-100/70 mt-1">
                      Team: <strong className="text-white">{sub.team.teamName}</strong> • District: {sub.problem.district}
                    </p>
                  </div>

                  {/* Problem & Solution Preview */}
                  <div className="bg-[#1F0000] p-3.5 rounded-xl border border-[#D4AF37]/20 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-[#FFD700]">Location:</span> {sub.problem.problemLocation}
                    </div>
                    <div>
                      <span className="font-bold text-[#FFD700]">Govt Body:</span> {sub.problem.responsibleDept}
                    </div>
                    <p className="text-amber-100/80 line-clamp-2 italic pt-1">
                      "{sub.solution.solutionSummary}"
                    </p>
                  </div>

                  {/* UN SDGs Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sub.sdg.selectedSdgs.map(id => {
                      const item = SDGS_DATA.find(s => s.id === id);
                      return (
                        <span key={id} style={{ backgroundColor: item?.color }} className="text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          SDG {id}: {item?.shortTitle}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20 gap-2">
                  <button
                    onClick={() => handleVote(sub.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      voted
                        ? 'bg-amber-400 text-[#2A0000]'
                        : 'bg-[#1F0000] text-amber-200 border border-[#D4AF37]/30 hover:border-[#FFD700]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{voteCount} Upvotes</span>
                  </button>

                  <button
                    onClick={() => setMentorModalSub(sub)}
                    className="flex items-center gap-1.5 bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/40 transition"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>Offer Mentorship</span>
                  </button>

                  <button
                    onClick={() => onSelectSubmissionForView(sub)}
                    className="flex items-center gap-1 text-xs text-[#FFD700] hover:underline font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mentorship Offer Modal */}
      {mentorModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#FFD700]" />
                <h3 className="font-bold font-serif text-lg text-white">Alumni Mentorship & Incubation Offer</h3>
              </div>
              <button
                onClick={() => {
                  setMentorModalSub(null);
                  setMentorSuccessMsg(false);
                }}
                className="text-amber-200/70 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>

            {mentorSuccessMsg ? (
              <div className="bg-emerald-950 border border-emerald-500/50 p-4 rounded-xl text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-300 text-sm">Mentorship Request Recorded!</h4>
                <p className="text-xs text-emerald-100/80">
                  Thank you! Team Prajna Secretariat will connect you with {mentorModalSub.team.teamName} ({mentorModalSub.team.schoolName}).
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMentorSuccessMsg(true);
                }}
                className="space-y-4 text-xs"
              >
                <p className="text-amber-100/80">
                  You are offering mentorship for proposal: <strong className="text-white">{mentorModalSub.problem.problemTitle}</strong> ({mentorModalSub.team.schoolName})
                </p>

                <div className="space-y-1">
                  <label className="block font-bold text-amber-200">Your Full Name / Alumni Batch</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. K. Ramesh (Amaravian 1998 Batch)"
                    className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-lg p-2.5 text-xs text-white placeholder-amber-100/40 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-amber-200">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit WhatsApp number"
                    className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-lg p-2.5 text-xs text-white placeholder-amber-100/40 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-amber-200">Mentorship / Support Type</label>
                  <select className="w-full bg-[#1F0000] border border-[#D4AF37]/30 rounded-lg p-2.5 text-xs text-white focus:outline-none">
                    <option>Technical Guidance & Prototype Design</option>
                    <option>Grant Funding / Sponsorship</option>
                    <option>IPR / Patent Filing Support</option>
                    <option>Incubation & Startup Accelerator</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black text-xs py-3 rounded-xl shadow-lg transition"
                >
                  Submit Mentorship Offer to Secretariat
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
