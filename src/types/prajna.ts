export interface TeamDetails {
  schoolName: string;
  schoolDistrict: string;
  schoolAddress?: string;
  teamName: string;
  teamCategory: 'Senior (Grades 11 & 12)';
  teamLeadName: string;
  teamLeadPhone: string;
  teamLeadEmail?: string;
  member2Name: string;
  member3Name: string;
  guideTeacherName: string;
  guideTeacherPhone: string;
  guideTeacherEmail?: string;
}

export interface ProblemDetails {
  problemTitle: string;
  problemLocation: string;
  district: string;
  responsibleDept: string;
  stakeholdersAffected: string;
  whyItMatters: string;
  photoCloseUp?: string; // Data URL or File path
  photoWideAngle?: string;
  photoTeamOnSite?: string;
  videoUrl?: string;
}

export interface SolutionFeasibility {
  solutionSummary: string;
  uniqueness: string;
  resourcesRequired: string;
  estimatedCost: string; // INR
  estimatedTime: string; // e.g., 2 Weeks, 1 Month
  expectedImpact: string;
  canBecomeStartup: 'Yes' | 'No' | 'Maybe';
  whoWouldPay: string[]; // Government, Public, Businesses, NGOs, CSR
  potentialBeneficiaries: string;
  incubationSupport: 'Yes' | 'No' | 'Need Info';
  iprFiling: 'Yes' | 'No' | 'Need Guidance';
}

export interface SDGSelection {
  selectedSdgs: number[]; // Array of SDG IDs (1 to 17)
}

export interface AIReadiness {
  usedAI: 'Yes' | 'No';
  aiTools: string[]; // ChatGPT, Gemini, Claude, Perplexity, Copilot, Canva AI, Others
  aiToolsOther?: string;
  aiPurposes: string[]; // Idea Validation, Research, Presentation, Writing, Image Generation, Coding, Others
  aiPurposesOther?: string;
  aiDeclaration: boolean;
}

export interface Attachments {
  pptFileName?: string;
  pdfReportFileName?: string;
  prototypeImagesFileName?: string;
  cadDrawingsFileName?: string;
  researchDocsFileName?: string;
}

export interface Declaration {
  photoPermission: boolean;
  truthfulInfo: boolean;
  originalIdea: boolean;
  promotionalUse: boolean;
  abideRules: boolean;
}

export type AuditStatus = 'PENDING_APPROVAL' | 'VERIFIED' | 'REVISION_REQUESTED' | 'REJECTED';

export interface OrganiserAudit {
  status: AuditStatus;
  remark?: string;
  auditDate?: string;
  duplicateWarning?: boolean;
  imageIssueWarning?: boolean;
}

export interface FullSubmission {
  id: string;
  submissionDate: string;
  team: TeamDetails;
  problem: ProblemDetails;
  solution: SolutionFeasibility;
  sdg: SDGSelection;
  ai: AIReadiness;
  attachments: Attachments;
  declaration: Declaration;
  auditInfo?: OrganiserAudit;
  evaluationScore?: {
    authenticityScore: number; // Max 25
    problemDepthScore: number; // Max 25
    solutionFeasibilityScore: number; // Max 25
    sdgImpactScore: number; // Max 15
    startupViabilityScore: number; // Max 10
    totalScore: number; // Max 100
    juryScored?: boolean;
  };
  publicVotes?: number;
  publicCommentsCount?: number;
}
