import React from 'react';
import type { SchoolEntry } from '../../data/participatingSchools';
import { ShieldCheck } from 'lucide-react';

interface SchoolMarqueeProps {
  schools: SchoolEntry[];
  title?: string;
}

export const SchoolMarquee: React.FC<SchoolMarqueeProps> = ({ schools, title = 'Participating Schools Across Tamil Nadu' }) => {
  // Duplicate array to ensure seamless 100% infinite loop scroll
  const marqueeList = [...schools, ...schools];

  return (
    <div className="bg-[#2A0000]/95 border-y-2 border-[#D4AF37]/40 py-4 overflow-hidden shadow-2xl relative">
      {/* Subtle Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#2A0000] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#2A0000] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-black text-[#FFD700] uppercase tracking-wider font-serif">
            {title} ({schools.length} Schools Registered)
          </span>
        </div>
        <span className="text-[10px] text-amber-200/60 hidden sm:inline">
          Live Registration Auto-Queue
        </span>
      </div>

      {/* Ticker Container */}
      <div className="flex w-max animate-marquee space-x-4">
        {marqueeList.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center gap-2.5 bg-[#1F0000] border border-[#D4AF37]/30 px-4 py-2 rounded-xl shadow-md shrink-0 hover:border-[#FFD700] transition-all"
          >
            <span className="text-base">{item.badgeSymbol}</span>
            <div>
              <div className="text-xs font-bold text-white whitespace-nowrap">
                {item.name}
              </div>
              <div className="text-[10px] text-amber-200/70 flex items-center gap-1">
                <span>{item.district}</span>
                <span>•</span>
                <span className="text-[#FFD700] font-semibold">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
