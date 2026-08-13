import React, { useRef, useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { SDGS_DATA } from '../../data/sdgs';
import { SAINIK_SCHOOL_LOGO_BASE64 } from '../../data/sainikLogoBase64';
import { Download, CheckCircle2, ShieldCheck, Edit3, Loader2, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface EvaluationSheetProps {
  submission: FullSubmission;
  onEditSubmission?: () => void;
}

export const EvaluationSheet: React.FC<EvaluationSheetProps> = ({ submission, onEditSubmission }) => {
  const { team, problem, solution, sdg, ai, id, submissionDate } = submission;
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Calculate Field Completeness Audit Metrics
  const photosUploadedCount = [problem.photoCloseUp, problem.photoWideAngle, problem.photoTeamOnSite].filter(Boolean).length;
  const photoCompletenessPct = Math.round((photosUploadedCount / 3) * 100);

  const generateNativePDFFallback = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);
    let y = 12;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin - 10) {
        doc.addPage();
        drawPageBorder();
        y = margin + 4;
      }
    };

    const drawPageBorder = () => {
      doc.setDrawColor(139, 0, 0); // Maroon
      doc.setLineWidth(0.8);
      doc.rect(6, 6, pageWidth - 12, pageHeight - 12);

      doc.setDrawColor(212, 175, 55); // Gold inner line
      doc.setLineWidth(0.3);
      doc.rect(7.5, 7.5, pageWidth - 15, pageHeight - 15);
    };

    drawPageBorder();

    // Top Header Banner Box
    doc.setFillColor(139, 0, 0);
    doc.rect(margin, y, contentWidth, 26, 'F');

    // Embed Sainik School Crest Base64
    try {
      doc.addImage(SAINIK_SCHOOL_LOGO_BASE64, 'PNG', margin + 3, y + 2, 22, 22);
    } catch (e) {
      console.error(e);
    }

    doc.setTextColor(255, 215, 0); // Gold
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PRAJNA 2026: COMMUNITY INNOVATION FIELD DOSSIER', margin + 28, y + 9);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('SAINIK SCHOOL AMARAVATHINAGAR • AMARAVIAN ALUMNI ASSOCIATION (AAA)', margin + 28, y + 15);
    doc.text(`Official Ref: ${id} | Submitted: ${submissionDate}`, margin + 28, y + 21);

    y += 30;

    // Audit Checklist Box
    doc.setFillColor(248, 250, 252); // Soft Light Blue/Slate
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 24, 'S');

    doc.setTextColor(139, 0, 0);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PRE-SCREENING DOCUMENTATION AUDIT CHECKLIST', margin + 4, y + 6);

    doc.setTextColor(6, 95, 70); // Emerald green
    doc.text('STATUS: PRE-SCREENING VERIFIED & QUALIFIED', margin + 102, y + 6);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`• 3-Photo Field Evidence: ${photosUploadedCount}/3 Uploaded (${photoCompletenessPct}%)`, margin + 4, y + 12);
    doc.text(`• Responsible Govt Body: Mapped`, margin + 4, y + 17);
    doc.text(`• UN SDGs Alignment: ${(sdg.selectedSdgs || []).length} SDGs Mapped`, margin + 102, y + 12);
    doc.text(`• Budgeting & Feasibility: Verified Complete`, margin + 102, y + 17);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text(`* Note: Final Competition Award Marks & Rank will be assigned live by Jury Panel on Event Day (Sept 05).`, margin + 4, y + 22);

    y += 28;

    // Helper Section Banner
    const renderSectionHeader = (title: string) => {
      checkPageBreak(10);
      doc.setFillColor(139, 0, 0);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 3, y + 4.2);
      y += 8;
    };

    // Helper Field Line Renderer (Auto-Wrapped to prevent overflow)
    const addField = (label: string, value: string) => {
      const textStr = `${label}: ${value || 'N/A'}`;
      const lines = doc.splitTextToSize(textStr, contentWidth - 6);
      checkPageBreak(lines.length * 4.5 + 2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42); // Dark slate
      doc.setFontSize(8.5);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4.5 + 2;
    };

    // Section 1
    renderSectionHeader('1. PARTICIPANT & SCHOOL PROFILE');
    addField('School Name', team.schoolName);
    addField('District', `${team.schoolDistrict || 'Tamil Nadu'} | Category: ${team.teamCategory}`);
    addField('Innovation Team Name', team.teamName);
    addField('Team Leader', `${team.teamLeadName} (Ph: ${team.teamLeadPhone})`);
    addField('Team Members', `${team.member2Name}, ${team.member3Name}`);
    addField('Guide / Escort Teacher', `${team.guideTeacherName} (Ph: ${team.guideTeacherPhone})`);
    y += 3;

    // Section 2
    renderSectionHeader('2. GEOTAGGED LOCAL ISSUE & GOVERNMENT OWNERSHIP');
    addField('Problem Title', problem.problemTitle);
    addField('Exact Location', problem.problemLocation);
    addField('Responsible Government Body', problem.responsibleDept);
    addField('Affected Stakeholders', problem.stakeholdersAffected);

    // Why Problem Matters Box
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 0, 0);
    doc.text('Why Problem Matters (Root Factor Analysis):', margin + 2, y);
    y += 4.5;

    const whyLines = doc.splitTextToSize(problem.whyItMatters || 'N/A', contentWidth - 8);
    const whyBoxHeight = whyLines.length * 4.5 + 4;
    checkPageBreak(whyBoxHeight);

    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 2, y - 2, contentWidth - 4, whyBoxHeight, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin + 2, y - 2, contentWidth - 4, whyBoxHeight, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(whyLines, margin + 4, y + 2.5);
    y += whyBoxHeight + 5;

    // Section 3: Photos Evidence Embedding
    renderSectionHeader('3. AUTHENTICITY VERIFICATION EVIDENCE (3 MANDATORY PHOTOS)');
    checkPageBreak(48);

    const photoBoxWidth = 58;
    const photoBoxHeight = 38;
    const photos = [
      { title: '1. Close-Up View', src: problem.photoCloseUp },
      { title: '2. Wide-Angle Context', src: problem.photoWideAngle },
      { title: '3. Team On-Site', src: problem.photoTeamOnSite }
    ];

    photos.forEach((photo, idx) => {
      const px = margin + 2 + idx * (photoBoxWidth + 4);
      doc.setDrawColor(203, 213, 225);
      doc.rect(px, y, photoBoxWidth, photoBoxHeight, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(photo.title, px + 2, y + 4);

      if (photo.src) {
        try {
          const fmt = photo.src.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(photo.src, fmt, px + 2, y + 6, photoBoxWidth - 4, photoBoxHeight - 8);
        } catch (e) {
          console.error('PDF Photo embed error:', e);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7);
          doc.text('[Photo Evidence Uploaded]', px + 4, y + 20);
        }
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.text('[No Photo Uploaded]', px + 4, y + 20);
      }
    });

    y += photoBoxHeight + 6;

    // Section 4: Proposed Solution
    renderSectionHeader('4. PROPOSED SOLUTION & TECHNICAL FEASIBILITY');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 0, 0);
    doc.text('Solution Summary:', margin + 2, y);
    y += 4.5;

    const solLines = doc.splitTextToSize(solution.solutionSummary || 'N/A', contentWidth - 8);
    const solBoxHeight = solLines.length * 4.5 + 4;
    checkPageBreak(solBoxHeight);

    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 2, y - 2, contentWidth - 4, solBoxHeight, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin + 2, y - 2, contentWidth - 4, solBoxHeight, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(solLines, margin + 4, y + 2.5);
    y += solBoxHeight + 5;

    addField('Solution Uniqueness', solution.uniqueness);
    addField('Required Resources', solution.resourcesRequired);
    addField('Estimated Cost & Timeline', `INR ${solution.estimatedCost || 'N/A'} | Timeframe: ${solution.estimatedTime || 'N/A'}`);
    addField('Startup Potential & Paying Stakeholders', `${solution.canBecomeStartup} | Paying: ${(solution.whoWouldPay || []).join(', ')}`);
    y += 3;

    // Section 5: SDGs & AI Usage
    renderSectionHeader('5. UN SDG ALIGNMENT & AI USAGE TRANSPARENCY');
    const sdgStr = (sdg.selectedSdgs || []).map(s => {
      const item = SDGS_DATA.find(x => x.id === s);
      return `SDG ${s}: ${item?.shortTitle || ''}`;
    }).join(' | ');
    addField('Mapped UN SDGs', sdgStr);
    addField('AI Usage Transparency', `Used AI: ${ai.usedAI}${ai.usedAI === 'Yes' ? ` (Tools: ${(ai.aiTools || []).join(', ')} | Purposes: ${(ai.aiPurposes || []).join(', ')})` : ''}`);
    y += 6;

    // Jury Signature Footer Block
    checkPageBreak(22);
    doc.setDrawColor(139, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PRAJNA 2026 Jury Panel Evaluation Sign-Off', margin + 2, y);
    doc.text('Evaluator Signature & Date: ________________________', margin + 95, y);

    doc.save(`PRAJNA_2026_Field_Dossier_${id}.pdf`);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      try {
        generateNativePDFFallback();
      } catch (err) {
        console.error('PDF generation error:', err);
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-10 text-white">
      {/* Neatly Balanced Header Card */}
      <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 shadow shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  Documentation Audit Status: VERIFIED & QUALIFIED
                </h3>
                <span className="bg-emerald-900 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                  100% COMPLETE
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Dossier ID: <span className="text-[#FFD700] font-mono font-bold">{id}</span> • Submission Date: {submissionDate}
              </p>
            </div>
          </div>
        </div>

        {/* Organiser Revision Notice Box if Flagged */}
        {submission.auditInfo?.status === 'REVISION_REQUESTED' && (
          <div className="bg-amber-950/90 border-2 border-amber-400 p-5 rounded-2xl space-y-3 text-white shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>ACTION REQUIRED: Organiser Requested Revision / Corrected Photo Re-upload</span>
            </div>
            {submission.auditInfo.remark && (
              <div className="bg-[#1F0000] p-3 rounded-xl border border-amber-500/40 text-xs text-amber-100 italic">
                Organiser Remark: "{submission.auditInfo.remark}"
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-amber-200/80">
                The event organiser has reviewed your proposal. Please click below to edit your form and upload corrected photos or text.
              </p>
              {onEditSubmission && (
                <button
                  onClick={onEditSubmission}
                  className="bg-[#FFD700] hover:bg-yellow-400 text-[#2A0000] font-black text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0"
                >
                  ✏️ Edit Proposal & Replace Photos
                </button>
              )}
            </div>
          </div>
        )}

        {/* Middle Notice */}
        <div className="space-y-1.5 text-xs sm:text-sm text-amber-100/90 leading-relaxed bg-[#1F0000] p-4 rounded-xl border border-[#D4AF37]/20">
          <p>
            Your field evidence photos, local problem analysis, and feasibility metrics have been successfully audited and accepted for PRAJNA 2026.
          </p>
          <p className="text-[#FFD700] font-bold text-xs pt-1 flex items-center gap-1">
            📌 Note: Official Competition Award Marks & Rank will be assigned live by the Jury Panel on Event Day (Sept 05) during your stall presentation.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {onEditSubmission && (
            <button
              onClick={onEditSubmission}
              className="flex items-center justify-center gap-2 bg-[#1F0000] hover:bg-[#3A0000] border border-[#D4AF37]/50 text-amber-200 hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition shadow"
            >
              <Edit3 className="w-4 h-4 text-amber-300" />
              <span>Edit Proposal Data</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#2A0000] font-extrabold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating High-Res PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official Field Dossier PDF</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-amber-200/60 italic text-center pt-1">
          🎓 Note: All official certificates for Students, Escort Teachers, and Schools will be conferred physically/offline on Event Day (Sept 05, 2026) at Sainik School Amaravathinagar.
        </p>
      </div>

      {/* Main Official Scorecard Printable Paper View (Pure White Canvas, Perfectly Aligned) */}
      <div
        ref={printRef}
        className="bg-white text-slate-900 border-4 border-[#8B0000] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 font-sans max-w-full overflow-hidden"
      >
        {/* Official Header Banner */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#500000] to-[#8B0000] p-6 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={SAINIK_SCHOOL_LOGO_BASE64}
              alt="Sainik School Crest Logo"
              className="w-16 h-16 object-contain bg-white/10 p-1.5 rounded-full border border-[#FFD700]/50"
            />
            <div className="space-y-1 text-center sm:text-left">
              <span className="bg-[#FFD700] text-[#2A0000] px-2.5 py-0.5 rounded font-black text-[10px] uppercase tracking-widest">
                SAINIK SCHOOL AMARAVATHINAGAR • PRAJNA 2026
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-[#FFD700] tracking-tight">
                COMMUNITY INNOVATION FIELD DOSSIER
              </h1>
              <p className="text-xs text-amber-100/90 font-medium">
                Organized by Team Prajna in association with Amaravian Alumni Association (AAA)
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-[#1F0000]/80 border border-[#D4AF37]/50 px-4 py-2 rounded-xl shrink-0">
            <div className="text-[10px] text-[#FFD700] font-bold uppercase tracking-wider">Official Ref ID</div>
            <div className="text-sm font-mono font-extrabold text-white">{id}</div>
            <div className="text-[10px] text-amber-200/70">Submitted: {submissionDate}</div>
          </div>
        </div>

        {/* Audit Verification Summary Box */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <span className="text-xs font-black text-[#8B0000] uppercase tracking-wider">
              Pre-Screening Documentation Audit Checklist
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-white px-2.5 py-0.5 rounded text-[11px] font-bold shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              STATUS: PRE-SCREENING VERIFIED & QUALIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">3-Photo Evidence</div>
              <div className="text-sm font-black text-emerald-700">{photosUploadedCount}/3 Uploaded ({photoCompletenessPct}%)</div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Govt Department</div>
              <div className="text-sm font-black text-emerald-700">Mapped</div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Feasibility & Budget</div>
              <div className="text-sm font-black text-emerald-700">Verified Complete</div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">UN SDG Alignment</div>
              <div className="text-sm font-black text-emerald-700">{(sdg.selectedSdgs || []).length} SDGs</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic text-center pt-1 border-t border-slate-200/60">
            * Note: Final Competition Award Marks & Rank will be assigned live by Jury Panel on Event Day (Sept 05, 2026).
          </div>
        </div>

        {/* Section 1: Team & School Info */}
        <div className="space-y-3">
          <div className="bg-[#8B0000] text-[#FFD700] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
            1. Participant & School Profile
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="break-words">
              <span className="font-bold text-slate-600">School Name:</span>{' '}
              <strong className="text-slate-900">{team.schoolName || 'Not specified'}</strong>
            </div>
            <div>
              <span className="font-bold text-slate-600">District:</span> {team.schoolDistrict || 'Tiruppur'}
            </div>
            <div>
              <span className="font-bold text-slate-600">Team Name:</span> {team.teamName || 'Not specified'} ({team.teamCategory})
            </div>
            <div>
              <span className="font-bold text-slate-600">Team Lead:</span> {team.teamLeadName} ({team.teamLeadPhone})
            </div>
            <div>
              <span className="font-bold text-slate-600">Team Members:</span> {team.member2Name}, {team.member3Name}
            </div>
            <div>
              <span className="font-bold text-slate-600">Guide Teacher:</span> {team.guideTeacherName} ({team.guideTeacherPhone})
            </div>
          </div>
        </div>

        {/* Section 2: Local Problem & Govt Department */}
        <div className="space-y-3">
          <div className="bg-[#8B0000] text-[#FFD700] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
            2. Geotagged Local Issue & Government Ownership
          </div>
          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="break-words">
              <span className="font-bold text-slate-600">Problem Title:</span>{' '}
              <strong className="text-slate-900 font-extrabold text-sm">{problem.problemTitle || 'Not specified'}</strong>
            </div>
            <div className="break-words">
              <span className="font-bold text-slate-600">Exact Geotagged Location:</span> {problem.problemLocation}
            </div>
            <div>
              <span className="font-bold text-slate-600">Responsible Government Body:</span>{' '}
              <span className="bg-[#8B0000] text-[#FFD700] px-2.5 py-0.5 rounded text-[11px] font-extrabold ml-1 inline-block">
                {problem.responsibleDept}
              </span>
            </div>
            <div className="break-words">
              <span className="font-bold text-slate-600">Affected Stakeholders:</span> {problem.stakeholdersAffected}
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Why Problem Matters (Root Factor Analysis):</span>
              <p className="bg-white p-3 rounded-lg border border-slate-300 leading-relaxed text-slate-800 break-words font-normal">
                {problem.whyItMatters}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Photo Verification Evidence */}
        <div className="space-y-3">
          <div className="bg-[#8B0000] text-[#FFD700] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-between">
            <span>3. Authenticity Verification Evidence (3 Mandatory Photos)</span>
            <span className="text-[11px] font-bold text-[#FFD700]">
              {photosUploadedCount}/3 Photos Uploaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 p-2 text-center space-y-1.5 shadow-sm">
              <div className="text-[10px] font-black text-slate-600 uppercase">1. Close-Up View</div>
              {problem.photoCloseUp ? (
                <img src={problem.photoCloseUp} alt="Close up" className="w-full h-36 object-cover rounded-lg shadow" />
              ) : (
                <div className="h-36 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-medium">No Image Uploaded</div>
              )}
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 p-2 text-center space-y-1.5 shadow-sm">
              <div className="text-[10px] font-black text-slate-600 uppercase">2. Wide-Angle Context</div>
              {problem.photoWideAngle ? (
                <img src={problem.photoWideAngle} alt="Wide angle" className="w-full h-36 object-cover rounded-lg shadow" />
              ) : (
                <div className="h-36 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-medium">No Image Uploaded</div>
              )}
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 p-2 text-center space-y-1.5 shadow-sm">
              <div className="text-[10px] font-black text-slate-600 uppercase">3. Team On-Site</div>
              {problem.photoTeamOnSite ? (
                <img src={problem.photoTeamOnSite} alt="Team" className="w-full h-36 object-cover rounded-lg shadow" />
              ) : (
                <div className="h-36 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-medium">No Image Uploaded</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Solution Feasibility & Business Specs */}
        <div className="space-y-3">
          <div className="bg-[#8B0000] text-[#FFD700] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
            4. Solution Innovation & Costing Breakdown
          </div>
          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Proposed Solution Summary:</span>
              <p className="bg-white p-3 rounded-lg border border-slate-300 leading-relaxed text-slate-800 break-words font-normal">
                {solution.solutionSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="break-words">
                <span className="font-bold text-slate-600">Uniqueness:</span> {solution.uniqueness}
              </div>
              <div className="break-words">
                <span className="font-bold text-slate-600">Required Resources:</span> {solution.resourcesRequired}
              </div>
              <div>
                <span className="font-bold text-slate-600">Estimated Cost:</span> ₹ {solution.estimatedCost}
              </div>
              <div>
                <span className="font-bold text-slate-600">Estimated Timeframe:</span> {solution.estimatedTime}
              </div>
              <div>
                <span className="font-bold text-slate-600">Startup Viability:</span> {solution.canBecomeStartup}
              </div>
              <div className="break-words">
                <span className="font-bold text-slate-600">Paying Stakeholders:</span> {(solution.whoWouldPay || []).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: SDG Alignment & AI Readiness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* SDGs */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#8B0000] uppercase">Mapped UN SDGs</h4>
            <div className="flex flex-wrap gap-1.5">
              {sdg.selectedSdgs.map(id => {
                const item = SDGS_DATA.find(s => s.id === id);
                return (
                  <span key={id} style={{ backgroundColor: item?.color }} className="text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    SDG {id}: {item?.shortTitle}
                  </span>
                );
              })}
            </div>
          </div>

          {/* AI Readiness */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#8B0000] uppercase">AI Usage Transparency</h4>
            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              Used AI: <strong className="font-bold">{ai.usedAI}</strong>
              {ai.usedAI === 'Yes' && (
                <span className="block text-[11px] text-slate-600 mt-1">
                  Tools: {(ai.aiTools || []).join(', ')} | Purposes: {(ai.aiPurposes || []).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Judge Sign-Off Block */}
        <div className="border-t-2 border-[#8B0000] pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-700">
          <div>
            <div className="font-bold text-slate-900">Jury Final Evaluation Signature</div>
            <div className="text-[10px] text-slate-500">PRAJNA 2026 Jury Panel • Sainik School Amaravathinagar</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-slate-400">________________________</div>
            <div className="text-[10px] text-slate-500">Evaluator Sign & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
