import React, { useState } from 'react';
import { ShieldCheck, Award, Play, ExternalLink, RefreshCw } from 'lucide-react';

export const PrincipalVideoSection: React.FC = () => {
  const [useLocalVideo, setUseLocalVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = 'oqr6OYyahQI';
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const localVideoPath = '/video/principal_address.mp4';

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1F0000] via-[#2A0000] to-[#1A0000] text-white border-b border-[#D4AF37]/30 relative overflow-hidden">
      {/* Background Military Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#8B0000] text-[#FFD700] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span>Sainik School Amaravathinagar Leadership Message</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-tight">
            Principal's Welcome Address & Invitation
          </h2>
          <p className="text-amber-200/80 text-sm max-w-2xl mx-auto leading-relaxed">
            Listen to the official message from the Principal of Sainik School Amaravathinagar, welcoming schools, students, mentors, and alumni to PRAJNA 2026.
          </p>
        </div>

        {/* Video Player Showcase Frame Card */}
        <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-3xl p-3 sm:p-5 shadow-2xl shadow-black/80 relative overflow-hidden group">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FFD700] z-20 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FFD700] z-20 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FFD700] z-20 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FFD700] z-20 pointer-events-none" />

          {/* 16:9 In-Page Video Player Frame */}
          <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black shadow-inner border border-[#D4AF37]/40">
            {useLocalVideo ? (
              <video
                controls
                autoPlay={false}
                poster={thumbnailUrl}
                onError={() => {
                  // Fallback to iframe if local video file isn't present in /public/video/principal_address.mp4
                  setUseLocalVideo(false);
                }}
                className="absolute top-0 left-0 w-full h-full object-contain rounded-2xl z-10"
              >
                <source src={localVideoPath} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            ) : isPlaying ? (
              <iframe
                src={embedUrl}
                title="Sainik School Amaravathinagar Principal Address - PRAJNA 2026"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl z-10"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="absolute top-0 left-0 w-full h-full cursor-pointer group/poster flex items-center justify-center overflow-hidden"
              >
                {/* Thumbnail Background Image */}
                <img
                  src={thumbnailUrl}
                  alt="Sainik School Amaravathinagar Principal Address - PRAJNA 2026"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-105 opacity-85"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

                {/* Big Play Button Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-4 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#8B0000] to-[#500000] border-2 border-[#FFD700] flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover/poster:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 text-[#FFD700] fill-[#FFD700] ml-1" />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 bg-[#8B0000]/95 text-[#FFD700] border border-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-[#FFD700]" />
                      Play Video In-Page
                    </span>
                    <p className="text-[11px] text-amber-100/80 font-medium">
                      Click to start in-page video playback
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-banner transcript & info */}
          <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-100/90 px-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD700] shrink-0" />
              <span className="font-semibold italic">
                "PRAJNA is a platform for students from diverse schools to display their skills and experience the Sainik way of life."
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!useLocalVideo && isPlaying && (
                <button
                  onClick={() => setIsPlaying(false)}
                  className="inline-flex items-center gap-1.5 bg-[#1F0000] hover:bg-[#3D0000] text-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/40 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#FFD700]" />
                  Reset Player
                </button>
              )}

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] px-3.5 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/40 shadow transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open YouTube Link
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
