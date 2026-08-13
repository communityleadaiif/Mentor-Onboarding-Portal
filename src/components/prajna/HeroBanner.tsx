import React from 'react';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { SchoolMarquee } from './SchoolMarquee';
import type { SchoolEntry } from '../../data/participatingSchools';
import { Target, MapPin, Calendar, Users, Award, ShieldCheck, ArrowRight, Camera, Lightbulb } from 'lucide-react';

interface HeroBannerProps {
  onStartClick: () => void;
  onRulesClick: () => void;
  lang: Language;
  schools: SchoolEntry[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStartClick, onRulesClick, lang, schools }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#3D0000] via-[#2A0000] to-[#1F0000] text-white pt-16 border-b border-[#D4AF37]/30">
      {/* Background Military Grid Pattern & Subtle Crimson Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8B0000]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Host Insignia Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#8B0000]/80 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-200 shadow-md">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span>{t.sainikTitle}</span>
          </div>
          <span className="text-[#D4AF37] text-xs font-bold">•</span>
          <div className="inline-flex items-center gap-2 bg-[#500000]/80 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-100">
            <span>Amaravian Alumni Association (AAA)</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-serif text-white mb-3 leading-tight">
            PRAJNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#D4AF37]">2026</span>
          </h1>
          <p className="text-xl sm:text-3xl font-extrabold text-amber-100 tracking-wide mb-4">
            {t.ideathonSubtitle}
          </p>

          {/* Theme Quote Box */}
          <div className="inline-block bg-[#4A0000]/90 border-2 border-[#D4AF37] px-6 py-2.5 rounded-2xl shadow-xl shadow-black/40 mb-8 transform -rotate-1">
            <p className="text-lg sm:text-2xl font-black tracking-widest text-[#FFD700] uppercase font-mono">
              "{t.themeQuote}"
            </p>
          </div>

          <p className="text-base sm:text-lg text-amber-100/90 leading-relaxed font-normal max-w-3xl mx-auto mb-8">
            Every innovation begins with observing a real problem. Identify a genuine issue from your locality, village, school, or city, capture on-site photographic evidence, analyze the root cause, and present a practical solution.
          </p>

          {/* Core Concept Callout Banner */}
          <div className="bg-gradient-to-r from-[#600000] via-[#8B0000] to-[#600000] border-l-4 border-[#FFD700] p-5 rounded-r-2xl shadow-2xl text-left max-w-3xl mx-auto mb-10">
            <div className="flex items-start gap-3">
              <div className="bg-[#FFD700] text-[#2A0000] p-2 rounded-xl mt-0.5 shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-wide">
                  {t.coreConceptTitle}
                </h3>
                <p className="text-sm text-amber-100/90 mt-1 leading-snug">
                  {t.coreConceptDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartClick}
              className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#2A0000] font-extrabold text-base px-8 py-3.5 rounded-xl shadow-xl shadow-amber-950/60 hover:shadow-amber-500/30 transform hover:-translate-y-1 transition-all"
            >
              <Lightbulb className="w-5 h-5" />
              <span>{t.submitBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onRulesClick}
              className="flex items-center gap-2 bg-[#3D0000] hover:bg-[#500000] text-amber-100 font-bold text-base px-6 py-3.5 rounded-xl border border-[#D4AF37]/40 shadow-lg hover:border-[#D4AF37] transition-all"
            >
              <Camera className="w-5 h-5 text-[#FFD700]" />
              <span>{t.viewRulesBtn}</span>
            </button>
          </div>
        </div>

        {/* Feature Grid / Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 pb-12 border-t border-[#D4AF37]/20">
          <div className="bg-[#2A0000]/70 p-4 rounded-xl border border-[#D4AF37]/20 text-center">
            <Calendar className="w-5 h-5 text-[#FFD700] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/70 font-medium">Final Event Date</div>
            <div className="text-sm font-black text-white">Sept 05, 2026</div>
          </div>

          <div className="bg-[#2A0000]/70 p-4 rounded-xl border border-[#D4AF37]/20 text-center">
            <MapPin className="w-5 h-5 text-[#FFD700] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/70 font-medium">Venue Campus</div>
            <div className="text-sm font-black text-white">Sainik School, Amaravathinagar</div>
          </div>

          <div className="bg-[#2A0000]/70 p-4 rounded-xl border border-[#D4AF37]/20 text-center">
            <Users className="w-5 h-5 text-[#FFD700] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/70 font-medium">Eligibility</div>
            <div className="text-sm font-black text-white">Grades 11 & 12 (3 per team)</div>
          </div>

          <div className="bg-[#2A0000]/70 p-4 rounded-xl border border-[#D4AF37]/20 text-center">
            <Award className="w-5 h-5 text-[#FFD700] mx-auto mb-1.5" />
            <div className="text-xs text-amber-200/70 font-medium">Rewards & Support</div>
            <div className="text-sm font-black text-white">Cash Prizes + Incubation</div>
          </div>
        </div>
      </div>

      {/* Auto-Queuing Participating Schools Ticker */}
      <SchoolMarquee schools={schools} title={t.marqueeTitle} />
    </div>
  );
};
