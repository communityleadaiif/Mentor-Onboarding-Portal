import React from 'react';
import { Award, Mail, Phone, Globe, MapPin, Lock, Shield } from 'lucide-react';

interface PrajnaFooterProps {
  onOpenJuryLogin?: () => void;
  onOpenOrganiserDesk?: () => void;
}

export const PrajnaFooter: React.FC<PrajnaFooterProps> = ({ onOpenJuryLogin, onOpenOrganiserDesk }) => {
  return (
    <footer className="bg-[#1F0000] border-t-2 border-[#D4AF37]/40 text-amber-100/90 text-sm py-12 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[#D4AF37]/20 pb-10">
          {/* Column 1: Organizers & Crest */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="./images/sainik_school_logo.png"
                alt="Amaravian Crest Logo"
                className="w-10 h-10 object-contain drop-shadow"
              />
              <div>
                <div className="text-[#FFD700] font-bold text-xs uppercase tracking-wider">Organized By</div>
                <div className="font-extrabold text-white text-sm font-serif">Team Prajna & AAA</div>
              </div>
            </div>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              In association with Amaravian Alumni Association (AAA) & Sainik School Amaravathinagar. Nurturing grassroots community innovation across Tamil Nadu school students.
            </p>
          </div>

          {/* Column 2: Event Venue & Logistics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-serif text-sm">
              <MapPin className="w-4 h-4 text-[#FFD700]" />
              <span>Campus Venue & Dates</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-200/80">
              <li>📍 Sainik School Campus, Amaravathinagar</li>
              <li>🏛️ Udumalpet Taluk, Tiruppur Dist, TN 642102</li>
              <li>📅 Event Day: September 05, 2026 (Teachers' Day)</li>
              <li>🏆 Live Stall Exhibition & Jury Presentation</li>
            </ul>
          </div>

          {/* Column 3: Ideathon Secretariat Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-serif text-sm">
              <Award className="w-4 h-4 text-[#FFD700]" />
              <span>Ideathon Secretariat</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                <span>Mr. Bhaarathi Ilango (WhatsApp / Call):</span>
                <a href="https://wa.me/918870888634" target="_blank" rel="noreferrer" className="text-[#FFD700] font-mono font-bold hover:underline">
                  +91 88708 88634
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                <a href="mailto:festivalprajna@gmail.com" className="text-amber-100 hover:text-[#FFD700] underline">
                  festivalprajna@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                <a href="https://www.festivalprajna.com" target="_blank" rel="noreferrer" className="text-[#FFD700] hover:underline">
                  www.festivalprajna.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D4AF37]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-100/50">
          <p>© 2026 PRAJNA 3.0 • Team Prajna & Amaravian Alumni Association (AAA). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[10px]">Observe. Analyze. Innovate.</p>

            {onOpenOrganiserDesk && (
              <button
                onClick={onOpenOrganiserDesk}
                className="flex items-center gap-1 text-[10px] text-amber-200/70 hover:text-[#FFD700] font-mono transition bg-[#2A0000] px-2 py-0.5 rounded border border-[#D4AF37]/30"
                title="Official Organiser Audit Access Only"
              >
                <Shield className="w-3 h-3 text-[#FFD700]" />
                <span>Organiser Desk</span>
              </button>
            )}

            {onOpenJuryLogin && (
              <button
                onClick={onOpenJuryLogin}
                className="flex items-center gap-1 text-[10px] text-amber-200/60 hover:text-[#FFD700] font-mono transition bg-[#2A0000] px-2 py-0.5 rounded border border-[#D4AF37]/20"
                title="Official Jury Access Only"
              >
                <Lock className="w-3 h-3 text-[#FFD700]" />
                <span>Jury Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
