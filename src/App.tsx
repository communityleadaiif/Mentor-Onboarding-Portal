import { useState } from 'react';
import NatureBackground from './components/NatureBackground';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import MentorFormSection from './components/MentorFormSection';
import { Phone, Globe } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from './components/Icons';

function App() {
  const [heroEmail, setHeroEmail] = useState('');

  return (
    <div className="min-h-screen relative" style={{ background: '#050f08' }}>
      <NatureBackground />
      <div className="relative z-10">
        <HeroSection onEmailSubmit={setHeroEmail} />
        <AboutSection />
        <FeaturedVideoSection />
        <PhilosophySection />
        <ServicesSection />
        <MentorFormSection initialEmail={heroEmail} />

        <footer className="border-t border-emerald-500/10 py-12 px-6" style={{ background: '#040d07' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/aiif-logo.png" alt="AIIF" className="h-8 object-contain" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-white/30 text-xs">AJK College of Arts and Science Campus, Navakkarai, Coimbatore - 641105</p>
              <div className="flex items-center gap-4 text-white/30 text-xs">
                <span className="flex items-center gap-1"><Phone size={10} /> +91 89258 89316</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/aiif.innovation/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-emerald-400 transition-colors"><InstagramIcon size={16} /></a>
              <a href="https://in.linkedin.com/company/ajkinnovationincubatorfoundation" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-emerald-400 transition-colors"><LinkedinIcon size={16} /></a>
              <a href="https://aiif.in" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-emerald-400 transition-colors"><Globe size={16} /></a>
            </div>
          </div>
          <p className="text-white/15 text-xs text-center mt-6">© {new Date().getFullYear()} AIIF. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
