import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    tag: 'Mentorship', title: '1:1 & Group Mentoring',
    description: 'Structured mentorship sessions — one-on-one deep dives and group workshops — helping founders navigate product, market, and growth challenges with expert guidance.',
  },
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    tag: 'Community', title: 'Network & Ecosystem Access',
    description: "Connect with a vibrant community of innovators, investors, and domain experts. As an AIIF mentor, you gain and give access to one of India's most dynamic startup ecosystems.",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-28 md:py-40 px-6 overflow-hidden relative" style={{ background: '#050f08' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.03)_0%,_transparent_60%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="flex items-end justify-between mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>What we offer</h2>
          <span className="text-emerald-500/40 text-sm hidden md:block">Our programs</span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((svc, i) => (
            <motion.div key={svc.title} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.15 }} className="liquid-glass rounded-3xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <video src={svc.videoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted autoPlay loop playsInline preload="auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050f08]/50 to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-500/40 text-xs tracking-widest uppercase">{svc.tag}</span>
                  <div className="liquid-glass rounded-full p-2"><ArrowUpRight size={16} className="text-emerald-400" /></div>
                </div>
                <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>{svc.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{svc.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
