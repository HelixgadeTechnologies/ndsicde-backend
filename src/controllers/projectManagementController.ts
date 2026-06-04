import {
  createOrUpdateActivity,
  createOrUpdateActivityReport,
  createOrUpdateImpact,
  createOrUpdateIndicator,
  createOrUpdateLogicalFramework,
  createOrUpdateOutput,
  createOrUpdatePartner,
  createOrUpdateTeamMember,
  deleteActivity,
  deleteActivityReport,
  deleteImpact,
  deleteIndicator,
  deleteIndicatorReport,
  deleteLogicalFramework,
  deleteOutcome,
  deleteOutput,
  deletePartner,
  deleteProject,
  deleteTeamMember,
  getActivityById,
  getActivityReportById,
  getAllActivities,
  getAllActivityReports,
  getAllImpact,
  getAllImpactIndicatorsByResultIdView,
  getAllIndicatorReportByResultId,
  getAllLogicalFrameworks,
  getAllOutcomesView,
  getAllOutputs,
  getAllPartners,
  getAllProjects,
  getAllTeamMember,
  getIndicatorByIdView,
  getIndicatorReportById,
  getLogicalFrameworkById,
  getOutcomeViewById,
  getOutputById,
  getProjectById,
  getProjectsStatus,
  getResultType,
  getPartnerByEmail,
  getImpactByProjectIdView,
  getOutcomeViewByProjectId,
  getOutputByProjectId,
  getActivityByProjectId,
  getLogicalFrameworkByProjectId,
  getTeamMemberByProjectId,
  getPartnerByProjectId,
  getIndicatorByResultTypeId,
  saveIndicatorReport,
  saveOutcome,
  saveProject,
} from "../service/projectManagementService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import {
  IActivity,
  IActivityReport,
  IIndicator,
  IIndicatorReport,
  ILogicalFramework,
  IOutcome,
  IOutput,
} from "../interface/projectManagementInterface";
import {
  getOrgKpiDashboardData,
  getProjectActivityDashboardData,
  getResultDashboardData,
  getResultDashboardFullData,
  getResultDashboardKpiSectionData,
} from "../service/kpiDashboardService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const createOrUpdateProject = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const project = await saveProject(data, isCreate);
  const message = isCreate ? "Project created successfully" : "Project updated successfully";
  res.status(isCreate ? 201 : 200).json(successResponse(message, project));
});

export const fetchAllProjects = asyncHandler(async (_req, res) => {
  const projects = await getAllProjects();
  res.status(200).json(successResponse("Projects retrieved", projects));
});

export const fetchProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await getProjectById(id);
  if (!project) {
    return res.status(404).json(notFoundResponse("Project not found", null));
  }
  res.status(200).json(successResponse("Project found", project));
});

export const removeProject = asyncHandler(async (req, res) => {
  const { projectId } = req.body;
  const deleted = await deleteProject(projectId);
  res.status(200).json(successResponse("Project deleted successfully", deleted));
});

export const fetchProjectStatusStats = asyncHandler(async (_req, res) => {
  const stats = await getProjectsStatus();
  res.status(200).json(successResponse("Project status summary", stats));
});

export const createOrUpdateTeamMemberController = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await createOrUpdateTeamMember(data, isCreate);
  res.status(200).json(successResponse(isCreate ? "Team member created successfully" : "Team member updated successfully", result));
});

export const getAllTeamMemberController = asyncHandler(async (_req, res) => {
  const result = await getAllTeamMember();
  res.status(200).json(successResponse("Team Members", result));
});

export const deleteTeamMemberController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTeamMember(id);
  res.status(200).json(successResponse("Team member deleted successfully", null));
});

export const createOrUpdatePartnerController = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await createOrUpdatePartner(data, isCreate);
  res.status(200).json(successResponse(isCreate ? "Partner created successfully" : "Partner updated successfully", result));
});

export const getAllPartnersController = asyncHandler(async (_req, res) => {
  const result = await getAllPartners();
  res.status(200).json(successResponse("Partners", result));
});

export const deletePartnerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deletePartner(id);
  res.status(200).json(successResponse("Partner deleted successfully", null));
});

export const getPartnerByEmailController = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const partner = await getPartnerByEmail(email);
  if (!partner) {
    return res.status(404).json(notFoundResponse("Partner not found", null));
  }
  res.status(200).json(successResponse("Partner retrieved successfully", partner));
});

export const createOrUpdateImpactController = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await createOrUpdateImpact(data, isCreate);
  res.status(200).json(successResponse(isCreate ? "Impact created successfully" : "Impact updated successfully", result));
});

export const getAllImpactsController = asyncHandler(async (_req, res) => {
  const result = await getAllImpact();
  res.status(200).json(successResponse("Impacts retrieved successfully", result));
});

export const deleteImpactController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteImpact(id);
  res.status(200).json(successResponse("Impact deleted successfully", null));
});

