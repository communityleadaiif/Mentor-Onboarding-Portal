import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Phone, HelpCircle, FileText, CheckCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible to participate in PRAJNA 2026 Ideathon?',
      a: 'The Ideathon is open to Senior Category school students studying in Grades 11 & 12 across Tamil Nadu. Teams must consist of exactly 3 students and 1 Escort/Guide Teacher.'
    },
    {
      q: 'Can a team submit an imaginary or textbook problem statement?',
      a: 'No. Ideathon strictly enforces the theme "Observe. Analyze. Innovate." Teams must visit a real local location (village, town, or school campus), capture 3 mandatory on-site verification photos, and map the responsible Tamil Nadu Government Department.'
    },
    {
      q: 'What are the 3 mandatory on-site verification photos required?',
      a: 'Photo 1: Close-up view of the specific issue. Photo 2: Wide-angle environmental view showing the surrounding context. Photo 3: Student team members standing together at the location site.'
    },
    {
      q: 'How does the Preliminary Completeness Audit work?',
      a: 'Upon submitting your proposal online, the website automatically audits field evidence completeness and generates a Preliminary Dossier Verification status (100% Complete). This confirms pre-screening qualification. Final Award Marks & Placement will be evaluated live by the Jury Panel on Event Day (Sept 05).'
    },
    {
      q: 'How will participation & merit certificates be awarded?',
      a: 'All official certificates (Student Participation, Escort Teacher Mentorship & Appreciation, and School Institutional Participation) will be conferred offline in person during the Valedictory Ceremony on Event Day (Sept 05, 2026) at Sainik School Amaravathinagar.'
    },
    {
      q: 'Is there any registration fee for participating in PRAJNA 2026?',
      a: 'No, participation in PRAJNA 2026 Ideathon is 100% free of cost, organized by Sainik School Amaravathinagar in association with the Amaravian Alumni Association (AAA).'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#8B0000] text-[#FFD700] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow">
          <HelpCircle className="w-4 h-4 text-[#FFD700]" />
          <span>Frequently Asked Questions & Support</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl mx-auto">
          Find answers to common participation rules, photo verification guidelines, and event day instructions.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#2A0000] border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-lg transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-white hover:text-[#FFD700] transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#FFD700] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-amber-100/80 leading-relaxed border-t border-[#D4AF37]/20 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact & WhatsApp Anchor Support Box */}
      <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
          <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-serif">
              Direct Contact & WhatsApp Anchor Support
            </h3>
            <p className="text-xs text-amber-200/70">
              Get instant assistance directly from event anchors for PRAJNA 2026.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Mr. Bhaarathi Ilango */}
          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFD700] uppercase text-[11px]">Ideathon Event Anchor</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-sm font-bold text-white">Mr. Bhaarathi Ilango</div>
            <p className="text-[11px] text-amber-200/70">Sainik School Amaravathinagar</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://wa.me/918870888634?text=Hello%20Mr.%20Bhaarathi%20Ilango,%20I%20have%20a%20query%20regarding%20PRAJNA%202026%20Ideathon"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl transition shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp (8870888634)</span>
              </a>

              <a href="tel:+918870888634" className="text-amber-200 hover:text-white flex items-center gap-1 bg-[#2A0000] border border-[#D4AF37]/40 px-3 py-2 rounded-xl font-bold transition">
                <Phone className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* General Secretariat Support */}
          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFD700] uppercase text-[11px]">Prajna Secretariat</span>
              <FileText className="w-4 h-4 text-[#FFD700]" />
            </div>

            <div className="text-sm font-bold text-white">Team Prajna 2026</div>
            <p className="text-[11px] text-amber-200/70">Amaravian Alumni Association (AAA)</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://www.festivalprajna.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] font-bold px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 transition shadow"
              >
                <span>Visit Main Portal</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
