import React, { useState, useEffect } from 'react';
import type { Language } from '../../data/translations';
import { TRANSLATIONS } from '../../data/translations';
import { Sparkles, Send, Award, Users, BookOpen, Clock, MapPin, HelpCircle, Globe2, PlayCircle, ShieldCheck } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'overview' | 'submit' | 'scorecard' | 'gallery' | 'map' | 'jury' | 'faq' | 'organiser';
  setActiveTab: (tab: 'overview' | 'submit' | 'scorecard' | 'gallery' | 'map' | 'jury' | 'faq' | 'organiser') => void;
  hasSubmission: boolean;
  lang: Language;
  onLanguageToggle: (lang: Language) => void;
  onOpenIntroVideoModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  hasSubmission,
  lang,
  onLanguageToggle,
  onOpenIntroVideoModal
}) => {
  const t = TRANSLATIONS[lang];
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0, hours: 0, mins: 0, secs: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-03T22:00:00').getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#2A0000]/95 backdrop-blur-xl border-b border-[#D4AF37]/30 shadow-2xl">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#1A0000] via-[#3D0000] to-[#1A0000] px-4 py-1.5 text-xs text-[#FDFBF7] border-b border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-[#D4AF37] text-[#2A0000] px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider">
            {t.sainikTitle}
          </span>
          <span className="hidden md:inline text-amber-200/80">
            Presented by Team Prajna in association with Amaravian Alumni Association (AAA)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Watch Floating Intro Video Button */}
          <button
            onClick={onOpenIntroVideoModal}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFD700] hover:text-white transition bg-[#8B0000]/40 border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-md"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#FFD700] shrink-0 animate-pulse" />
            <span>Watch Intro Video</span>
          </button>

          {/* Countdown */}
          <div className="hidden sm:flex items-center gap-2 text-amber-100 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-white/70">{t.regCloses}:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-[#FFD700]">
              <span>{timeLeft.days}d</span>:
              <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
              <span>{String(timeLeft.mins).padStart(2, '0')}m</span>:
              <span>{String(timeLeft.secs).padStart(2, '0')}s</span>
            </div>
          </div>

          {/* Bilingual Language Switcher Button */}
          <button
            onClick={() => onLanguageToggle(lang === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 bg-[#1F0000] border border-[#D4AF37] text-[#FFD700] px-2.5 py-0.5 rounded-lg text-xs font-extrabold hover:bg-[#8B0000] transition shadow"
            title="Switch Language / மொழி மாற்றவும்"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Crest & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="relative">
            <img
              src="./images/sainik_school_logo.png"
              alt="Amaravian Logo"
              className="w-12 h-12 object-contain drop-shadow-md rounded-full border border-[#D4AF37]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#8B0000] border border-[#D4AF37] text-[9px] font-extrabold text-[#FFD700] px-1 rounded">
              3.0
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                PRAJNA <span className="text-[#FFD700]">2026</span>
              </h1>
              <span className="hidden sm:inline-block bg-[#8B0000]/80 text-amber-200 border border-[#D4AF37]/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Ideathon
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-medium tracking-wide">
              {t.ideathonSubtitle}
            </p>
          </div>
        </div>

        {/* Public Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#1F0000]/80 p-1.5 rounded-xl border border-[#D4AF37]/30 shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'overview' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.navOverview}
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'submit' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {t.navSubmit}
          </button>

          <button
            onClick={() => setActiveTab('scorecard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'scorecard' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            {t.navScorecard}
            {hasSubmission && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'gallery' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t.navGallery}
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'map' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {t.navMap}
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'faq' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-100/80 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {t.navFAQ}
          </button>

          <button
            onClick={() => setActiveTab('organiser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'organiser' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/50 shadow' : 'text-amber-200/90 hover:text-[#FFD700]'
            }`}
            title="Official Organiser Audit Access"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Organiser Desk</span>
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.submitBtn}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center gap-1 bg-[#1F0000]/95 border-t border-[#D4AF37]/20 px-2 py-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'overview' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navOverview}
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'submit' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navSubmit}
        </button>
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'scorecard' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navScorecard}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'gallery' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navGallery}
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'map' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navMap}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'faq' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-100/70'
          }`}
        >
          {t.navFAQ}
        </button>
        <button
          onClick={() => setActiveTab('organiser')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'organiser' ? 'bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40' : 'text-amber-200/90'
          }`}
        >
          🛡️ Organiser
        </button>
      </div>
    </header>
  );
};
