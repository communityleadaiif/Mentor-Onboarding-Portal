import React from 'react';
import type { FullSubmission } from '../../types/prajna';
import { CheckCircle2, MessageSquare, Mail, Eye, X } from 'lucide-react';

interface SubmissionSuccessModalProps {
  submission: FullSubmission;
  isOpen: boolean;
  onClose: () => void;
  onViewScorecard: () => void;
  onDownloadPDF?: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  submission,
  isOpen,
  onClose,
  onViewScorecard
}) => {
  if (!isOpen) return null;

  const { team, problem, id, submissionDate } = submission;

  // Organiser WhatsApp Notification Message
  const whatsappMsg = encodeURIComponent(
    `🚨 *NEW PRAJNA 2026 IDEATHON SUBMISSION REGISTERED*\n\n` +
    `📌 *Dossier ID:* ${id}\n` +
    `🏫 *School:* ${team.schoolName} (${team.schoolDistrict})\n` +
    `👥 *Team Name:* ${team.teamName}\n` +
    `👤 *Team Lead:* ${team.teamLeadName} (${team.teamLeadPhone})\n` +
    `👨‍🏫 *Guide Teacher:* ${team.guideTeacherName} (${team.guideTeacherPhone})\n\n` +
    `🎯 *Problem Title:* ${problem.problemTitle}\n` +
    `📍 *Location:* ${problem.problemLocation}\n` +
    `🏛️ *Govt Dept:* ${problem.responsibleDept}\n\n` +
    `✅ *Pre-Screening Audit Ready for Organisers!*`
  );

  const whatsappUrl = `https://wa.me/918870888634?text=${whatsappMsg}`;

  // Email Copy Trigger Link
  const recipientEmails = [team.teamLeadEmail, team.guideTeacherEmail].filter(Boolean).join(',');
  const emailSubject = encodeURIComponent(`PRAJNA 2026 Field Dossier Submission Copy - ${id}`);
  const emailBody = encodeURIComponent(
    `Dear ${team.teamLeadName} and ${team.guideTeacherName},\n\n` +
    `Your Community Innovation Field Dossier has been successfully registered for PRAJNA 2026!\n\n` +
    `Dossier ID: ${id}\n` +
    `Team Name: ${team.teamName}\n` +
    `School: ${team.schoolName}, ${team.schoolDistrict}\n` +
    `Problem Title: ${problem.problemTitle}\n` +
    `Submission Date: ${submissionDate}\n\n` +
    `Pre-Screening Status: 100% VERIFIED & QUALIFIED\n` +
    `Note: Official Competition Marks & Rank will be assigned live on Event Day (Sept 05, 2026) at Sainik School Amaravathinagar.\n\n` +
    `Warm regards,\n` +
    `Team Prajna Secretariat & Amaravian Alumni Association (AAA)`
  );
  const emailUrl = `mailto:${recipientEmails}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-200/70 hover:text-white bg-[#1F0000] p-2 rounded-full border border-[#D4AF37]/30 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50 shadow-lg animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="bg-emerald-900 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/40">
              OFFICIALLY REGISTERED & AUDITED
            </span>
            <h2 className="text-2xl font-black font-serif text-white mt-2">
              🎉 Innovation Proposal Submitted Successfully!
            </h2>
            <p className="text-xs text-amber-200/80 mt-1">
              Your Community Innovation Field Dossier has been recorded for PRAJNA 2026.
            </p>
          </div>
        </div>

        {/* Ref ID Card */}
        <div className="bg-[#1F0000] border border-[#D4AF37]/40 rounded-2xl p-4 text-center space-y-1 shadow-inner">
          <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Official Field Dossier Ref ID</div>
          <div className="text-2xl font-mono font-black text-[#FFD700] tracking-widest">{id}</div>
          <div className="text-[11px] text-amber-100/70">
            {team.teamName} • {team.schoolName} ({team.schoolDistrict})
          </div>
        </div>

        {/* Notification Actions Grid */}
        <div className="space-y-3 pt-1">
          <div className="text-xs font-bold text-[#FFD700] uppercase tracking-wider text-center">
            Instant Notifications & Dossier Actions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Organiser Alert Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>Send WhatsApp Alert to Organiser</span>
            </a>

            {/* Email Copy Trigger Button */}
            <a
              href={emailUrl}
              className="flex items-center justify-center gap-2 bg-[#1F0000] hover:bg-[#3A0000] border border-[#D4AF37]/50 text-amber-200 hover:text-white font-bold text-xs px-4 py-3 rounded-xl shadow transition"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Email Dossier Copy to Team</span>
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              onViewScorecard();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-black text-sm py-3.5 rounded-xl shadow-xl transition transform hover:scale-[1.01]"
          >
            <Eye className="w-4 h-4" />
            <span>Open Scorecard & Download Official PDF</span>
          </button>
        </div>

        <p className="text-[11px] text-amber-200/60 italic text-center pt-1">
          🎓 Note: All official certificates for Students, Escort Teachers, and Schools will be conferred physically on Event Day (Sept 05, 2026) at Sainik School Amaravathinagar.
        </p>
      </div>
    </div>
  );
};
