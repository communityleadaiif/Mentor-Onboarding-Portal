import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { MapPin, Compass, Sparkles, ShieldCheck } from 'lucide-react';

interface TNDistrictMapProps {
  userSubmissions: FullSubmission[];
  onSelectSubmission?: (submission: FullSubmission) => void;
}

const TN_REGIONS = [
  { region: 'Kongu / Western TN', districts: ['Tiruppur', 'Coimbatore', 'Erode', 'Nilgiris', 'Karur', 'Namakkal', 'Salem'] },
  { region: 'Northern TN', districts: ['Chennai', 'Chengalpattu', 'Tiruvallur', 'Kanchipuram', 'Vellore', 'Ranipet', 'Tirupathur', 'Tiruvannamalai'] },
  { region: 'Central / Delta', districts: ['Tiruchirappalli', 'Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Mayiladuthurai', 'Pudukkottai', 'Ariyalur', 'Perambalur'] },
  { region: 'Southern TN', districts: ['Madurai', 'Dindigul', 'Theni', 'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Tirunelveli', 'Tenkasi', 'Thoothukudi', 'Kanyakumari'] },
  { region: 'North Western TN', districts: ['Dharmapuri', 'Krishnagiri', 'Kallakurichi', 'Cuddalore', 'Viluppuram'] }
];

export const TNDistrictMap: React.FC<TNDistrictMapProps> = ({ userSubmissions }) => {
  const [activeDistrict, setActiveDistrict] = useState<string>('Tiruppur');
  const totalSubmissionsCount = userSubmissions.filter(s => s && s.id && s.team).length;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Interactive Geotagged Issue Repository</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Tamil Nadu Community Problem Map
        </h2>
        <p className="text-sm text-amber-100/90 leading-relaxed max-w-3xl">
          Track participation across Tamil Nadu districts as school innovation teams identify real community issues on-site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* District Selector Map Panel */}
        <div className="lg:col-span-5 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FFD700]" />
              <h3 className="text-base font-bold text-white font-serif">Tamil Nadu Districts</h3>
            </div>
            <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-black px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
              38 Districts
            </span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {TN_REGIONS.map((reg) => (
              <div key={reg.region} className="space-y-2">
                <div className="text-xs font-bold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-3 py-1 rounded border border-[#D4AF37]/20">
                  {reg.region}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reg.districts.map((d) => {
                    const isActive = activeDistrict === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setActiveDistrict(d)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] border-[#FFD700] font-black shadow'
                            : 'bg-[#1F0000] text-amber-100/70 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                        }`}
                      >
                        <span>{d}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Holding State Panel */}
        <div className="lg:col-span-7 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div>
                <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Selected District</span>
                <h3 className="text-2xl font-black font-serif text-[#FFD700]">
                  {activeDistrict} District
                </h3>
              </div>
              <span className="bg-[#1F0000] text-[#FFD700] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D4AF37]/40">
                Registration Active
              </span>
            </div>

            <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-6 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/40">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-serif">
                  Geotagged Issue Mapping in Progress
                </h4>
                <p className="text-xs text-amber-100/80 max-w-md mx-auto leading-relaxed">
                  Participating school teams are actively uploading on-site geotagged problem statements and field evidence. All district-wise innovation dossiers will be officially unlocked and published tomorrow!
                </p>
              </div>
            </div>
          </div>

          {/* Queue Info Pill */}
          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
              <span className="text-amber-200">Registered Teams Across Tamil Nadu:</span>
              <strong className="text-white font-mono bg-[#8B0000] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                {totalSubmissionsCount} Teams
              </strong>
            </div>
            <span className="text-amber-100/70 italic text-[11px]">
              Team names are updated live in the <strong>Home Page Queue</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
