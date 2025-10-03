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
};
