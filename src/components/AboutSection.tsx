import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden" style={{ background: '#050f08' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.04)_0%,_transparent_70%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-emerald-500/50 text-sm tracking-widest uppercase mb-6">About Us</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-10" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Pioneering{' '}<em className="italic text-emerald-400/60">ideas</em>{' '}for{' '}<br className="hidden md:block" /><em className="italic text-emerald-400/60">minds that</em>{' '}create, build, and inspire.
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 border-t border-emerald-500/10 pt-10">
          <div>
            <p className="text-emerald-500/40 text-xs tracking-widest uppercase mb-3">Our Vision</p>
            <p className="text-white/60 text-sm leading-relaxed">To be the catalyst for transforming student innovations into scalable startups, particularly from Tier-2 and Tier-3 regions of India.</p>
          </div>
          <div>
            <p className="text-emerald-500/40 text-xs tracking-widest uppercase mb-3">Our Mission</p>
            <p className="text-white/60 text-sm leading-relaxed">Ignite innovation, empower entrepreneurs, and bridge the gap between grassroots ideas and global opportunity through mentorship and structured support.</p>
          </div>
          <div>
            <p className="text-emerald-500/40 text-xs tracking-widest uppercase mb-3">Our Roots</p>
            <p className="text-white/60 text-sm leading-relaxed">Based at AJK College of Arts and Science, Coimbatore — deeply rooted in nurturing talent from India's heartland, where tradition meets innovation.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
