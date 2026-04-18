export interface IRetirement {
  retirementId: string;
  activityLineDescription?: string;
  quantity?: number;
  frequency?: number;
  unitCost?: number;
  actualCost?: number;
  totalBudget?: number;
  documentName?: string;
  documentURL?: string;
  requestId?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}
export interface IRetirementView {
  retirementId: string;
  activityLineDescription?: string;
  quantity?: number;
  frequency?: number;
  unitCost?: number;
  actualCost?: number;
  totalBudget?: number;
  documentName?: string;
  documentURL?: string;
  requestId?: string;
  approval_A?: number;
  approval_B?: number;
  approval_C?: number;
  approval_D?: number;
  approvedBy_A?: string;
  approvedBy_B?: string;
  approvedBy_C?: string;
  approvedBy_D?: string;
  comment_A?: string;
  comment_B?: string;
  comment_C?: string;
  comment_D?: string;
  activityTitle?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}
