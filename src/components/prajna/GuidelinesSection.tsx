import React from 'react';
import { Camera, Video, Compass, Layers, HeartHandshake, Award } from 'lucide-react';

interface GuidelinesSectionProps {
  onGoToForm: () => void;
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({ onGoToForm }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A0000] text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Event Blueprint & Rules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
            How the Community Innovation Challenge Works
          </h2>
          <p className="text-amber-200/80 text-base max-w-2xl mx-auto">
            Built for school students across Tamil Nadu to transform local observation into real-world impact.
          </p>
        </div>

        {/* 4-in-1 Platform Objective Banner */}
        <div className="bg-gradient-to-br from-[#2A0000] to-[#4A0000] border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="bg-[#FFD700] text-[#2A0000] text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider">
                Zero Post-Submission Hassle
              </span>
              <h3 className="text-2xl font-bold text-white">
                One Form. Four Complete Purposes.
              </h3>
              <p className="text-sm text-amber-100/90 leading-relaxed">
                To minimize follow-up paperwork for schools and teachers, this single portal captures your entire innovation project in one go. You fill it once, and you never have to submit another document until the live finals!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3 rounded-xl text-center">
                <div className="text-[#FFD700] font-black text-sm">1. Registration</div>
                <div className="text-[11px] text-amber-200/70">School & Team DB</div>
              </div>
              <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3 rounded-xl text-center">
                <div className="text-[#FFD700] font-black text-sm">2. Geotag Issue</div>
                <div className="text-[11px] text-amber-200/70">Community Repository</div>
              </div>
              <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3 rounded-xl text-center">
                <div className="text-[#FFD700] font-black text-sm">3. Evaluation Sheet</div>
                <div className="text-[11px] text-amber-200/70">Judge Scorecards</div>
              </div>
              <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3 rounded-xl text-center">
                <div className="text-[#FFD700] font-black text-sm">4. Incubation</div>
                <div className="text-[11px] text-amber-200/70">Alumni Pitch Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced 3-Photo Mandate & Video Feature Card */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-3">
            <Camera className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-2xl font-bold text-white font-serif">
              Mandating Authenticity: The 3-Photo & Video Rule
            </h3>
          </div>

          <p className="text-amber-100/90 text-sm leading-relaxed">
            To prevent copied or AI-generated template entries, every participating team must capture <strong className="text-[#FFD700]">three mandatory photographs</strong> at the actual local problem location:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo 1 */}
            <div className="bg-[#2A0000] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl hover:border-[#FFD700] transition-all">
              <div className="bg-[#8B0000] text-[#FFD700] w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4 border border-[#D4AF37]/40">
                1
              </div>
              <h4 className="text-base font-extrabold text-white mb-2">Close-Up of Problem</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                Focuses directly on the issue (e.g., rusted sluice gate, broken pipeline, damaged zebra crossing, uncollected waste pile).
              </p>
            </div>

            {/* Photo 2 */}
            <div className="bg-[#2A0000] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl hover:border-[#FFD700] transition-all">
              <div className="bg-[#8B0000] text-[#FFD700] w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4 border border-[#D4AF37]/40">
                2
              </div>
              <h4 className="text-base font-extrabold text-white mb-2">Wide-Angle Context View</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                Captures the surrounding street, village road, school gate, or agricultural field to show environmental context.
              </p>
            </div>

            {/* Photo 3 */}
            <div className="bg-[#2A0000] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl hover:border-[#FFD700] transition-all">
              <div className="bg-[#8B0000] text-[#FFD700] w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4 border border-[#D4AF37]/40">
                3
              </div>
              <h4 className="text-base font-extrabold text-white mb-2">Team On-Site Photo</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                At least one team member present in front of the site to verify physical field investigation and local authenticity.
              </p>
            </div>
          </div>

          {/* Optional Video Highlight */}
          <div className="bg-[#3D0000]/70 border border-[#D4AF37]/30 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-[#8B0000] text-[#FFD700] p-3 rounded-xl shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Recommended Boost
              </span>
              <h5 className="text-sm font-bold text-white mt-1">30–60 Second Field Explanation Video</h5>
              <p className="text-xs text-amber-200/80">
                Provide an unedited short video clip explaining the problem on location. Gives judges a richer understanding and boosts evaluation scores!
              </p>
            </div>
          </div>
        </div>

        {/* Master Student Event Guidelines & Schedule Matrix */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-[#FFD700]" />
              <h3 className="text-2xl font-bold text-white font-serif">
                Participant Event Schedule & Student Checklist
              </h3>
            </div>
            <span className="text-xs text-amber-200/80">PRAJNA 2026 Student Guide</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#D4AF37]/30 rounded-xl overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#8B0000] text-[#FFD700] font-bold text-xs uppercase tracking-wider">
                  <th className="p-3 border border-[#D4AF37]/30">Key Event Parameter</th>
                  <th className="p-3 border border-[#D4AF37]/30">Participant Guidelines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/20 bg-[#2A0000]/90 text-amber-100/90 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-white">Target Category & Eligibility</td>
                  <td className="p-3 text-amber-200">Senior School Category (Grades 11 & 12 across Tamil Nadu)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Team Composition</td>
                  <td className="p-3 text-amber-200">3 Students + 1 Escort / Guide Teacher per registered team</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Final Event Date & Venue</td>
                  <td className="p-3 text-amber-200">September 05, 2026 • Sainik School Amaravathinagar Campus</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">What Students Must Bring</td>
                  <td className="p-3 text-amber-200">1. On-site 3-Photo Evidence • 2. Physical Prototype / Poster Deck • 3. School ID Cards</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Stall Pitch & Jury Q&A Format</td>
                  <td className="p-3 text-amber-200">5-Minute Project Pitch + Live Working Demonstration before the Jury Panel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sainik Hospitality & Rewards Card */}
        <div className="bg-gradient-to-r from-[#4A0000] via-[#600000] to-[#4A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <HeartHandshake className="w-10 h-10 text-[#FFD700] mx-auto" />
          <h3 className="text-2xl font-extrabold text-[#FFD700] font-serif">
            "Guest is God" at Sainik School Amaravathinagar
          </h3>
          <p className="text-sm sm:text-base text-amber-100 max-w-3xl mx-auto leading-relaxed">
            We are proud to host all participant teams and escort teachers on our campus. Boarding and lodging are provided free of cost, with separate accommodations for girls and boys in a disciplined military environment.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#1F0000] border border-[#D4AF37] px-6 py-2.5 rounded-full text-xs font-bold text-[#FFD700] shadow-lg">
            <Award className="w-4 h-4" />
            <span>Compete for Attractive Cash Prizes, Medals, Trophies & Alumni Incubation Support!</span>
          </div>

          <div className="pt-4">
            <button
              onClick={onGoToForm}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-black text-sm px-8 py-3 rounded-xl shadow-xl transition-all transform hover:scale-105"
            >
              Fill Innovation Submission Form Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
