import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="philosophy" className="py-28 md:py-40 px-6 overflow-hidden" style={{ background: '#050f08' }}>
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Mentorship{' '}<em className="italic text-emerald-500/40">×</em>{' '}Impact
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden aspect-[4/3] border border-emerald-500/10">
            <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline preload="auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col justify-center gap-8">
            <div>
              <p className="text-emerald-500/40 text-xs tracking-widest uppercase mb-4">Why Mentors Matter</p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed">Every meaningful breakthrough begins at the intersection of lived experience and bold curiosity. AIIF mentors bring that rare combination — translating industry wisdom into actionable guidance for first-generation entrepreneurs who dare to dream at scale.</p>
            </div>
            <div className="w-full h-px bg-emerald-500/10" />
            <div>
              <p className="text-emerald-500/40 text-xs tracking-widest uppercase mb-4">Shape the Future</p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed">The best mentorship emerges when conviction meets curiosity. Our mentors don't just advise — they co-create futures. By joining AIIF, you become part of a movement reshaping the startup landscape from within India's heartland.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
