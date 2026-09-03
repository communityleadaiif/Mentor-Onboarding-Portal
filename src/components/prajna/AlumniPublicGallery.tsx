import React from 'react';
import type { FullSubmission } from '../../types/prajna';
import { Globe, ShieldCheck, Sparkles } from 'lucide-react';

interface AlumniPublicGalleryProps {
  userSubmissions: FullSubmission[];
  onSelectSubmissionForView?: (submission: FullSubmission) => void;
}

export const AlumniPublicGallery: React.FC<AlumniPublicGalleryProps> = ({
  userSubmissions
}) => {
  const activeCount = userSubmissions.filter(s => s && s.id && s.team).length;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
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
      </div>

      {/* Holding Announcement Card */}
      <div className="bg-[#2A0000] border-2 border-[#D4AF37]/50 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]/60 shadow-xl">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="bg-[#8B0000] text-[#FFD700] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider">
            Submissions Active — Showcase Opening Tomorrow
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-serif text-white pt-2">
            Team Submissions Underway
          </h3>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            School innovation teams across Tamil Nadu are currently completing and lodging their on-site problem dossiers. The public showcase, community voting, and alumni mentorship connect will unlock tomorrow once all registrations are finalized!
          </p>
        </div>

        {/* Live Counter Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#1F0000] border border-[#D4AF37]/40 p-4 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span className="text-amber-200">Total Teams Registered in Queue:</span>
            <strong className="text-white font-mono text-sm bg-[#8B0000] px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
              {activeCount} Teams
            </strong>
          </div>
          <span className="text-amber-200/40 hidden sm:inline">•</span>
          <span className="text-amber-100/70">
            Preview participating team names in the <strong>Home Page Queue</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