export const createOrUpdateIndicatorController = asyncHandler(async (req, res) => {
  const { isCreate, data }: { isCreate: boolean; data: IIndicator } = req.body;
  const result = await createOrUpdateIndicator(data, isCreate);
  return res.status(isCreate ? 201 : 200).json(successResponse(isCreate ? "Indicator created successfully" : "Indicator updated successfully", result));
});

export const getAllIndicatorsByResult = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const indicators = await getAllImpactIndicatorsByResultIdView(resultId);
  if (!indicators || indicators.length === 0) {
    return res.status(404).json(notFoundResponse("Indicators not found", null));
  }
  return res.status(200).json(successResponse("Indicators retrieved", indicators));
});

export const getIndicatorById = asyncHandler(async (req, res) => {
  const { indicatorId } = req.params;
  const indicator = await getIndicatorByIdView(indicatorId);
  if (!indicator) {
    return res.status(404).json(notFoundResponse("Indicator not found", null));
  }
  return res.status(200).json(successResponse("Indicator retrieved", indicator));
});

export const getAllResultType = asyncHandler(async (_req, res) => {
  const results = await getResultType();
  if (results.length < 1) {
    return res.status(404).json(notFoundResponse("Result type not found", null));
  }
  return res.status(200).json(successResponse("Result type retrieved", results));
});

export const deleteIndicatorController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteIndicator(id);
  res.status(200).json(successResponse("Indicator deleted successfully", null));
});

export const createOrUpdateIndicatorReport = asyncHandler(async (req, res) => {
  const payload: IIndicatorReport = req.body.payload;
  const isCreate: boolean = req.body.isCreate;
  const result = await saveIndicatorReport(payload, isCreate);
  res.status(200).json(successResponse(isCreate ? "Indicator created successfully" : "Indicator updated successfully", result));
});

export const getIndicatorReportsByResult = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const results = await getAllIndicatorReportByResultId(resultId);
  if (!results || results.length === 0) {
    return res.status(404).json(notFoundResponse("indicator report not found", null));
  }
  res.status(200).json(successResponse("indicator report fetched successfully", results));
});

export const getImpactIndicatorReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getIndicatorReportById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("indicator report not found", null));
  }
  res.status(200).json(successResponse("indicator report fetched successfully", result));
});

export const removeIndicatorReport = asyncHandler(async (req, res) => {
  const { id } = req.body;
  await deleteIndicatorReport(id);
  res.status(200).json(successResponse("indicator report deleted successfully", null));
});

export const saveOutcomeController = asyncHandler(async (req, res) => {
  const { isCreate, data }: { isCreate: boolean; data: IOutcome } = req.body;
  const result = await saveOutcome(data, isCreate);
  res.status(200).json(successResponse(isCreate ? "Outcome created successfully" : "Outcome updated successfully", result));
});

export const getAllOutcomesController = asyncHandler(async (_req, res) => {
  const results = await getAllOutcomesView();
  if (!results || results.length === 0) {
    return res.status(404).json(notFoundResponse("Outcomes not found", null));
  }
  res.status(200).json(successResponse("Outcomes fetched successfully", results));
});

export const getOutcomeByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getOutcomeViewById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("Outcome not found", null));
  }
  res.status(200).json(successResponse("Outcome fetched successfully", result));
});

export const deleteOutcomeController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteOutcome(id);
  res.status(200).json(successResponse("Outcome deleted successfully", null));
});

export const createOrUpdateOutputController = asyncHandler(async (req, res) => {
  const { isCreate, payload }: { isCreate: boolean; payload: IOutput } = req.body;
  const result = await createOrUpdateOutput(payload, isCreate);
  res.status(200).json(successResponse(isCreate ? "Output created successfully" : "Output updated successfully", result));
});

export const getAllOutputsController = asyncHandler(async (_req, res) => {
  const result = await getAllOutputs();
  if (!result || result.length === 0) {
    return res.status(404).json(notFoundResponse("Outputs not found", null));
  }
  res.status(200).json(successResponse("Outputs retrieved successfully", result));
});

export const getOutputByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getOutputById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("Output not found", null));
  }
  res.status(200).json(successResponse("Output retrieved successfully", result));
});

export const deleteOutputController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteOutput(id);
  res.status(200).json(successResponse("Output deleted successfully", null));
});

export const createOrUpdateActivityController = asyncHandler(async (req, res) => {
  const { isCreate, payload }: { isCreate: boolean; payload: IActivity } = req.body;
  const result = await createOrUpdateActivity(payload, isCreate);
  return res.status(200).json(successResponse(isCreate ? "Activity created successfully" : "Activity updated successfully", result));
});

export const getAllActivitiesController = asyncHandler(async (_req, res) => {
  const result = await getAllActivities();
  if (!result || result.length === 0) {
    return res.status(404).json(notFoundResponse("No activities found", null));
  }
  return res.status(200).json(successResponse("Activities fetched successfully", result));
});

export const getActivityByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getActivityById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("Activity not found", null));
  }
  return res.status(200).json(successResponse("Activity fetched successfully", result));
});

