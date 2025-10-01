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
  activityTitle?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}
