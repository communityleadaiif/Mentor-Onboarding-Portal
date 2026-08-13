import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { SDGS_DATA } from '../../data/sdgs';
import { MapPin, Building, Eye, Compass, AlertCircle } from 'lucide-react';

interface TNDistrictMapProps {
  userSubmissions: FullSubmission[];
  onSelectSubmission: (submission: FullSubmission) => void;
}

const TN_REGIONS = [
  { region: 'Kongu / Western TN', districts: ['Tiruppur', 'Coimbatore', 'Erode', 'Nilgiris', 'Karur', 'Namakkal', 'Salem'] },
  { region: 'Northern TN', districts: ['Chennai', 'Chengalpattu', 'Tiruvallur', 'Kanchipuram', 'Vellore', 'Ranipet', 'Tirupathur', 'Tiruvannamalai'] },
  { region: 'Central / Delta', districts: ['Tiruchirappalli', 'Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Mayiladuthurai', 'Pudukkottai', 'Ariyalur', 'Perambalur'] },
  { region: 'Southern TN', districts: ['Madurai', 'Dindigul', 'Theni', 'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Tirunelveli', 'Tenkasi', 'Thoothukudi', 'Kanyakumari'] },
  { region: 'North Western TN', districts: ['Dharmapuri', 'Krishnagiri', 'Kallakurichi', 'Cuddalore', 'Viluppuram'] }
];

export const TNDistrictMap: React.FC<TNDistrictMapProps> = ({ userSubmissions, onSelectSubmission }) => {
  // Only display pins approved & verified by Organiser
  const allSubmissions = userSubmissions.filter(s => s.auditInfo?.status === 'VERIFIED');
  const [activeDistrict, setActiveDistrict] = useState<string>('Tiruppur');

  // Count submissions per district
  const districtCounts: Record<string, number> = {};
  allSubmissions.forEach(sub => {
    const d = sub.problem.district || 'Tiruppur';
    districtCounts[d] = (districtCounts[d] || 0) + 1;
  });

  const submissionsInActiveDistrict = allSubmissions.filter(s => s.problem.district === activeDistrict);

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
          Click on any Tamil Nadu district to explore authentic geotagged community issues identified on location by school students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* District Selector Map Panel */}
        <div className="lg:col-span-5 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FFD700]" />
              <h3 className="text-base font-bold text-white font-serif">Select District</h3>
            </div>
            <span className="bg-[#8B0000] text-[#FFD700] text-[10px] font-black px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
              38 Districts
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {TN_REGIONS.map((reg) => (
              <div key={reg.region} className="space-y-2">
                <div className="text-xs font-bold text-[#FFD700] uppercase tracking-wider bg-[#1F0000] px-3 py-1 rounded border border-[#D4AF37]/20">
                  {reg.region}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reg.districts.map((d) => {
                    const count = districtCounts[d] || 0;
                    const isActive = activeDistrict === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setActiveDistrict(d)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] border-[#FFD700] font-black shadow'
                            : count > 0
                            ? 'bg-[#8B0000] text-amber-100 border-[#D4AF37]/50'
                            : 'bg-[#1F0000] text-amber-100/70 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                        }`}
                      >
                        <span>{d}</span>
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-[#2A0000] text-[#FFD700]' : 'bg-[#FFD700] text-[#2A0000]'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Submissions List Panel */}
        <div className="lg:col-span-7 bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <div>
              <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Active Region</span>
              <h3 className="text-xl font-black font-serif text-[#FFD700]">
                {activeDistrict} District
              </h3>
            </div>
            <span className="bg-[#1F0000] text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/30">
              {submissionsInActiveDistrict.length} Issues Geotagged
            </span>
          </div>

          {submissionsInActiveDistrict.length === 0 ? (
            <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-8 rounded-xl text-center space-y-3 text-amber-200/70">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold">No geotagged issues submitted in {activeDistrict} yet.</p>
              <p className="text-[11px]">School teams from {activeDistrict} can register their community innovation proposals via the Submission Portal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissionsInActiveDistrict.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#1F0000] border border-[#D4AF37]/30 rounded-xl p-4 space-y-3 hover:border-[#FFD700] transition shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                    <span className="font-mono text-xs font-bold text-[#FFD700]">{sub.id}</span>
                    <span className="text-xs text-amber-200/70 font-semibold">{sub.problem.responsibleDept}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-white text-sm font-serif">{sub.problem.problemTitle}</h4>
                    <p className="text-xs text-amber-200/70 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-[#FFD700]" />
                      <span>{sub.team.schoolName} ({sub.team.teamName})</span>
                    </p>
                  </div>

                  <p className="text-xs text-amber-100/80 italic bg-[#2A0000] p-2.5 rounded border border-[#D4AF37]/20">
                    Location: {sub.problem.problemLocation}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1">
                      {sub.sdg.selectedSdgs.map(id => {
                        const item = SDGS_DATA.find(s => s.id === id);
                        return (
                          <span key={id} style={{ backgroundColor: item?.color }} className="text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            SDG {id}: {item?.shortTitle}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => onSelectSubmission(sub)}
                      className="flex items-center gap-1 text-xs text-[#FFD700] hover:underline font-bold shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