export const deleteActivityController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteActivity(id);
  return res.status(200).json(successResponse("Activity deleted successfully", null));
});

export const createOrUpdateActivityReportController = asyncHandler(async (req, res) => {
  const { isCreate, payload }: { isCreate: boolean; payload: IActivityReport } = req.body;
  const result = await createOrUpdateActivityReport(payload, isCreate);
  return res.status(200).json(successResponse(isCreate ? "ActivityReport created successfully" : "ActivityReport updated successfully", result));
});

export const getAllActivityReportsController = asyncHandler(async (_req, res) => {
  const result = await getAllActivityReports();
  return res.status(200).json(successResponse("ActivityReports fetched successfully", result));
});

export const getActivityReportByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getActivityReportById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("ActivityReport not found", null));
  }
  return res.status(200).json(successResponse("ActivityReport fetched successfully", result));
});

export const deleteActivityReportController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteActivityReport(id);
  return res.status(200).json(successResponse("ActivityReport deleted successfully", null));
});

export const createOrUpdateLogicalFrameworkController = asyncHandler(async (req, res) => {
  const { isCreate, payload }: { isCreate: boolean; payload: ILogicalFramework } = req.body;
  const result = await createOrUpdateLogicalFramework(payload, isCreate);
  return res.status(200).json(successResponse(isCreate ? "LogicalFramework created successfully" : "LogicalFramework updated successfully", result));
});

export const getAllLogicalFrameworksController = asyncHandler(async (_req, res) => {
  const result = await getAllLogicalFrameworks();
  return res.status(200).json(successResponse("LogicalFrameworks fetched successfully", result));
});

export const getLogicalFrameworkByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getLogicalFrameworkById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("LogicalFramework not found", null));
  }
  return res.status(200).json(successResponse("LogicalFramework fetched successfully", result));
});

export const deleteLogicalFrameworkController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteLogicalFramework(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("LogicalFramework not found", null));
  }
  return res.status(200).json(successResponse("LogicalFramework deleted successfully", result));
});

export const getResultDashboardDataController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const dashboardData = await getResultDashboardData(projectId);
  return res.status(200).json(successResponse("Data", dashboardData));
});

export const getOrgKpiDashboardDataController = asyncHandler(async (req, res) => {
  const { thematicArea, strategicObjectiveId, resultLevel, kpiId, startDate, endDate, disaggregationType, year } = req.query as Record<string, string | undefined>;
  const dashboardData = await getOrgKpiDashboardData({
    thematicArea, strategicObjectiveId, resultLevel, kpiId,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    disaggregationType,
    year: year ? parseInt(year) : undefined,
  });
  return res.status(200).json(successResponse("Data", dashboardData));
});

export const getProjectActivityDashboardDataController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const dashboardData = await getProjectActivityDashboardData(projectId);
  return res.status(200).json(successResponse("Data", dashboardData));
});

export const getResultDashboardFullDataController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const dashboardData = await getResultDashboardFullData(projectId);
  return res.status(200).json(successResponse("Data", dashboardData));
});

export const getResultDashboardKpiSectionDataController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { thematicArea, strategicObjectiveId, resultLevel, indicatorId, startDate, endDate, disaggregationType, year } = req.query as Record<string, string | undefined>;
  const dashboardData = await getResultDashboardKpiSectionData(projectId, {
    thematicArea, strategicObjectiveId, resultLevel, indicatorId,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    disaggregationType,
    year: year ? parseInt(year) : undefined,
  });
  return res.status(200).json(successResponse("Data", dashboardData));
});

export const getImpactByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const impacts = await getImpactByProjectIdView(projectId);
  return res.status(200).json(successResponse("Impacts retrieved successfully", impacts));
});

export const getOutcomeByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const outcome = await getOutcomeViewByProjectId(projectId);
  return res.status(200).json(successResponse("Outcome retrieved successfully", outcome));
});

export const getOutputByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const output = await getOutputByProjectId(projectId);
  return res.status(200).json(successResponse("Output retrieved successfully", output));
});

export const getActivityByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const activities = await getActivityByProjectId(projectId);
  return res.status(200).json(successResponse("Activities retrieved successfully", activities));
});

export const getLogicalFrameworkByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const logicalFramework = await getLogicalFrameworkByProjectId(projectId);
  return res.status(200).json(successResponse("Logical framework retrieved successfully", logicalFramework));
});

export const getTeamMemberByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const teamMembers = await getTeamMemberByProjectId(projectId);
  return res.status(200).json(successResponse("Team members retrieved successfully", teamMembers));
});

export const getPartnerByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const partners = await getPartnerByProjectId(projectId);
  return res.status(200).json(successResponse("Partners retrieved successfully", partners));
});

export const getIndicatorByResultTypeIdController = asyncHandler(async (req, res) => {
  const { resultTypeId } = req.params;
  const indicators = await getIndicatorByResultTypeId(resultTypeId);
  res.status(200).json(successResponse("Indicators retrieved successfully", indicators));
});
