export interface IOtherPersonnel {
  otherPersonnelId?: string;
  requestId?: string;
  name?: string | null;
  company?: string | null;
  phoneNumber?: string | null;
}

export interface IRequest {
  requestId: string;
  staff?: string;
  outputId?: string;
  activityTitle?: string;
  activityBudgetCode?: string;
  activityLocation?: string;
  activityPurposeDescription?: string;
  activityStartDate?: Date;
  activityEndDate?: Date;
  budgetCode?: string;
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
  projectId?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
  createdBy?: string;
  lineItems?: Array<ILineItem>;
  otherPersonnel?: Array<IOtherPersonnel>;

  // Journey management fields
  isJourneyManagementRequired?: boolean;
  purposeOfTrip?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  departureDate?: Date;
  departureLocationAndTime?: string;
  destination?: string;
  contactPersonPhoneNumberAtDestination?: string;
  flightDepartureState?: string;
  flightDepartureTime?: string;
  flightArrivalState?: string;
  flightArrivalTime?: string;
  hotelAccommodationName?: string;
  hotelAddress?: string;
  returnDate?: Date;
  returnTime?: string;
  airportDropoffOfficerName?: string;
  airportPickupOfficerName?: string;
  budgetName?: string;

  // Approval fields — ignore when creating a request
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
  comment_A?: string;
  comment_B?: string;
  comment_C?: string;
  comment_D?: string;
  comment_E?: string;
  approvalStep?: number;
}

export interface ILineItem {
  lineItemId?: string | null;
  requestId?: string | null;
  description?: string | null;
  quantity?: number | null;
  frequency?: number | null;
  unitCost?: number | null;
  totalBudget?: number | null;
  totalSpent?: number | null;
  variance?: number | null;
  activityId?: string | null;
  receiptURL?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}
export interface IRequestView {
  requestId: string;
  staff?: string;
  outputId?: string;
  outputStatement?: string;
  activityTitle?: string;
  activityBudgetCode?: string;
  activityLocation?: string;
  activityPurposeDescription?: string;
  activityStartDate?: Date;
  activityEndDate?: Date;
  activityLineDescription?: string;
  quantity?: number;
  frequency?: number;
  unitCost?: number;
  budgetCode?: string;
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
  comment_A?: string;
  comment_B?: string;
  comment_C?: string;
  comment_D?: string;
  comment_E?: string;
  lineItems?: Array<ILineItem>;
  otherPersonnel?: Array<IOtherPersonnel>;
  projectId?: string;
  projectName?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
  createdBy?: string;

  // Journey management fields
  isJourneyManagementRequired?: boolean;
  purposeOfTrip?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  departureDate?: Date;
  departureLocationAndTime?: string;
  destination?: string;
  contactPersonPhoneNumberAtDestination?: string;
  flightDepartureState?: string;
  flightDepartureTime?: string;
  flightArrivalState?: string;
  flightArrivalTime?: string;
  hotelAccommodationName?: string;
  hotelAddress?: string;
  returnDate?: Date;
  returnTime?: string;
  airportDropoffOfficerName?: string;
  airportPickupOfficerName?: string;
  budgetName?: string;
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
