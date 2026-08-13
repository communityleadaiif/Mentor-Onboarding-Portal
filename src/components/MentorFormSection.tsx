import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Download, RotateCcw, Upload, Send } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';

const SECTORS = ['AgriTech', 'EdTech', 'HealthTech', 'FinTech', 'CleanTech / GreenTech', 'DeepTech / AI-ML', 'Manufacturing & Industry 4.0', 'Retail & E-commerce', 'Social Impact / NGO', 'Government & Policy', 'Logistics & Supply Chain', 'Media & Entertainment', 'SaaS / B2B Software', 'Cybersecurity', 'SpaceTech', 'FoodTech', 'Real Estate & PropTech', 'Travel & Hospitality', 'HR Tech', 'LegalTech', 'Other'];
const EXPERTISE = ['Product Development', 'Business Strategy', 'Marketing & Branding', 'Fundraising & Investor Relations', 'Legal & Compliance', 'Technology & Engineering', 'Operations & Scaling', 'Finance & Accounting', 'Sales & BD', 'Design & UX', 'Sustainability', 'Public Policy', 'International Expansion', 'Other'];
const CONTRIBUTE = ['1:1 Mentoring Sessions', 'Group Workshops', 'Jury / Evaluation Panels', 'Guest Lectures', 'Investor Connects', 'Advisory Board', 'Other'];
const EXPERIENCE_OPTIONS = ['< 2 years', '2–5 years', '5–10 years', '10–20 years', '20+ years'];
const MODE_OPTIONS = ['Online', 'In-Person', 'Hybrid'];
const ENGAGEMENT_OPTIONS = ['One-time', 'Short-term (1–3 months)', 'Long-term (6+ months)'];
const AVAILABILITY_OPTIONS = ['< 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'];

interface FormData {
  fullName: string; email: string; mobile: string; linkedin: string;
  designation: string; organization: string; location: string;
  experience: string; sector: string[]; expertise: string[];
  mentored: string; mode: string; engagement: string;
  contribute: string[]; availability: string; resume: File | null; consent: boolean;
}

