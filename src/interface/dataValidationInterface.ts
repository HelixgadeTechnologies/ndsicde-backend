export interface IProjectValidation {
  projectValidationId?: string;
  submissionName?: string;
  projectId?: string | null;
  submittedBy?: string | null;
  status?: string;
  type?: string | null;
  createAt: Date;
  updateAt: Date;
}

export interface IProjectValidationView {
  projectValidationId: string;
  submissionName: string;
  submissionType?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  submittedById?: string | null;
  submittedByName?: string | null;
  status: string;
  createAt: Date;
  updateAt: Date;
}

export interface IPValidationSummary {
  pendingReview: number;
  approved: number;
  rejected: number;
}
