import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Globe, Phone } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from './Icons';

interface HeroProps {
  onEmailSubmit?: (email: string) => void;
}

export default function HeroSection({ onEmailSubmit }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [heroEmail, setHeroEmail] = useState('');

  const animateOpacity = (el: HTMLVideoElement, from: number, to: number, duration: number, onDone?: () => void) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      el.style.opacity = String(from + (to - from) * t);
      if (t < 1) animFrameRef.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = '0';
    const onCanPlay = () => { video.play().then(() => animateOpacity(video, 0, 1, 500)).catch(() => {}); };
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.55) {
        const cur = parseFloat(video.style.opacity || '1');
        if (cur > 0.01) animateOpacity(video, cur, 0, Math.max((video.duration - video.currentTime) * 1000, 100));
      }
    };
    const onEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => { video.currentTime = 0; video.play().then(() => animateOpacity(video, 0, 1, 500)).catch(() => {}); }, 100);
    };
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleEmailSubmit = () => {
    if (heroEmail.trim()) {
      onEmailSubmit?.(heroEmail.trim());
      document.getElementById('mentor-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForm = () => document.getElementById('mentor-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col" style={{ background: 'linear-gradient(180deg, #050f08 0%, #071a0d 100%)' }}>
      <video ref={videoRef} src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" className="absolute inset-0 w-full h-full object-cover object-bottom" muted autoPlay playsInline preload="auto" style={{ opacity: 0 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,15,8,0.6), rgba(5,15,8,0.4), rgba(5,15,8,0.7))' }} />

      {/* Navbar */}
      <nav className="relative z-20 px-4 md:px-6 py-5">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/aiif-logo.png" alt="AIIF Logo" className="h-8 md:h-10 object-contain" />
            <div className="hidden md:flex items-center ml-8 gap-8">
              <a href="#about" className="text-white/80 hover:text-emerald-400 text-sm font-medium transition-colors">About</a>
              <a href="#philosophy" className="text-white/80 hover:text-emerald-400 text-sm font-medium transition-colors">Our Mission</a>
              <a href="#services" className="text-white/80 hover:text-emerald-400 text-sm font-medium transition-colors">Programs</a>
              <a href="#mentor-form" className="text-white/80 hover:text-emerald-400 text-sm font-medium transition-colors">Join as Mentor</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://aiif.in" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm font-medium hidden sm:block hover:text-emerald-400 transition-colors">Visit AIIF</a>
            <button onClick={scrollToForm} className="liquid-glass rounded-full px-5 py-2 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors">Apply Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[8%]">
        <div className="mb-3">
          <span className="text-emerald-400/60 text-xs tracking-[0.25em] uppercase font-medium">AJK Innovation Incubator Foundation</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-9xl text-white tracking-tight mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Shape <em className="italic text-emerald-400/80">tomorrow's</em>
          <br />
          <span className="block">entrepreneurs.</span>
        </h1>

        <div className="max-w-xl w-full mb-6">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input type="email" value={heroEmail} onChange={e => setHeroEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()} placeholder="Enter your email to get started" className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none border-none" />
            <button onClick={handleEmailSubmit} className="bg-emerald-500 rounded-full p-3 text-white hover:bg-emerald-600 transition-colors flex-shrink-0">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <p className="text-white/50 text-sm leading-relaxed px-4 max-w-md mb-8">
          Join AIIF's mentor network and help the next generation of student founders build scalable, impactful startups from Tier-2 and Tier-3 India.
        </p>

        <button onClick={scrollToForm} className="liquid-glass rounded-full px-8 py-3 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors">
          Become a Mentor →
        </button>
      </div>

      {/* Social + Contact */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-10">
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Phone size={12} /> <span>+91 89258 89316</span>
        </div>
        <div className="flex justify-center gap-3">
          <a href="https://www.instagram.com/aiif.innovation/" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-3 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><InstagramIcon size={18} /></a>
          <a href="https://in.linkedin.com/company/ajkinnovationincubatorfoundation" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-3 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><LinkedinIcon size={18} /></a>
          <a href="https://aiif.in" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-3 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><Globe size={18} /></a>
        </div>
      </div>
    </section>
  );
}
