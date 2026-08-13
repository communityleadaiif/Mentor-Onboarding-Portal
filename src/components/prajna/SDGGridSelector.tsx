import React from 'react';
import { SDGS_DATA } from '../../data/sdgs';
import type { SDGItem } from '../../data/sdgs';
import { Globe2, CheckCircle2, Info } from 'lucide-react';

interface SDGGridSelectorProps {
  selectedSdgs: number[];
  onChange: (selected: number[]) => void;
}

export const SDGGridSelector: React.FC<SDGGridSelectorProps> = ({ selectedSdgs, onChange }) => {
  const toggleSdg = (id: number) => {
    if (selectedSdgs.includes(id)) {
      onChange(selectedSdgs.filter(item => item !== id));
    } else {
      onChange([...selectedSdgs, id]);
    }
  };

  return (
    <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#FFD700]" />
            <h4 className="text-lg font-bold text-white font-serif">
              UN Sustainable Development Goals (SDG 1–17)
            </h4>
          </div>
          <p className="text-xs text-amber-200/70 mt-1">
            Select all SDGs your local innovation directly addresses or impacts.
          </p>
        </div>

        <div className="bg-[#8B0000] border border-[#D4AF37]/50 text-[#FFD700] px-3.5 py-1 rounded-full text-xs font-black self-start sm:self-auto">
          {selectedSdgs.length} SDG{selectedSdgs.length === 1 ? '' : 's'} Selected
        </div>
      </div>

      {/* Grid of 17 SDGs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {SDGS_DATA.map((sdg: SDGItem) => {
          const isSelected = selectedSdgs.includes(sdg.id);
          return (
            <div
              key={sdg.id}
              onClick={() => toggleSdg(sdg.id)}
              style={{
                borderColor: isSelected ? sdg.color : 'rgba(212, 175, 55, 0.2)',
                backgroundColor: isSelected ? `${sdg.color}25` : '#1F0000'
              }}
              className={`border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 relative group hover:scale-[1.02] ${
                isSelected ? 'shadow-lg shadow-black/40 ring-1 ring-white/30' : 'hover:border-[#FFD700]/50'
              }`}
            >
              {/* Checkbox badge */}
              <div className="flex items-center justify-between">
                <span
                  style={{ backgroundColor: sdg.color }}
                  className="text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm"
                >
                  SDG {sdg.id}
                </span>

                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-amber-100/30'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Icon & Title */}
              <div className="space-y-1">
                <div className="text-xl">{sdg.iconSymbol}</div>
                <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {sdg.shortTitle}
                </h5>
              </div>

              <p className="text-[10px] text-amber-100/60 line-clamp-2">
                {sdg.tagline}
              </p>
            </div>
          );
        })}
      </div>

      {selectedSdgs.length === 0 && (
        <p className="text-xs text-amber-400/80 flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5" />
          Tip: Select at least one Sustainable Development Goal to calculate SDG impact metrics on your evaluation scorecard.
        </p>
      )}
    </div>
  );
};
