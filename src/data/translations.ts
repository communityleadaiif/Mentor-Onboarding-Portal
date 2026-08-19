export type Language = 'en' | 'ta';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header & Hero
    sainikTitle: 'SAINIK SCHOOL AMARAVATHINAGAR',
    prajnaHeader: 'PRAJNA 2026',
    ideathonSubtitle: 'Ideathon: Community Innovation Challenge',
    themeQuote: 'Observe. Analyze. Innovate.',
    coreConceptTitle: "The Core Concept: Don't imagine a problem. Find one.",
    coreConceptDesc: "Rather than solving template statements, uncover a real issue in your local surroundings. Identify which government department owns the problem, map affected stakeholders, estimate costs, and propose actionable solutions.",
    submitBtn: 'Submit Your Innovation',
    viewRulesBtn: 'View 3-Photo Mandate & Rules',
    regCloses: 'Registration Closes Sep 3, 2026',

    // Nav
    navOverview: 'Overview & Rules',
    navSubmit: 'Submit Innovation Form',
    navScorecard: 'Evaluation Scorecard',
    navGallery: 'Community & Alumni Gallery',
    navMap: 'Interactive TN Map',
    navJury: 'Jury Panel',
    navFAQ: 'FAQ & Support',

    // Marquee
    marqueeTitle: 'Participating Schools Across Tamil Nadu',

    // Submission Form
    submissionFormTitle: 'PRAJNA 2026 Innovation Submission Portal',
    sec1Title: 'Section 1: School & Team Registration',
    sec1Desc: 'School identification & student team details (Senior Category: Grades 11 & 12).',
    schoolName: 'School Name',
    district: 'District',
    schoolDistrict: 'School District',
    teamName: 'Innovation Team Name',
    teamCategory: 'Team Category',
    teamLead: 'Team Leader Name',
    teamLeadName: 'Student Team Lead Full Name',
    teamLeadPhone: 'Team Lead Phone Number',
    member2: 'Member 2 Name',
    member2Name: '2nd Student Member Name',
    member3: 'Member 3 Name',
    member3Name: '3rd Student Member Name',
    guideTeacher: 'Guide Teacher Name',
    guideTeacherName: 'Guide / Escort Teacher Name',
    guideTeacherPhone: 'Guide Teacher Phone',

    sec2Title: 'Section 2: Local Problem Statement & Ownership',
    problemTitle: 'Problem Title',
    problemLoc: 'Exact Location / Village / City',
    problemLocation: 'Exact Location / Village / Campus',
    responsibleDept: 'Which Government Department / Body Owns This Problem?',
    stakeholders: 'Who are the affected Stakeholders?',
    whyMatters: 'Why does this problem matter?',
    whyItMatters: 'Why does this problem matter? (Root Cause & Urgency)',

    sec3Title: 'Authenticity Evidence: 3 Mandatory Photos',
    sec3Desc: 'Capture photos directly on location to verify physical observation and team authenticity.',

    sec4Title: 'Section 4: Proposed Solution & Technical Feasibility',
    solSummary: 'Proposed Solution Summary',
    solutionSummary: 'Proposed Solution Summary',
    uniqueness: '1. What makes your solution unique?',
    resourcesReq: '2. What resources are required?',
    resources: '2. What resources are required?',
    estCost: '3. Estimated Cost of Implementation (₹)',
    estimatedCost: '3. Estimated Cost of Implementation (₹)',
    estTime: '4. Estimated Time Required',
    estimatedTime: '4. Estimated Time Required',
    expImpact: '5. Expected Impact',

    sec5Title: 'Section 5: Startup Potential & Incubation Readiness',
    canBecomeStartup: '6. Can this become a Startup?',
    whoWouldPay: '7. Who would pay for this solution?',
    beneficiaries: '8. Potential Beneficiaries',
    incubationSupp: '9. Would you like incubation support?',
    iprFiling: '10. File an IPR (Patent / Copyright)?',

    sec6Title: 'UN Sustainable Development Goals (SDG 1–17)',
    sec7Title: 'AI Readiness & Transparency Disclosure',
    sec8Title: 'Section 8: Project Attachments (Optional)',
    sec9Title: 'Section 9: Participant Declaration Pledge',

    saveDraft: 'Save Progress Draft',
    submitDossier: 'Submit PRAJNA 2026 Dossier & Generate Scorecard'
  },

  ta: {
    // Header & Hero
    sainikTitle: 'சைனிக் பள்ளி அமராவதிநகர்',
    prajnaHeader: 'பிரக்ஞா 2026',
    ideathonSubtitle: 'ஐடியாத்தான்: சமூகப் புத்தாக்கச் சவால்',
    themeQuote: 'உற்றுநோக்கு. பகுப்பாய்வு செய். கண்டுபிடி.',
    coreConceptTitle: 'முதன்மைத் தத்துவம்: கற்பனைப் பிரச்சினையை அல்ல, நிஜப் பிரச்சினையைக் கண்டுபிடி.',
    coreConceptDesc: 'மாதிரிப் பிரச்சினைகளைத் தீர்ப்பதற்குப் பதிலாக, உங்கள் உள்ளூர் கிராமம் அல்லது நகரத்தில் உள்ள உண்மையான பிரச்சினையைக் கண்டறியுங்கள். எந்த அரசுத் துறை பொறுப்பு, பாதிப்படைபவர்கள் யார், செலவு எவ்வளவு என்பதை ஆராய்ந்து தீர்வு கூறுங்கள்.',
    submitBtn: 'உங்கள் திட்டத்தைச் சமர்ப்பிக்கவும்',
    viewRulesBtn: '3 புகைப்பட விதிமுறைகளைக் காண்க',
    regCloses: 'பதிவு முடிவு: செப்டம்பர் 3, 2026',

    // Nav
    navOverview: 'விதிமுறைகள்',
    navSubmit: 'திட்டம் சமர்ப்பிப்பு',
    navScorecard: 'மதிப்பீட்டு அட்டவணை',
    navGallery: 'சமூகக் காட்சிப் கூடம்',
    navMap: 'தமிழக வரைபடம்',
    navJury: 'நடுவர் குழு',
    navFAQ: 'கேள்விகள் & உதவி',

    // Marquee
    marqueeTitle: 'பங்கேற்கும் தமிழ்நாடு பள்ளிகள்',

    // Submission Form
    submissionFormTitle: 'பிரக்ஞா 2026 புத்தாக்கச் சமர்ப்பிப்புப் படிவம்',
    sec1Title: 'பிரிவு 1: பள்ளி மற்றும் குழு பதிவு',
    sec1Desc: 'பள்ளி விவரங்கள் மற்றும் மாணவர் குழு விவரங்கள் (மேல்நிலை: 11 மற்றும் 12 ஆம் வகுப்புகள்).',
    schoolName: 'பள்ளியின் பெயர்',
    district: 'மாவட்டம்',
    schoolDistrict: 'பள்ளி மாவட்டம்',
    teamName: 'குழுவின் பெயர்',
    teamCategory: 'குழுப் பிரிவு',
    teamLead: 'குழுத் தலைவர் பெயர்',
    teamLeadName: 'மாணவர் குழுத் தலைவர் பெயர்',
    teamLeadPhone: 'குழுத் தலைவர் தொலைபேசி',
    member2: '2 ஆம் உறுப்பினர் பெயர்',
    member2Name: '2 ஆம் உறுப்பினர் பெயர்',
    member3: '3 ஆம் உறுப்பினர் பெயர்',
    member3Name: '3 ஆம் உறுப்பினர் பெயர்',
    guideTeacher: 'வழிகாட்டி ஆசிரியர் பெயர்',
    guideTeacherName: 'வழிகாட்டி ஆசிரியர் பெயர்',
    guideTeacherPhone: 'ஆசிரியர் தொலைபேசி எண்',

    sec2Title: 'பிரிவு 2: உள்ளூர் பிரச்சினை மற்றும் அரசுத் துறை',
    problemTitle: 'பிரச்சினையின் தலைப்பு',
    problemLoc: 'துல்லியமான இடம் / கிராமம் / நகரம்',
    problemLocation: 'துல்லியமான இடம் / கிராமம் / வளாகம்',
    responsibleDept: 'இப்பிரச்சினைக்குரிய அரசுத் துறை எது?',
    stakeholders: 'பாதிக்கப்படும் பொதுமக்கள் / பயனாளிகள் யார்?',
    whyMatters: 'இப்பிரச்சினையின் மூலக் காரணம் என்ன?',
    whyItMatters: 'இப்பிரச்சினையின் மூலக் காரணம் & முக்கியத்துவம் என்ன?',

    sec3Title: 'உண்மைத் தன்மை சான்று: 3 கட்டாயப் புகைப்படங்கள்',
    sec3Desc: 'உள்ளூர் இடத்திற்கே சென்று நேரடி புகைப்படங்கள் எடுத்து பதிவேற்றவும்.',

    sec4Title: 'பிரிவு 4: முன்மொழியப்பட்ட தீர்வும் சாத்தியக்கூறும்',
    solSummary: 'தீர்வின் சுருக்கம்',
    solutionSummary: 'முன்மொழியப்பட்ட தீர்வின் சுருக்கம்',
    uniqueness: '1. உங்கள் தீர்வின் தனித்துவம் என்ன?',
    resourcesReq: '2. தேவைப்படும் வளங்கள் / பொருட்கள் யாவை?',
    resources: '2. தேவைப்படும் வளங்கள் / பொருட்கள் யாவை?',
    estCost: '3. திட்டமிடப்பட்ட தோராயச் செலவு (₹)',
    estimatedCost: '3. திட்டமிடப்பட்ட தோராயச் செலவு (₹)',
    estTime: '4. தேவைப்படும் காலம்',
    estimatedTime: '4. தேவைப்படும் காலம்',
    expImpact: '5. எதிர்பார்க்கப்படும் நன்மைகள்',

    sec5Title: 'பிரிவு 5: தொழில்முனைவு மற்றும் காப்புரிமை வாய்ப்பு',
    canBecomeStartup: '6. இது ஒரு ஸ்டார்ட்அப் ஆக மாற முடியுமா?',
    whoWouldPay: '7. இத்தீர்வுக்கு யார் கட்டணம் செலுத்துவார்கள்?',
    beneficiaries: '8. நேரடிப் பயனாளிகள் யார்?',
    incubationSupp: '9. இன்குபேஷன் ஆதரவு தேவையா?',
    iprFiling: '10. காப்புரிமை (Patent) பெற விருப்பமா?',

    sec6Title: 'ஐ.நா. நிலையான வளர்ச்சி இலக்குகள் (SDG 1–17)',
    sec7Title: 'AI செயற்கை நுண்ணறிவு வெளிப்படைத்தன்மை',
    sec8Title: 'பிரிவு 8: கூடுதல் ஆவணங்கள் (விரும்பினால்)',
    sec9Title: 'பிரிவு 9: பங்கேற்பாளர் உறுதிமொழி',

    saveDraft: 'வரைவைச் சேமிக்கவும்',
    submitDossier: 'சமர்ப்பித்து மதிப்பீட்டு அட்டவணை பெறுக'
  }
};
