import React from 'react';
import type { SchoolEntry } from '../../data/participatingSchools';
import { Users, Sparkles } from 'lucide-react';

interface SchoolMarqueeProps {
  schools: SchoolEntry[];
  title?: string;
}

export const SchoolMarquee: React.FC<SchoolMarqueeProps> = ({ schools, title = 'Participating Teams & Schools Across Tamil Nadu' }) => {
  // Ensure we have entries to scroll, duplicate array for seamless infinite scroll loop
  const marqueeList = schools.length > 0 ? [...schools, ...schools, ...schools] : [];

  return (
    <div className="bg-[#2A0000]/95 border-y-2 border-[#D4AF37]/40 py-4 overflow-hidden shadow-2xl relative">
      {/* Subtle Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#2A0000] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#2A0000] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-black text-[#FFD700] uppercase tracking-wider font-serif">
            {title} ({schools.length} Teams & Schools in Queue)
          </span>
        </div>
        <span className="text-[10px] text-amber-200/80 font-bold bg-[#1F0000] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
          <span>Live Registration Auto-Queue (Instant Team Display)</span>
        </span>
      </div>

      {/* Ticker Container */}
      <div className="flex w-max animate-marquee space-x-4">
        {marqueeList.map((item, idx) => {
          const isVerified = item.status === 'VERIFIED';

          return (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-3 bg-[#1F0000] border border-[#D4AF37]/40 px-4 py-2.5 rounded-xl shadow-md shrink-0 hover:border-[#FFD700] transition-all"
            >
              <span className="text-lg">{item.badgeSymbol}</span>
              <div>
                <div className="text-xs font-black text-white whitespace-nowrap flex items-center gap-1.5">
                  {item.teamName ? (
                    <>
                      <span className="text-[#FFD700] font-serif font-black">{item.teamName}</span>
                      <span className="text-amber-200/40 text-[10px]">•</span>
                      <span className="text-white text-xs font-medium">{item.name}</span>
                    </>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                <div className="text-[10px] text-amber-200/70 flex items-center gap-1.5 mt-0.5">
                  <span>📍 {item.district}</span>
                  <span>•</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isVerified
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {item.category || (isVerified ? 'Verified Finalist' : 'Registered Team Queue')}
                  </span>
                  {item.submissionId && (
                    <span className="font-mono text-[9px] text-amber-300/60 font-semibold">
                      [{item.submissionId}]
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

