import React, { useState } from 'react';
import { ShieldCheck, X, Award, ExternalLink, ArrowRight, Play } from 'lucide-react';

interface FloatingIntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingIntroVideoModal: React.FC<FloatingIntroVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlayingYoutube, setIsPlayingYoutube] = useState(true);

  if (!isOpen) return null;

  const videoId = 'waN74nb0r6A';
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Floating Card Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#3D0000] via-[#2A0000] to-[#1A0000] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.3)] text-white space-y-5 overflow-hidden">
        {/* Background Military Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#8B0000] text-[#FFD700] p-2 rounded-xl border border-[#D4AF37]/40 shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <span className="bg-[#FFD700] text-[#2A0000] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                SAINIK SCHOOL AMARAVATHINAGAR
              </span>
              <h3 className="text-lg sm:text-xl font-black font-serif text-white mt-0.5">
                Sainik - A Way of Life
              </h3>
            </div>
          </div>

          {/* Close Floating Modal Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-[#1F0000] hover:bg-[#8B0000] text-amber-200 hover:text-white px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 text-xs font-bold transition shadow"
            title="Skip / Close Intro Video"
          >
            <span>Skip / Close</span>
            <X className="w-4 h-4 text-[#FFD700]" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-[#D4AF37]/40 z-10">
          {isPlayingYoutube ? (
            <iframe
              src={embedUrl}
              title="Sainik - A Way of Life - Sainik School Amaravathinagar"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl"
            />
          ) : (
            <div
              onClick={() => setIsPlayingYoutube(true)}
              className="absolute top-0 left-0 w-full h-full cursor-pointer group/poster flex items-center justify-center overflow-hidden"
            >
              {/* Thumbnail Background Image */}
              <img
                src={thumbnailUrl}
                alt="Sainik - A Way of Life Poster"
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-105 opacity-85"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

              {/* Center Play Button Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#8B0000] to-[#500000] border-2 border-[#FFD700] flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover/poster:scale-110 transition-all duration-300">
                  <Play className="w-8 h-8 text-[#FFD700] fill-[#FFD700] ml-1" />
                </div>

                <span className="inline-flex items-center gap-1.5 bg-[#8B0000]/95 text-[#FFD700] border border-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-[#FFD700]" />
                  Start Intro Video
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls & Transcript */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#D4AF37]/20 relative z-10">
          <div className="flex items-center gap-2 text-xs text-amber-100/90">
            <Award className="w-4 h-4 text-[#FFD700] shrink-0" />
            <span className="italic font-medium">
              "Observe. Analyze. Innovate. Welcome to PRAJNA 2026."
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1F0000] hover:bg-[#3D0000] text-amber-200 px-3 py-2 rounded-xl text-xs font-bold border border-[#D4AF37]/30 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFD700]" />
              Open YouTube
            </a>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#2A0000] font-black text-xs px-6 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/40 transition transform hover:scale-105"
            >
              <span>Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
