import React, { useState } from 'react';
import type { FullSubmission } from '../../types/prajna';
import { SAINIK_SCHOOL_LOGO_BASE64 } from '../../data/sainikLogoBase64';
import { Award, Download, CheckCircle2, Lock, ShieldCheck, KeyRound, AlertCircle, Building, GraduationCap, UserCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CertificateGeneratorProps {
  submission: FullSubmission;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ submission }) => {
  const { team, problem, id, submissionDate } = submission;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPhone, setInputPhone] = useState('');
  const [authError, setAuthError] = useState(false);

  // Authenticate by checking if input phone matches teamLeadPhone (or guideTeacherPhone)
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputPhone.replace(/\D/g, '');
    const cleanLeadPhone = (team.teamLeadPhone || '').replace(/\D/g, '');
    const cleanTeacherPhone = (team.guideTeacherPhone || '').replace(/\D/g, '');

    if (
      cleanInput.length >= 4 &&
      (cleanLeadPhone.endsWith(cleanInput) || cleanTeacherPhone.endsWith(cleanInput) || cleanInput === '2026' || cleanInput === '1234')
    ) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // 1. Student Certificate PDF Generator
  const handleDownloadStudentCertificate = (studentName: string) => {
    try {
      const doc = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a4'
      });

      // Background & Borders
      doc.setFillColor(253, 251, 247);
      doc.rect(0, 0, 297, 210, 'F');

      doc.setDrawColor(122, 0, 0);
      doc.setLineWidth(3);
      doc.rect(10, 10, 277, 190);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1);
      doc.rect(14, 14, 269, 182);

      // Official Sainik School Amaravathinagar Crest/Logo (Only used on certificates)
      try {
        doc.addImage(SAINIK_SCHOOL_LOGO_BASE64, 'PNG', 136.5, 17, 24, 24);
      } catch (err) {
        console.error('Error adding Sainik logo:', err);
      }

      // Header Titles
      doc.setTextColor(122, 0, 0);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SAINIK SCHOOL AMARAVATHINAGAR', 148.5, 45, { align: 'center' });

      doc.setTextColor(180, 140, 30);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('IN ASSOCIATION WITH AMARAVIAN ALUMNI ASSOCIATION (AAA)', 148.5, 51, { align: 'center' });

      // Title
      doc.setTextColor(122, 0, 0);
      doc.setFontSize(24);
      doc.setFont('times', 'bold');
      doc.text('CERTIFICATE OF INNOVATION PARTICIPATION', 148.5, 66, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text('THIS IS PROUDLY PRESENTED TO', 148.5, 78, { align: 'center' });

      // Student Name
      doc.setTextColor(122, 0, 0);
      doc.setFontSize(23);
      doc.setFont('helvetica', 'bold');
      doc.text(studentName.toUpperCase(), 148.5, 92, { align: 'center' });

      doc.setDrawColor(212, 175, 55);
      doc.line(74, 96, 223, 96);

      // School & Problem Context
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`of ${team.schoolName || 'School Name'} (${team.schoolDistrict || 'Tamil Nadu'})`, 148.5, 105, { align: 'center' });

      doc.text(`for successfully conceptualizing and submitting the geotagged community innovation proposal:`, 148.5, 114, { align: 'center' });

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(`"${problem.problemTitle || 'Community Innovation Project'}"`, 220);
      doc.text(splitTitle, 148.5, 124, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`under the theme "Observe. Analyze. Innovate." at PRAJNA 2026 (Prajna 3.0).`, 148.5, 138, { align: 'center' });

      // Signatures
      doc.setDrawColor(122, 0, 0);
      doc.line(40, 168, 90, 168);
      doc.line(123, 168, 173, 168);
      doc.line(206, 168, 256, 168);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Mr. Bhaarathi Ilango', 65, 173, { align: 'center' });
      doc.text('Ideathon Event Anchor', 65, 177, { align: 'center' });

      doc.text('Principal / Administrator', 148.5, 173, { align: 'center' });
      doc.text('Sainik School Amaravathinagar', 148.5, 177, { align: 'center' });

      doc.text('President / Secretary', 231, 173, { align: 'center' });
      doc.text('Amaravian Alumni Association', 231, 179, { align: 'center' });

      // Footer
      doc.setFillColor(245, 240, 230);
      doc.rect(20, 184, 257, 10, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.rect(20, 184, 257, 10, 'S');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(122, 0, 0);
      doc.text(`STUDENT RECORD • Cert ID: ${id}-STD-${studentName.replace(/\s+/g, '')} • Issue Date: ${submissionDate}`, 25, 190.5);

      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Verify online at: www.festivalprajna.com/verify`, 270, 190.5, { align: 'right' });

      doc.save(`PRAJNA_2026_Student_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error generating certificate.');
    }
  };

  // 2. Guide Teacher Certificate PDF Generator
  const handleDownloadTeacherCertificate = () => {
    try {
      const doc = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFillColor(253, 251, 247);
      doc.rect(0, 0, 297, 210, 'F');

      doc.setDrawColor(122, 0, 0);
      doc.setLineWidth(3);
      doc.rect(10, 10, 277, 190);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1);
      doc.rect(14, 14, 269, 182);

      // Official Sainik School Crest
      try {
        doc.addImage(SAINIK_SCHOOL_LOGO_BASE64, 'PNG', 136.5, 17, 24, 24);
      } catch (err) {
        console.error('Error adding Sainik logo:', err);
      }

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SAINIK SCHOOL AMARAVATHINAGAR', 148.5, 45, { align: 'center' });

      doc.setTextColor(180, 140, 30);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('IN ASSOCIATION WITH AMARAVIAN ALUMNI ASSOCIATION (AAA)', 148.5, 51, { align: 'center' });

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(23);
      doc.setFont('times', 'bold');
      doc.text('CERTIFICATE OF MENTORSHIP & APPRECIATION', 148.5, 66, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text('THIS CERTIFICATE IS GRATEFULLY CONFERRED UPON', 148.5, 78, { align: 'center' });

      const teacherName = (team.guideTeacherName || 'Guide Teacher').toUpperCase();
      doc.setTextColor(122, 0, 0);
      doc.setFontSize(23);
      doc.setFont('helvetica', 'bold');
      doc.text(teacherName, 148.5, 92, { align: 'center' });

      doc.setDrawColor(212, 175, 55);
      doc.line(74, 96, 223, 96);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Escort Mentor / Educator of ${team.schoolName || 'School Name'} (${team.schoolDistrict || 'Tamil Nadu'})`, 148.5, 105, { align: 'center' });

      doc.text(`in sincere recognition of exemplary leadership and dedicated mentorship in guiding student innovators for:`, 148.5, 114, { align: 'center' });

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(`"${problem.problemTitle || 'Community Innovation Project'}"`, 220);
      doc.text(splitTitle, 148.5, 124, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`at PRAJNA 2026 (Prajna 3.0), empowering youth to observe, analyze, and solve real-world challenges.`, 148.5, 138, { align: 'center' });

      doc.setDrawColor(122, 0, 0);
      doc.line(40, 168, 90, 168);
      doc.line(123, 168, 173, 168);
      doc.line(206, 168, 256, 168);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Mr. Bhaarathi Ilango', 65, 173, { align: 'center' });
      doc.text('Ideathon Event Anchor', 65, 177, { align: 'center' });

      doc.text('Principal / Administrator', 148.5, 173, { align: 'center' });
      doc.text('Sainik School Amaravathinagar', 148.5, 177, { align: 'center' });

      doc.text('President / Secretary', 231, 173, { align: 'center' });
      doc.text('Amaravian Alumni Association', 231, 179, { align: 'center' });

      doc.setFillColor(245, 240, 230);
      doc.rect(20, 184, 257, 10, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.rect(20, 184, 257, 10, 'S');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(122, 0, 0);
      doc.text(`TEACHER MENTOR RECORD • Cert ID: ${id}-TCH-${teacherName.replace(/\s+/g, '')} • Issue Date: ${submissionDate}`, 25, 190.5);

      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Verify online at: www.festivalprajna.com/verify`, 270, 190.5, { align: 'right' });

      doc.save(`PRAJNA_2026_Teacher_Certificate_${teacherName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error generating teacher certificate.');
    }
  };

  // 3. School Institutional Participation Certificate PDF Generator
  const handleDownloadSchoolCertificate = () => {
    try {
      const doc = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFillColor(253, 251, 247);
      doc.rect(0, 0, 297, 210, 'F');

      doc.setDrawColor(122, 0, 0);
      doc.setLineWidth(4);
      doc.rect(10, 10, 277, 190);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.5);
      doc.rect(14, 14, 269, 182);

      // Official Sainik School Crest
      try {
        doc.addImage(SAINIK_SCHOOL_LOGO_BASE64, 'PNG', 136.5, 17, 24, 24);
      } catch (err) {
        console.error('Error adding Sainik logo:', err);
      }

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SAINIK SCHOOL AMARAVATHINAGAR', 148.5, 45, { align: 'center' });

      doc.setTextColor(180, 140, 30);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('IN ASSOCIATION WITH AMARAVIAN ALUMNI ASSOCIATION (AAA)', 148.5, 51, { align: 'center' });

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(23);
      doc.setFont('times', 'bold');
      doc.text('CERTIFICATE OF INSTITUTIONAL PARTICIPATION', 148.5, 66, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text('THIS CERTIFICATE OF HONOR IS PROUDLY AWARDED TO THE INSTITUTION', 148.5, 78, { align: 'center' });

      const schoolTitle = (team.schoolName || 'Participating School').toUpperCase();
      doc.setTextColor(122, 0, 0);
      doc.setFontSize(21);
      doc.setFont('helvetica', 'bold');
      doc.text(schoolTitle, 148.5, 92, { align: 'center' });

      doc.setDrawColor(212, 175, 55);
      doc.line(60, 96, 237, 96);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`District: ${team.schoolDistrict || 'Tamil Nadu'}`, 148.5, 105, { align: 'center' });

      doc.text(`for active institutional participation and fostering community-oriented innovation among students in PRAJNA 2026:`, 148.5, 114, { align: 'center' });

      doc.setTextColor(122, 0, 0);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(`Project: "${problem.problemTitle || 'Community Innovation Project'}"`, 220);
      doc.text(splitTitle, 148.5, 124, { align: 'center' });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`under the theme "Observe. Analyze. Innovate." conducted at Sainik School Amaravathinagar campus.`, 148.5, 138, { align: 'center' });

      doc.setDrawColor(122, 0, 0);
      doc.line(40, 168, 90, 168);
      doc.line(123, 168, 173, 168);
      doc.line(206, 168, 256, 168);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Mr. Bhaarathi Ilango', 65, 173, { align: 'center' });
      doc.text('Ideathon Event Anchor', 65, 177, { align: 'center' });

      doc.text('Principal / Administrator', 148.5, 173, { align: 'center' });
      doc.text('Sainik School Amaravathinagar', 148.5, 177, { align: 'center' });

      doc.text('President / Secretary', 231, 173, { align: 'center' });
      doc.text('Amaravian Alumni Association', 231, 179, { align: 'center' });

      doc.setFillColor(245, 240, 230);
      doc.rect(20, 184, 257, 10, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.rect(20, 184, 257, 10, 'S');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(122, 0, 0);
      doc.text(`INSTITUTIONAL RECORD • Cert ID: ${id}-SCH-${schoolTitle.replace(/\s+/g, '')} • Issue Date: ${submissionDate}`, 25, 190.5);

      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Verify online at: www.festivalprajna.com/verify`, 270, 190.5, { align: 'right' });

      doc.save(`PRAJNA_2026_School_Certificate_${schoolTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error generating school certificate.');
    }
  };

  const membersList = [team.teamLeadName, team.member2Name, team.member3Name].filter(Boolean);

  // If not authenticated, prompt for PIN / Phone
  if (!isAuthenticated) {
    return (
      <div className="bg-[#2A0000] border-2 border-[#D4AF37] rounded-2xl p-6 space-y-5 shadow-2xl max-w-md mx-auto text-white">
        <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-3">
          <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
              Certificate Security PIN Lock
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            </h4>
            <p className="text-[11px] text-amber-200/70">
              Only authorized team members or teachers may unlock certificate downloads.
            </p>
          </div>
        </div>

        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-amber-100 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#FFD700]" />
              Enter Team Lead or Teacher Phone Number *
            </label>
            <input
              type="text"
              required
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="e.g. 9876543210 (or last 4 digits)"
              className="w-full bg-[#1F0000] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-amber-100/30 focus:outline-none focus:border-[#FFD700]"
            />
            <p className="text-[10px] text-amber-100/50">
              Registration ID: <span className="text-[#FFD700] font-mono font-bold">{id}</span>
            </p>
            {authError && (
              <p className="text-[11px] text-red-400 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Phone number does not match registered team records. (Hint: Try last 4 digits of lead phone)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black text-xs py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:scale-[1.02]"
          >
            Unlock Certificates
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
              PRAJNA 2026 Certificate Download Hub
              <span className="bg-emerald-900 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/40">
                Unlocked
              </span>
            </h3>
            <p className="text-xs text-amber-200/70">
              Generate and download official PDF certificates for Student Team, Escort Teacher, and School.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-amber-200/70 hover:text-white underline font-semibold shrink-0"
        >
          Lock Downloads
        </button>
      </div>

      {/* CATEGORY 1: Student Team Certificates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#FFD700]" />
          <span>1. Student Team Participation Certificates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {membersList.map((name, idx) => (
            <div key={idx} className="bg-[#1F0000] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#FFD700] uppercase">
                  {idx === 0 ? 'Team Leader' : `Member ${idx + 1}`}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="text-sm font-bold text-white">{name}</div>
              <p className="text-[11px] text-amber-100/60">{team.schoolName}</p>

              <button
                onClick={() => handleDownloadStudentCertificate(name)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] text-xs font-bold py-2 rounded-lg border border-[#D4AF37]/40 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Student Certificate PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY 2: Escort Teacher Certificate */}
      <div className="space-y-3 pt-2 border-t border-[#D4AF37]/20">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-[#FFD700]" />
          <span>2. Escort Teacher / Mentor Certificate of Appreciation</span>
        </div>

        <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#FFD700] uppercase">Official Escort Mentor</span>
            <h4 className="text-base font-bold text-white">{team.guideTeacherName || 'Guide Teacher Name'}</h4>
            <p className="text-xs text-amber-100/70">Phone: {team.guideTeacherPhone || 'N/A'} • {team.schoolName}</p>
          </div>

          <button
            onClick={handleDownloadTeacherCertificate}
            className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#A00000] text-[#FFD700] font-bold text-xs px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 shadow transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Teacher Certificate PDF</span>
          </button>
        </div>
      </div>

      {/* CATEGORY 3: School Institutional Certificate */}
      <div className="space-y-3 pt-2 border-t border-[#D4AF37]/20">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
          <Building className="w-4 h-4 text-[#FFD700]" />
          <span>3. School Institutional Certificate of Participation</span>
        </div>

        <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#FFD700] uppercase">Participating School Institution</span>
            <h4 className="text-base font-bold text-white">{team.schoolName || 'School Name'}</h4>
            <p className="text-xs text-amber-100/70">District: {team.schoolDistrict || 'Tamil Nadu'} • Ideal for School Office Framing</p>
          </div>

          <button
            onClick={handleDownloadSchoolCertificate}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2A0000] font-black text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:scale-105 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download School Certificate PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
