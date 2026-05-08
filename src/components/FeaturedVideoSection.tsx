import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FeaturedVideoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden" style={{ background: '#050f08' }}>
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }} className="rounded-3xl overflow-hidden aspect-video relative border border-emerald-500/10">
          <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline preload="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050f08]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-emerald-500/50 text-xs tracking-widest uppercase mb-3">Our Approach</p>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">We believe in the power of curiosity-driven mentorship. Every startup journey begins with a question, and every mentor brings the wisdom to open new doors — from ideation to impact.</p>
            </div>
            <motion.a href="#mentor-form" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="liquid-glass rounded-full px-8 py-3 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors self-start md:self-auto">Join as a Mentor</motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