const sanitize = (s: string) => s.replace(/[<>"'&]/g, '');

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-emerald-500/50 text-xs tracking-widest uppercase mb-2">{children}</label>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-white/5 border border-emerald-500/15 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-emerald-500/40 transition-colors" />
);
const Select = ({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-emerald-500/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/40 transition-colors appearance-none">
    <option value="" className="bg-[#0a1f0d]">{placeholder}</option>
    {options.map(o => <option key={o} value={o} className="bg-[#0a1f0d]">{o}</option>)}
  </select>
);
const MultiCheck = ({ options, selected, toggle }: { options: string[]; selected: string[]; toggle: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(o => {
      const a = selected.includes(o);
      return <button key={o} type="button" onClick={() => toggle(o)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${a ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-white/50 border-emerald-500/15 hover:border-emerald-500/40'}`}>{o}</button>;
    })}
  </div>
);

interface Props { initialEmail?: string; }

export default function MentorFormSection({ initialEmail = '' }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    fullName: '', email: initialEmail, mobile: '', linkedin: '', designation: '', organization: '', location: '',
    experience: '', sector: [], expertise: [], mentored: '', mode: '', engagement: '',
    contribute: [], availability: '', resume: null, consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [signed, setSigned] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/aiif-logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setLogoBase64(canvas.toDataURL('image/png'));
      }
    };
  }, []);

  // Sync initialEmail from HeroSection
  useEffect(() => {
    if (initialEmail) {
      setForm(p => ({ ...p, email: initialEmail }));
    }
  }, [initialEmail]);

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => setForm(p => ({ ...p, [k]: v })), []);
  const toggleArr = useCallback((k: 'sector' | 'expertise' | 'contribute', v: string) => {
    setForm(p => { const arr = p[k] as string[]; return { ...p, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] }; });
  }, []);

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = 'Required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
      if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Must be exactly 10 digits';
      if (form.linkedin && !/linkedin\.com/i.test(form.linkedin)) e.linkedin = 'Must contain linkedin.com';
      if (!form.designation.trim()) e.designation = 'Required';
      if (!form.organization.trim()) e.organization = 'Required';
      if (!form.location.trim()) e.location = 'Required';
    }
    if (s === 1) {
      if (!form.experience) e.experience = 'Required';
      if (!form.sector.length) e.sector = 'Select at least one';
      if (!form.expertise.length) e.expertise = 'Select at least one';
      if (!form.mentored) e.mentored = 'Required';
      if (!form.mode) e.mode = 'Required';
      if (!form.engagement) e.engagement = 'Required';
      if (!form.contribute.length) e.contribute = 'Select at least one';
      if (!form.availability) e.availability = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);
  const clearSig = () => { sigRef.current?.clear(); setSigned(false); };
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    set('mobile', digits);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!signed || !sigRef.current) { alert('Please sign the agreement first.'); return; }
    if (!form.consent) { alert('Please check the consent checkbox.'); return; }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const dateStr = String(now.getDate()).padStart(2, '0') + '_' + String(now.getMonth() + 1).padStart(2, '0') + '_' + now.getFullYear();
      const safeName = sanitize(form.fullName).replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Mentor';

      const doc = generatePDFObject();
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      let resumeContent = '';
      let resumeName = '';
      if (form.resume) {
        try {
          resumeContent = await readFileAsBase64(form.resume);
          resumeName = form.resume.name;
        } catch (e) {
          console.error('Error reading resume file', e);
        }
      }

      let signatureContent = '';
      let signatureName = '';
      try {
        const sigDataUrl = sigRef.current.getCanvas().toDataURL('image/png');
        signatureContent = sigDataUrl.split(',')[1];
        signatureName = `${safeName}_Signature_${dateStr}.png`;
      } catch (e) {
        console.error('Error reading signature canvas', e);
      }

      // Prepare payload as JSON
      const payload = {
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        linkedin: form.linkedin,
        designation: form.designation,
        organization: form.organization,
        location: form.location,
        experience: form.experience,
        sector: form.sector.join(', '),
        expertise: form.expertise.join(', '),
        mentored: form.mentored,
        mode: form.mode,
        engagement: form.engagement,
        contribute: form.contribute.join(', '),
        availability: form.availability,
        consent: form.consent,
        date: today,
        pdfContent: pdfBase64,
        fileName: `${safeName}_AIIF_Mentor_Form_${dateStr}.pdf`,
        resumeContent: resumeContent,
        resumeName: resumeName,
        signatureContent: signatureContent,
        signatureName: signatureName
      };

      console.log("PAYLOAD_DATA:", JSON.stringify(payload));

      // Live Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwv5u2uLu8WPIiheRM24_cUSXdDsmDrclrZrdSu5aiwh6hOla5HswW-ZBqdmUqcgJr1/exec';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      alert('Application submitted successfully to AIIF! Your data has been recorded in Google Sheets and the signed PDF has been uploaded.');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDFObject = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const W = 210, M = 18, cw = W - 2 * M;
    let y = 20;

    const addText = (text: string, size: number, opts?: { bold?: boolean; align?: 'center' | 'left' | 'right' }) => {
      doc.setFontSize(size); doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(sanitize(text), cw) as string[];
      const lh = size * 0.45;
      if (y + lines.length * lh > 280) { doc.addPage(); y = 20; }
      doc.text(lines, opts?.align === 'center' ? W / 2 : M, y, { align: opts?.align || 'left' });
      y += lines.length * lh + 2;
    };
    const gap = (g: number) => { y += g; if (y > 280) { doc.addPage(); y = 20; } };

    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', M, y, 60, 20);
        y += 24;
      } catch (e) { console.error('Logo add error', e); }
    }

    addText('MENTORSHIP AGREEMENT', 14, { bold: true, align: 'center' }); gap(4);
    addText('This Mentoring Agreement ("Agreement") is entered at Chennai and executed on ' + today + ' ("Effective Date") by and between:', 9); gap(2);
    addText('AJK INNOVATION INCUBATOR FOUNDATION (AIIF), a Company incorporated under Section 8 of the Indian Companies Act, having its registered office at AJK College of Arts and Science Campus, Navakkarai, Coimbatore - 641105, Tamil Nadu, represented by its Chief Executive Officer, Mr. Tarun Richard Ajeet (hereinafter referred to as "AIIF" which expression shall unless it be repugnant to the contrary shall include its affiliates, successors and permitted assigns).', 9); gap(2);
    addText('AND', 9, { align: 'center' }); gap(2);
    addText('Mr/Ms. ' + sanitize(form.fullName) + ', currently working at ' + sanitize(form.organization) + ' as ' + sanitize(form.designation) + ' and currently residing at ' + sanitize(form.location) + ' (the "Mentor", which term shall include successors and permitted assigns).', 9); gap(2);
    addText('AIIF and Mentor are hereinafter collectively referred to as the "Parties" and individually referred to as the "Party".', 9); gap(2);
    addText('WHEREAS, AIIF has been setup as a Section 8 Foundation with the mandate of building a thriving deep technology ("deeptech") and emerging technology ecosystem, bringing startups, corporates, governments, and academia together; to build an incubator that helps early-stage deeptech startups, to build an accelerator that helps startups with market access programs, and to build a global collaborative ecosystem on high technology;', 9); gap(2);
    addText('WHEREAS, Mr/Ms. ' + sanitize(form.fullName) + ' is an expert in ' + (form.expertise.length > 0 ? form.expertise.map(sanitize).join(', ') : '_____________________') + '. The Mentor has ' + (form.experience || 'several years') + ' of professional experience;', 9); gap(2);
    addText('WHEREAS, the Mentor has agreed to guide the startups of AIIF in the area of their expertise;', 9); gap(2);
    addText('WHEREAS, the Parties wish to set forth their mutual understanding with regard to the same vide this non-binding MoU.', 9); gap(4);

    const secs = [
      {
        t: '1. Purpose and Scope',
        b: '1.1. Mentor will participate in specific or general startup support programs (pre-incubation, incubation & acceleration) executed by AIIF.\n' +
           '1.2. In the respective knowledge area of the Mentor, provide guidance and advice to participants enrolled in the AIIF programs (the "Founders") through one or more of the following activities, in addition to being reasonably available to answer questions virtually, in person, or via email:\n' +
           '1.2.1. Mentor may prepare presentations on session topics to the startups during the Term and be present at agreed-upon sessions.\n' +
           '1.2.2. Mentor will provide meetings (one-on-one or group) with Founders scheduled by AIIF or Founders at lengths of 30 or 60 minutes, as mutually agreeable.\n' +
           '1.2.3. Providing one-on-one mentoring sessions with a total of ' + sanitize(form.availability || '[NUMBER OF HOURS]') + ' hours per month, focusing on guidance related to ' + (form.expertise.length > 0 ? form.expertise.map(sanitize).join(', ') : '[DOMAIN]') + '.\n' +
           '1.2.4. For clauses 1.2.1 & 1.2.2, AIIF will provide the list of startups, and the Mentor shall decide which startup(s) to mentor.\n' +
           '1.3. The Mentor shall provide services remotely or physically, as convenient.\n' +
           '1.4. Provide individual evaluations of the Founders participating in each session attended by Mentor.\n' +
           '1.5. Provide feedback on the AIIF programs to the management team of AIIF.'
      },
      {
        t: '2. Confidentiality',
        b: '2.1. Definition: "Confidential Information" means any non-public information relating to the business, products, or research of AIIF, any Founder, or Portfolio Company, including technical data, trade secrets, and business plans.\n' +
           '2.2. Nonuse and Nondisclosure: Mentor will hold Confidential Information in the strictest confidence and will not use it for any purpose other than participation in the program, nor disclose it to any third party without prior written consent.\n' +
           '2.3. Each Disclosing Party is an express third-party beneficiary, and these obligations shall continue after the termination of this Agreement.'
      },
      {
        t: '3. Term and Termination',
        b: '3.1. Term: This Agreement shall remain in effect for a period of 2 (Two) Years from the Effective Date, with the option of renewal.\n' +
           '3.2. Termination: Either Party may terminate this Agreement for no reason upon providing 30 (thirty) days written notice. Either Party may terminate immediately for cause (material breach, insolvency, or unlawful practices).'
      },
      {
        t: '4. Compensation',
        b: '4.1. The work performed by the Mentor shall be performed pro-bono to AIIF and/or the startup, or on mutually agreed terms directly between the startup and the Mentor.\n' +
           '4.2. The Mentor acknowledges that AIIF will not be compensating the Mentor.\n' +
           '4.3. Any billable service rendered by the Mentor to a Startup shall be directly engaged and compensated by the Startup. AIIF shall have no liability or obligation in such engagements.'
      },
      {
        t: '5. Liability',
        b: '5.1. Neither party shall be liable to the other for any special, indirect, incidental, or consequential damages arising from this agreement, including loss of profits or third-party claims.'
      },
      {
        t: '6. Independent Contractor',
        b: '6.1. Mentor performs services as an independent contractor; nothing in this Agreement constitutes an employment, agency, or representative relationship.'
      },
      {
        t: '7. Dispute Resolution and Jurisdiction',
        b: '7.1. Parties agree to first mediate disputes in good faith. If mediation fails, disputes shall be settled by Arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996, held in Chennai (or mutually agreed location) in English.\n' +
           '7.2. This Agreement is governed by the laws of India, with exclusive jurisdiction in the courts of Chennai/Coimbatore.'
      },
      {
        t: '8. Promotional Materials',
        b: "8.1. AIIF may use Mentor's name, likeness, and quotes in promotional materials regarding AIIF programs and vice-versa."
      }
    ];
    secs.forEach(s => { gap(2); addText(s.t, 10, { bold: true }); addText(s.b, 9); });

    gap(4);
    addText('The Parties have read and understood all terms herein and voluntarily sign this Agreement on the date stated above.', 9); gap(4);

    addText('For AJK INNOVATION INCUBATOR FOUNDATION (AIIF)', 9, { bold: true }); gap(8);
    addText('____________________________', 9);
    addText('Tarun Richard Ajeet, Chief Executive Officer', 8); gap(8);
    addText('For ' + sanitize(form.fullName) + ' (Mentor)', 9, { bold: true }); gap(2);

    if (y + 25 > 280) { doc.addPage(); y = 20; }

    let sigImage: string;
    try { sigImage = sigRef.current!.getCanvas().toDataURL('image/png'); }
    catch { sigImage = ''; }

    if (sigImage) {
      try { doc.addImage(sigImage, 'PNG', M, y, 50, 20); } catch { addText('[Signature on file]', 9); }
    } else {
      addText('[Signature on file]', 9);
    }
    y += 22;
    addText(sanitize(form.fullName), 8);
    addText('Date: ' + today, 8);
    return doc;
  };

  const downloadPDF = (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      if (!signed || !sigRef.current) { alert('Please sign the agreement first.'); return; }
      if (!form.consent) { alert('Please check the consent checkbox.'); return; }

      const doc = generatePDFObject();

      const now = new Date();
      const dateStr = String(now.getDate()).padStart(2, '0') + '_' + String(now.getMonth() + 1).padStart(2, '0') + '_' + now.getFullYear();
      const safeName = sanitize(form.fullName).replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Mentor';
      const fileName = `${safeName}_Mentor_Onboarding_Form_AIIF_${dateStr}.pdf`.replace(/\s+/g, '_');

      doc.save(fileName);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Error generating PDF: ' + (err instanceof Error ? err.message : String(err)));
    }
  };


  const Err = ({ k }: { k: string }) => errors[k] ? <p className="text-red-400 text-xs mt-1">{errors[k]}</p> : null;
  const steps = ['Personal Info', 'Professional Profile', 'Agreement & Signature'];

  return (
    <section id="mentor-form" className="py-28 md:py-40 px-6 overflow-hidden relative" style={{ background: '#050f08' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.04)_0%,_transparent_60%)] pointer-events-none" />
      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-emerald-500/50 text-sm tracking-widest uppercase mb-4">Join Our Network</p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Become a <em className="italic text-emerald-400/60">Mentor</em></h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">Thank you for stepping up to shape the next generation. Fill in your details below.</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i <= step ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i <= step ? 'text-emerald-400' : 'text-white/30'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 md:w-16 h-px ${i < step ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="liquid-glass rounded-3xl p-6 md:p-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label>Full Name *</Label><Input value={form.fullName} onChange={e => set('fullName', sanitize(e.target.value))} placeholder="John Doe" /><Err k="fullName" /></div>
                  <div><Label>Email ID *</Label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" /><Err k="email" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label>Mobile (WhatsApp) *</Label><Input type="tel" inputMode="numeric" value={form.mobile} onChange={e => handleMobileChange(e.target.value)} placeholder="9876543210" maxLength={10} /><Err k="mobile" /></div>
                  <div><Label>LinkedIn Profile URL</Label><Input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /><Err k="linkedin" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label>Current Designation *</Label><Input value={form.designation} onChange={e => set('designation', sanitize(e.target.value))} placeholder="CTO / Professor / ..." /><Err k="designation" /></div>
                  <div><Label>Organization *</Label><Input value={form.organization} onChange={e => set('organization', sanitize(e.target.value))} placeholder="Acme Inc." /><Err k="organization" /></div>
                </div>
                <div><Label>Location (City, State) *</Label><Input value={form.location} onChange={e => set('location', sanitize(e.target.value))} placeholder="Chennai, Tamil Nadu" /><Err k="location" /></div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label>Years of Experience *</Label><Select value={form.experience} onChange={v => set('experience', v)} options={EXPERIENCE_OPTIONS} placeholder="Select..." /><Err k="experience" /></div>
                  <div><Label>Availability / month *</Label><Select value={form.availability} onChange={v => set('availability', v)} options={AVAILABILITY_OPTIONS} placeholder="Select..." /><Err k="availability" /></div>
                </div>
                <div><Label>Industry / Sector *</Label><MultiCheck options={SECTORS} selected={form.sector} toggle={v => toggleArr('sector', v)} /><Err k="sector" /></div>
                <div><Label>Areas of Expertise *</Label><MultiCheck options={EXPERTISE} selected={form.expertise} toggle={v => toggleArr('expertise', v)} /><Err k="expertise" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div><Label>Previously Mentored? *</Label><Select value={form.mentored} onChange={v => set('mentored', v)} options={['Yes', 'No']} placeholder="Select..." /><Err k="mentored" /></div>
                  <div><Label>Mode *</Label><Select value={form.mode} onChange={v => set('mode', v)} options={MODE_OPTIONS} placeholder="Select..." /><Err k="mode" /></div>
                  <div><Label>Engagement *</Label><Select value={form.engagement} onChange={v => set('engagement', v)} options={ENGAGEMENT_OPTIONS} placeholder="Select..." /><Err k="engagement" /></div>
                </div>
                <div><Label>Areas to contribute at AIIF *</Label><MultiCheck options={CONTRIBUTE} selected={form.contribute} toggle={v => toggleArr('contribute', v)} /><Err k="contribute" /></div>
                <div><Label>Upload Resume (PDF/DOC)</Label>
                  <label className="flex items-center gap-3 cursor-pointer bg-white/5 border border-emerald-500/15 rounded-xl px-4 py-3 hover:border-emerald-500/40 transition-colors">
                    <Upload size={16} className="text-emerald-500/40" />
                    <span className="text-white/40 text-sm">{form.resume ? form.resume.name : 'Choose file...'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => set('resume', e.target.files?.[0] || null)} />
                  </label>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="grid gap-6">
                <div className="bg-white/5 border border-emerald-500/10 rounded-2xl p-5 md:p-8 max-h-[420px] overflow-y-auto text-white/60 text-sm leading-relaxed space-y-4">
                  <h3 className="text-white text-lg font-bold text-center tracking-wide">MENTORSHIP AGREEMENT</h3>
                  <p>This Mentoring Agreement (“Agreement”) is entered at <strong className="text-emerald-400">Chennai</strong> and executed on <strong className="text-emerald-400">{today}</strong> (“Effective Date”) by and between:</p>
                  
                  <p><strong className="text-white">AJK INNOVATION INCUBATOR FOUNDATION (AIIF)</strong>, a Company incorporated under Section 8 of the Indian Companies Act, having its registered office at AJK College of Arts and Science Campus, Navakkarai, Coimbatore - 641105, Tamil Nadu, represented by its Chief Executive Officer, Mr. Tarun Richard Ajeet (hereinafter referred to as “AIIF” which expression shall unless it be repugnant to the contrary shall include its affiliates, successors and permitted assigns).</p>
                  
                  <p className="text-center font-bold text-white">AND</p>
                  
                  <p><strong className="text-emerald-400">Mr/Ms. {form.fullName || '_____________________'}</strong>, currently working at <strong className="text-emerald-400">{form.organization || '_______________________________________'}</strong> as <strong className="text-emerald-400">{form.designation || '______________________________'}</strong> and currently residing at <strong className="text-emerald-400">{form.location || '_______________________________'}</strong> (the “Mentor”, which term shall include successors and permitted assigns).</p>
                  
                  <p>AIIF and Mentor are hereinafter collectively referred to as the “Parties” and individually referred to as the “Party”.</p>
                  
                  <p><strong>WHEREAS</strong>, AIIF has been setup as a Section 8 Foundation with the mandate of building a thriving deep technology (“deeptech”) and emerging technology ecosystem, bringing startups, corporates, governments, and academia together; to build an incubator that helps early-stage deeptech startups, to build an accelerator that helps startups with market access programs, and to build a global collaborative ecosystem on high technology;</p>
                  
                  <p><strong>WHEREAS</strong>, <strong className="text-emerald-400">Mr/Ms. {form.fullName || '_____________________'}</strong> is an expert in <strong className="text-emerald-400">{form.expertise.join(', ') || '_____________________'}</strong>. The Mentor has <strong className="text-emerald-400">{form.experience || 'several years'}</strong> of professional experience;</p>
                  
                  <p><strong>WHEREAS</strong>, the Mentor has agreed to guide the startups of AIIF in the area of their expertise;</p>
                  
                  <p><strong>WHEREAS</strong>, the Parties wish to set forth their mutual understanding with regard to the same vide this non-binding MoU.</p>
                  
                  <h4 className="text-white font-bold pt-2">1. Purpose and Scope</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>1.1.</strong> Mentor will participate in specific or general startup support programs (pre-incubation, incubation & acceleration) executed by AIIF.</li>
                    <li><strong>1.2.</strong> In the respective knowledge area of the Mentor, provide guidance and advice to participants enrolled in the AIIF programs (the “Founders”) through one or more of the following activities, in addition to being reasonably available to answer questions virtually, in person, or via email:
                      <ul className="list-none space-y-1 pl-4 mt-1">
                        <li><strong>1.2.1.</strong> Mentor may prepare presentations on session topics to the startups during the Term and be present at agreed-upon sessions.</li>
                        <li><strong>1.2.2.</strong> Mentor will provide meetings (one-on-one or group) with Founders scheduled by AIIF or Founders at lengths of 30 or 60 minutes, as mutually agreeable.</li>
                        <li><strong>1.2.3.</strong> Providing one-on-one mentoring sessions with a total of <strong className="text-emerald-400">{form.availability || '[NUMBER OF HOURS]'}</strong> hours per month, focusing on guidance related to <strong className="text-emerald-400">{form.expertise.join(', ') || '[DOMAIN]'}</strong>.</li>
                        <li><strong>1.2.4.</strong> For clauses 1.2.1 & 1.2.2, AIIF will provide the list of startups, and the Mentor shall decide which startup(s) to mentor.</li>
                      </ul>
                    </li>
                    <li><strong>1.3.</strong> The Mentor shall provide services remotely or physically, as convenient.</li>
                    <li><strong>1.4.</strong> Provide individual evaluations of the Founders participating in each session attended by Mentor.</li>
                    <li><strong>1.5.</strong> Provide feedback on the AIIF programs to the management team of AIIF.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">2. Confidentiality</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>2.1.</strong> Definition: “Confidential Information” means any non-public information relating to the business, products, or research of AIIF, any Founder, or Portfolio Company, including technical data, trade secrets, and business plans.</li>
                    <li><strong>2.2.</strong> Nonuse and Nondisclosure: Mentor will hold Confidential Information in the strictest confidence and will not use it for any purpose other than participation in the program, nor disclose it to any third party without prior written consent.</li>
                    <li><strong>2.3.</strong> Each Disclosing Party is an express third-party beneficiary, and these obligations shall continue after the termination of this Agreement.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">3. Term and Termination</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>3.1.</strong> Term: This Agreement shall remain in effect for a period of 2 (Two) Years from the Effective Date, with the option of renewal.</li>
                    <li><strong>3.2.</strong> Termination: Either Party may terminate this Agreement for no reason upon providing 30 (thirty) days written notice. Either Party may terminate immediately for cause (material breach, insolvency, or unlawful practices).</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">4. Compensation</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>4.1.</strong> The work performed by the Mentor shall be performed pro-bono to AIIF and/or the startup, or on mutually agreed terms directly between the startup and the Mentor.</li>
                    <li><strong>4.2.</strong> The Mentor acknowledges that AIIF will not be compensating the Mentor.</li>
                    <li><strong>4.3.</strong> Any billable service rendered by the Mentor to a Startup shall be directly engaged and compensated by the Startup. AIIF shall have no liability or obligation in such engagements.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">5. Liability</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>5.1.</strong> Neither party shall be liable to the other for any special, indirect, incidental, or consequential damages arising from this agreement, including loss of profits or third-party claims.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">6. Independent Contractor</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>6.1.</strong> Mentor performs services as an independent contractor; nothing in this Agreement constitutes an employment, agency, or representative relationship.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">7. Dispute Resolution and Jurisdiction</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>7.1.</strong> Parties agree to first mediate disputes in good faith. If mediation fails, disputes shall be settled by Arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996, held in Chennai (or mutually agreed location) in English.</li>
                    <li><strong>7.2.</strong> This Agreement is governed by the laws of India, with exclusive jurisdiction in the courts of Chennai/Coimbatore.</li>
                  </ul>
                  
                  <h4 className="text-white font-bold pt-2">8. Promotional Materials</h4>
                  <ul className="list-none space-y-2 pl-4">
                    <li><strong>8.1.</strong> AIIF may use Mentor's name, likeness, and quotes in promotional materials regarding AIIF programs and vice-versa.</li>
                  </ul>
                </div>
                <div>
                  <Label>Your Signature</Label>
                  <div className="bg-white rounded-2xl p-1 relative">
                    <SignatureCanvas ref={r => { sigRef.current = r; }} penColor="black" canvasProps={{ width: 600, height: 160, style: { width: '100%', height: '160px', borderRadius: '12px', cursor: 'crosshair' } }} onEnd={() => setSigned(true)} />
                    {!signed && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-black/20 text-sm">Sign here with your mouse or finger</span></div>}
                  </div>
                  <button type="button" onClick={clearSig} className="flex items-center gap-1 text-emerald-500/40 text-xs mt-2 hover:text-emerald-400 transition-colors"><RotateCcw size={12} /> Clear</button>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} className="mt-1 w-4 h-4 rounded accent-emerald-500" />
                  <span className="text-white/50 text-sm leading-relaxed">I have read and understood all terms and voluntarily sign this Agreement. I consent to AIIF collecting my data for the mentorship program.</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-emerald-500/10">
            {step > 0 ? <button type="button" onClick={prev} className="flex items-center gap-2 text-white/50 text-sm hover:text-emerald-400 transition-colors"><ChevronLeft size={16} /> Back</button> : <div />}
            {step < 2 ? (
              <button type="button" onClick={next} className="liquid-glass rounded-full px-8 py-3 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors flex items-center gap-2">Continue <ChevronRight size={16} /></button>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-500 rounded-full px-6 py-3 text-white text-xs font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <span className="animate-pulse">Sending...</span> : <><Send size={14} /> Submit Application</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
