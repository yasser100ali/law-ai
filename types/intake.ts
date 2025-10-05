export type AIScoreBreakdown = {
  legalMerit: number;
  evidenceQuality: number;
  damagesPotential: number;
  proceduralViability: number;
  likelihoodOfSuccess: number;
  explanation: string;
};

export type RecommendedFirm = {
  name: string;
  location: string;
  practiceAreas: string[];
  website: string;
  reasoning: string;
  source: string;
};

export type ApplicableLaw = {
  statute: string;
  summary: string;
  relevance: string;
};

export type IntakeRecord = {
  id: string;
  submittedAt: string;
  shareWithMarketplace: boolean;
  form: {
    fullName: string;
    email: string;
    phone: string;
    jurisdiction: string;
    matterType: string;
    summary: string;
    goals: string;
    urgency: string;
  };
  // AI Assessment
  aiSummary?: string;
  aiScore?: number;
  aiScoreBreakdown?: AIScoreBreakdown;
  aiReasoning?: string;
  aiWarnings?: string[];
  recommendedFirms?: RecommendedFirm[];
  applicableLaws?: ApplicableLaw[];
};
