import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { Globe, ShieldCheck, Sparkles, Search, Eye, MapPin, Landmark, ImageIcon, School, Users } from 'lucide-react';

interface AlumniPublicGalleryProps {
  userSubmissions: FullSubmission[];
  onSelectSubmissionForView?: (submission: FullSubmission) => void;
}

export const AlumniPublicGallery: React.FC<AlumniPublicGalleryProps> = ({
  userSubmissions,
  onSelectSubmissionForView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);

  const allSubmissions = (userSubmissions || []).filter(s => s && s.id && s.team && s.problem);

  // Only VERIFIED submissions are "published to public"
  const published = allSubmissions.filter(s => s.auditInfo?.status === 'VERIFIED');
  const pendingCount = allSubmissions.length;

  const sortedPublished = [...published].sort((a, b) =>
    (b.publicVotes || 0) - (a.publicVotes || 0)
  );

  const q = searchQuery.toLowerCase().trim();
  const filtered = sortedPublished.filter(s =>
    !q ||
    s.team?.teamName?.toLowerCase().includes(q) ||
    s.team?.schoolName?.toLowerCase().includes(q) ||
    s.team?.schoolDistrict?.toLowerCase().includes(q) ||
    s.problem?.problemTitle?.toLowerCase().includes(q) ||
    s.problem?.problemLocation?.toLowerCase().includes(q)
  );

  const primaryPhoto = (s: FullSubmission) =>
    s.problem?.photoTeamOnSite || s.problem?.photoWideAngle || s.problem?.photoCloseUp || '';

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
          <Globe className="w-3.5 h-3.5" />
          <span>Public & Alumni Rating Portal</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Community Problem Repository & Innovation Showcase
        </h2>
        <p className="text-sm text-amber-100/90 leading-relaxed max-w-2xl mx-auto">
          Empowering alumni entrepreneurs, government bodies, and citizens to review authentic community problems identified by school students, upvote impactful solutions, and offer direct incubation mentorship.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#1F0000] border border-[#D4AF37]/40 p-4 rounded-xl text-xs mt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span className="text-amber-200">Published to Public:</span>
            <strong className="text-white font-mono text-sm bg-emerald-900 px-2.5 py-0.5 rounded border border-emerald-500/40">
              {published.length}
            </strong>
          </div>
          <span className="text-amber-200/40 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-[#FFD700]" />
            <span className="text-amber-100/70">Total Teams Registered:</span>
            <strong className="text-amber-200">{pendingCount}</strong>
          </div>
        </div>
      </div>

      {published.length === 0 ? (
        /* Holding Announcement Card — only shown when nothing is published yet */
        <div className="bg-[#2A0000] border-2 border-[#D4AF37]/50 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]/60 shadow-xl">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="bg-[#8B0000] text-[#FFD700] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider">
              Submissions Active — Showcase Opening Soon
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white pt-2">
              Team Submissions Underway
            </h3>
            <p className="text-sm text-amber-100/80 leading-relaxed">
              School innovation teams across Tamil Nadu are completing their on-site problem dossiers. Once organisers verify each entry's 3-photo field evidence and originality, it will be <strong className="text-[#FFD700]">published below automatically</strong>. No data shows here until a team has been officially approved &amp; published to public.
            </p>
          </div>
        </div>
      ) : (
        /* PUBLISHED SUBMISSIONS SHOWCASE */
        <>
          {/* Search Bar */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="w-4 h-4 text-amber-200/50 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Published Teams, Schools, Problems, Districts..."
              className="w-full bg-[#2A0000] border border-[#D4AF37]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-amber-100/40 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-12 text-center space-y-3 shadow-xl">
              <Globe className="w-12 h-12 text-[#FFD700] mx-auto" />
              <h3 className="text-xl font-bold font-serif text-white">No Matching Published Projects</h3>
              <p className="text-xs text-amber-100/70 max-w-md mx-auto">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => {
                const gp = primaryPhoto(s);
                return (
                  <div
                    key={s.id}
                    className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-xl hover:border-[#D4AF37] hover:-translate-y-1 transition duration-300 flex flex-col"
                  >
                    {/* Photo */}
                    <div className="relative h-44 bg-[#1F0000]">
                      {gp ? (
                        <img
                          src={gp}
                          alt={s.problem?.problemTitle || 'Project'}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setViewPhoto(gp)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-200/40">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 font-mono text-[10px] font-bold text-[#FFD700] bg-[#1F0000]/90 px-2 py-0.5 rounded border border-[#D4AF37]/40">
                        {s.id}
                      </span>
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-emerald-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/50">
                        <ShieldCheck className="w-3 h-3" />
                        VERIFIED
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-bold font-serif text-[#FFD700] leading-snug">
                          {s.problem?.problemTitle || 'Untitled Problem'}
                        </h3>
                        <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-200/70" />
                          {s.team?.teamName || 'Innovation Team'}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-amber-100/80">
                        <p className="flex items-start gap-1.5">
                          <School className="w-3.5 h-3.5 shrink-0 text-amber-200/70 mt-0.5" />
                          <span>{s.team?.schoolName || 'School N/A'} ({s.team?.schoolDistrict || 'District N/A'})</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-200/70 mt-0.5" />
                          <span>{s.problem?.problemLocation || 'Location N/A'}</span>
                        </p>
                        {s.problem?.responsibleDept && (
                          <p className="flex items-start gap-1.5">
                            <Landmark className="w-3.5 h-3.5 shrink-0 text-amber-200/70 mt-0.5" />
                            <span className="bg-[#8B0000] text-[#FFD700] px-1.5 py-0.5 rounded text-[10px] font-bold">{s.problem.responsibleDept}</span>
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-amber-100/70 leading-relaxed line-clamp-3">
                        {s.problem?.whyItMatters || s.solution?.solutionSummary || ''}
                      </p>

                      {onSelectSubmissionForView && (
                        <button
                          onClick={() => onSelectSubmissionForView(s)}
                          className="mt-auto inline-flex items-center justify-center gap-1.5 bg-[#8B0000] hover:bg-[#600000] text-[#FFD700] border border-[#D4AF37]/50 px-4 py-2 rounded-xl text-xs font-bold transition shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Full Dossier
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Full-screen Photo Lightbox */}
      {viewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setViewPhoto(null)}
        >
          <img src={viewPhoto} alt="Project photo" className="max-w-full max-h-full rounded-lg border-2 border-[#D4AF37]" />
          <button className="absolute top-4 right-4 text-white bg-[#8B0000] border border-[#D4AF37] w-9 h-9 rounded-full text-lg font-bold">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};