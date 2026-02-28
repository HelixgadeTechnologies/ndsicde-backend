export interface IRequest {
  requestId: string;
  staff?: string;
  outputId?: string;
  activityTitle?: string;
  activityBudgetCode?: number;
  activityLocation?: string;
  activityPurposeDescription?: string;
  activityStartDate?: Date;
  activityEndDate?: Date;
  activityLineDescription?: string;
  quantity?: number;
  frequency?: number;
  unitCost?: number;
  budgetCode?: number;
  total?: number;
  modeOfTransport?: string;
  driverName?: string;
  driversPhoneNumber?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  departureTime?: Date;
  route?: string;
  recipientPhoneNumber?: string;
  documentName?: string;
  documentURL?: string;
  approval_A?: number;
  approval_B?: number;
  approval_C?: number;
  approval_D?: number;
  approval_E?: number;
  approvedBy_A?: string;
  approvedBy_B?: string;
  approvedBy_C?: string;
  approvedBy_D?: string;
  approvedBy_E?: string;
  projectId?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface IRequestView {
  requestId: string;
  staff?: string;
  outputId?: string;
  outputStatement?: string;
  activityTitle?: string;
  activityBudgetCode?: number;
  activityLocation?: string;
  activityPurposeDescription?: string;
  activityStartDate?: Date;
  activityEndDate?: Date;
  activityLineDescription?: string;
  quantity?: number;
  frequency?: number;
  unitCost?: number;
  budgetCode?: number;
  total?: number;
  modeOfTransport?: string;
  driverName?: string;
  driversPhoneNumber?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  departureTime?: Date;
  route?: string;
  recipientPhoneNumber?: string;
  documentName?: string;
  documentURL?: string;
  approval_A?: number;
  approval_B?: number;
  approval_C?: number;
  approval_D?: number;
  approval_E?: number;
  approvedBy_A?: string;
  approvedBy_B?: string;
  approvedBy_C?: string;
  approvedBy_D?: string;
  approvedBy_E?: string;
  projectId?: string;
  projectName?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}

// Approval-related types and interfaces
export type ApprovalLevel = 'A' | 'B' | 'C' | 'D' | 'E';

export interface IApprovalRequest {
  requestId: string;
  approvalStatus: number; // 1 = Approved, 2 = Rejected
  approvedBy: string;
  comment?: string;
}

// Data Validation Dashboard interfaces
export interface IDataValidationStats {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  pendingFinancialRequests: number;
  approvedRetirements: number;
  totalRetirement: number;
  percentageFromLastMonth: number;
  approvalRate: number;
  rejectionRate: number;
}

export interface IDateRangeFilter {
  startDate?: string;
  endDate?: string;
}
