export interface IRetirement {
  retirementId: string;
  lineItem?: string;
  actualCostOfLineItem?: number;
  documentName?: string;
  documentURL?: string;
  requestId?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface IRetirementView {
  retirementId: string;
  lineItem?: string;
  actualCostOfLineItem?: number;
  documentName?: string;
  documentURL?: string;
  requestId?: string;
  requestActivityTitle?: string;
  requestStaff?: string;
  requestStatus?: string;
  retirementStatus?: string;
  createAt?: Date;
  updateAt?: Date;
}
