"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentDisaggregationByIndicatorController = exports.createOrUpdateDepartmentDisaggregationController = exports.getProductDisaggregationByIndicatorController = exports.createOrUpdateProductDisaggregationController = exports.getGenderDisaggregationByIndicatorController = exports.createOrUpdateGenderDisaggregationController = exports.getDisaggregation = exports.deleteLogicalFrameworkController = exports.getLogicalFrameworkByIdController = exports.getAllLogicalFrameworksController = exports.createOrUpdateLogicalFrameworkController = exports.deleteActivityReportController = exports.getActivityReportByIdController = exports.getAllActivityReportsController = exports.createOrUpdateActivityReportController = exports.deleteActivityController = exports.getActivityByIdController = exports.getAllActivitiesController = exports.createOrUpdateActivityController = exports.deleteOutputController = exports.getOutputByIdController = exports.getAllOutputsController = exports.createOrUpdateOutputController = exports.deleteOutcomeController = exports.getOutcomeByIdController = exports.getAllOutcomesController = exports.saveOutcomeController = exports.removeIndicatorReport = exports.getImpactIndicatorReportById = exports.getIndicatorReportsByResult = exports.createOrUpdateIndicatorReport = exports.deleteIndicatorController = exports.getAllResultType = exports.getIndicatorById = exports.getAllIndicatorsByResult = exports.createOrUpdateIndicatorController = exports.deleteImpactController = exports.getAllImpactsController = exports.createOrUpdateImpactController = exports.deletePartnerController = exports.getAllPartnersController = exports.createOrUpdatePartnerController = exports.deleteTeamMemberController = exports.getAllTeamMemberController = exports.createOrUpdateTeamMemberController = exports.fetchProjectStatusStats = exports.removeProject = exports.fetchProjectById = exports.fetchAllProjects = exports.createOrUpdateProject = void 0;
exports.getProjectActivityDashboardDataController = exports.getOrgKpiDashboardDataController = exports.getResultDashboardDataController = exports.getAgeDisaggregationByIndicatorController = exports.createOrUpdateAgeDisaggregationController = exports.getTenureDisaggregationByIndicatorController = exports.createOrUpdateTenureDisaggregationController = exports.getLGADisaggregationByIndicatorController = exports.createOrUpdateLGADisaggregationController = exports.getStateDisaggregationByIndicatorController = exports.createOrUpdateStateDisaggregationController = void 0;
const projectManagementService_1 = require("../service/projectManagementService");
const responseHandler_1 = require("../utils/responseHandler");
const kpiDashboardService_1 = require("../service/kpiDashboardService");
const createOrUpdateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isCreate, data } = req.body;
    try {
        const project = yield (0, projectManagementService_1.saveProject)(data, isCreate);
        const message = isCreate
            ? "Project created successfully"
            : "Project updated successfully";
        res.status(isCreate ? 201 : 200).json((0, responseHandler_1.successResponse)(message, project));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateProject = createOrUpdateProject;
const fetchAllProjects = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield (0, projectManagementService_1.getAllProjects)();
        res.status(200).json((0, responseHandler_1.successResponse)("Projects retrieved", projects));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchAllProjects = fetchAllProjects;
const fetchProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield (0, projectManagementService_1.getProjectById)(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json((0, responseHandler_1.successResponse)("Project found", project));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchProjectById = fetchProjectById;
const removeProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.body;
    try {
        const deleted = yield (0, projectManagementService_1.deleteProject)(projectId);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Project deleted successfully", deleted));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.removeProject = removeProject;
const fetchProjectStatusStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, projectManagementService_1.getProjectsStatus)();
        res.status(200).json((0, responseHandler_1.successResponse)("Project status summary", stats));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchProjectStatusStats = fetchProjectStatusStats;
const createOrUpdateTeamMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, data } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateTeamMember)(data, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Team member created successfully"
            : "Team member updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateTeamMemberController = createOrUpdateTeamMemberController;
const getAllTeamMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllTeamMember)();
        res.status(200).json((0, responseHandler_1.successResponse)("Team Members", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllTeamMemberController = getAllTeamMemberController;
const deleteTeamMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deleteTeamMember)(id);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Team member deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteTeamMemberController = deleteTeamMemberController;
const createOrUpdatePartnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, data } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdatePartner)(data, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Partner created successfully"
            : "Partner updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdatePartnerController = createOrUpdatePartnerController;
const getAllPartnersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllPartners)();
        res.status(200).json((0, responseHandler_1.successResponse)("Partners", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllPartnersController = getAllPartnersController;
const deletePartnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deletePartner)(id);
        res.status(200).json((0, responseHandler_1.successResponse)("Partner deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deletePartnerController = deletePartnerController;
const createOrUpdateImpactController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, data } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateImpact)(data, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Impact created successfully"
            : "Impact updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateImpactController = createOrUpdateImpactController;
const getAllImpactsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllImpact)();
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Impacts retrieved successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllImpactsController = getAllImpactsController;
const deleteImpactController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deleteImpact)(id);
        res.status(200).json((0, responseHandler_1.successResponse)("Impact deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteImpactController = deleteImpactController;
const createOrUpdateIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, data } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateIndicator)(data, isCreate);
        return res
            .status(isCreate ? 201 : 200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Indicator created successfully"
            : "Indicator updated successfully", result));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message || "Error processing impact indicator"));
    }
});
exports.createOrUpdateIndicatorController = createOrUpdateIndicatorController;
const getAllIndicatorsByResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resultId } = req.params;
        const indicators = yield (0, projectManagementService_1.getAllImpactIndicatorsByResultIdView)(resultId);
        if (!indicators || indicators.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Indicators not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Indicators retrieved", indicators));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllIndicatorsByResult = getAllIndicatorsByResult;
const getIndicatorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const indicatorId = req.params.indicatorId;
        const indicator = yield (0, projectManagementService_1.getIndicatorByIdView)(indicatorId);
        if (!indicator) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Indicator not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Indicator retrieved", indicator));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getIndicatorById = getIndicatorById;
const getAllResultType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, projectManagementService_1.getResultType)();
        if (results.length < 1) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Result type not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Result type retrieved", results));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllResultType = getAllResultType;
const deleteIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deleteImpact)(id);
        res.status(200).json((0, responseHandler_1.successResponse)("Indicator deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteIndicatorController = deleteIndicatorController;
const createOrUpdateIndicatorReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body.payload;
        const isCreate = req.body.isCreate;
        const result = yield (0, projectManagementService_1.saveIndicatorReport)(payload, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Indicator created successfully"
            : "Indicator updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateIndicatorReport = createOrUpdateIndicatorReport;
const getIndicatorReportsByResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resultId = req.params.resultId;
        const results = yield (0, projectManagementService_1.getAllIndicatorReportByResultId)(resultId);
        if (!results || results.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("indicator report not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("indicator report fetched successfully", results));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getIndicatorReportsByResult = getIndicatorReportsByResult;
const getImpactIndicatorReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.indicatorId;
        const result = yield (0, projectManagementService_1.getIndicatorReportById)(id);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("indicator report not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("indicator report fetched successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getImpactIndicatorReportById = getImpactIndicatorReportById;
const removeIndicatorReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield (0, projectManagementService_1.deleteIndicatorReport)(id);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("indicator report deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.removeIndicatorReport = removeIndicatorReport;
const saveOutcomeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isCreate, data } = req.body;
    try {
        const result = yield (0, projectManagementService_1.saveOutcome)(data, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate === true
            ? "Outcome created successfully"
            : "Outcome updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.saveOutcomeController = saveOutcomeController;
const getAllOutcomesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, projectManagementService_1.getAllOutcomesView)();
        if (!results || results.length === 0) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Outcomes not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Outcomes fetched successfully", results));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllOutcomesController = getAllOutcomesController;
const getOutcomeByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, projectManagementService_1.getOutcomeViewById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Outcome not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Outcome fetched successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getOutcomeByIdController = getOutcomeByIdController;
const deleteOutcomeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, projectManagementService_1.deleteOutcome)(id);
        res.status(200).json((0, responseHandler_1.successResponse)("Outcome deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteOutcomeController = deleteOutcomeController;
const createOrUpdateOutputController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateOutput)(payload, isCreate);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(isCreate
            ? "Output created successfully"
            : "Output updated successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateOutputController = createOrUpdateOutputController;
const getAllOutputsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllOutputs)();
        if (!result || result.length === 0) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Outputs not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Outputs retrieved successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllOutputsController = getAllOutputsController;
const getOutputByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, projectManagementService_1.getOutputById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Output not found", null));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Output retrieved successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getOutputByIdController = getOutputByIdController;
const deleteOutputController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deleteOutput)(id);
        res.status(200).json((0, responseHandler_1.successResponse)("Output deleted successfully", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteOutputController = deleteOutputController;
const createOrUpdateActivityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateActivity)(payload, isCreate);
        return res.status(200).json((0, responseHandler_1.successResponse)(isCreate
            ? "Activity created successfully"
            : "Activity updated successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateActivityController = createOrUpdateActivityController;
const getAllActivitiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllActivities)();
        if (!result || result.length === 0) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("No activities found", null));
        }
        return res.status(200).json((0, responseHandler_1.successResponse)("Activities fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllActivitiesController = getAllActivitiesController;
const getActivityByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield (0, projectManagementService_1.getActivityById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Activity not found", null));
        }
        return res.status(200).json((0, responseHandler_1.successResponse)("Activity fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getActivityByIdController = getActivityByIdController;
const deleteActivityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield (0, projectManagementService_1.deleteActivity)(id);
        return res.status(200).json((0, responseHandler_1.successResponse)("Activity deleted successfully", null));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteActivityController = deleteActivityController;
const createOrUpdateActivityReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateActivityReport)(payload, isCreate);
        return res.status(200).json((0, responseHandler_1.successResponse)(isCreate
            ? "ActivityReport created successfully"
            : "ActivityReport updated successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateActivityReportController = createOrUpdateActivityReportController;
const getAllActivityReportsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllActivityReports)();
        return res.status(200).json((0, responseHandler_1.successResponse)("ActivityReports fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllActivityReportsController = getAllActivityReportsController;
const getActivityReportByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, projectManagementService_1.getActivityReportById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("ActivityReport not found", null));
        }
        return res.status(200).json((0, responseHandler_1.successResponse)("ActivityReport fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getActivityReportByIdController = getActivityReportByIdController;
const deleteActivityReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, projectManagementService_1.deleteActivityReport)(id);
        return res.status(200).json((0, responseHandler_1.successResponse)("ActivityReport deleted successfully", null));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteActivityReportController = deleteActivityReportController;
const createOrUpdateLogicalFrameworkController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateLogicalFramework)(payload, isCreate);
        return res.status(200).json((0, responseHandler_1.successResponse)(isCreate
            ? "LogicalFramework created successfully"
            : "LogicalFramework updated successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateLogicalFrameworkController = createOrUpdateLogicalFrameworkController;
const getAllLogicalFrameworksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, projectManagementService_1.getAllLogicalFrameworks)();
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("LogicalFrameworks fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllLogicalFrameworksController = getAllLogicalFrameworksController;
const getLogicalFrameworkByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, projectManagementService_1.getLogicalFrameworkById)(id);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("LogicalFramework not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("LogicalFramework fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getLogicalFrameworkByIdController = getLogicalFrameworkByIdController;
const deleteLogicalFrameworkController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, projectManagementService_1.deleteLogicalFramework)(id);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("LogicalFramework not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("LogicalFramework deleted successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteLogicalFrameworkController = deleteLogicalFrameworkController;
const getDisaggregation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disaggregation = yield (0, projectManagementService_1.getAllDisaggregation)();
        if (!disaggregation || disaggregation.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No disaggregation found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Disaggregation retrieved", disaggregation));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getDisaggregation = getDisaggregation;
const createOrUpdateGenderDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, projectManagementService_1.createOrUpdateGenderAggregation)(payload, isCreate === "true");
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Gender disaggregation saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateGenderDisaggregationController = createOrUpdateGenderDisaggregationController;
const getGenderDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregation = yield (0, projectManagementService_1.getGenderDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregation || disaggregation.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No gender disaggregation found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Gender disaggregation retrieved", disaggregation));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getGenderDisaggregationByIndicatorController = getGenderDisaggregationByIndicatorController;
const createOrUpdateProductDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        if (!isCreate) {
            const missingId = payload.some((item) => !item.productDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include productDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateProductDisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Product disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateProductDisaggregationController = createOrUpdateProductDisaggregationController;
const getProductDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getProductDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No product disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Product disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getProductDisaggregationByIndicatorController = getProductDisaggregationByIndicatorController;
const createOrUpdateDepartmentDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        if (!isCreate) {
            const missingId = payload.some((item) => !item.departmentDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include departmentDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateDepartmentDisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Department disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateDepartmentDisaggregationController = createOrUpdateDepartmentDisaggregationController;
const getDepartmentDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getDepartmentDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No department disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Department disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getDepartmentDisaggregationByIndicatorController = getDepartmentDisaggregationByIndicatorController;
const createOrUpdateStateDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Request body is required"));
        }
        const { isCreate, payload } = req.body;
        if (isCreate === undefined || !payload) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("isCreate and payload are required fields"));
        }
        if (!isCreate) {
            const missingId = payload.some((item) => !item.stateDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include stateDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateStateDisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("State disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateStateDisaggregationController = createOrUpdateStateDisaggregationController;
const getStateDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getStateDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No state disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("State disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getStateDisaggregationByIndicatorController = getStateDisaggregationByIndicatorController;
const createOrUpdateLGADisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Request body is required"));
        }
        const { isCreate, payload } = req.body;
        if (isCreate === undefined || !payload) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("isCreate and payload are required fields"));
        }
        if (!isCreate) {
            const missingId = payload.some((item) => !item.lgaDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include lgaDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateLGADisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("LGA disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateLGADisaggregationController = createOrUpdateLGADisaggregationController;
const getLGADisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getLGADisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No LGA disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("LGA disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getLGADisaggregationByIndicatorController = getLGADisaggregationByIndicatorController;
const createOrUpdateTenureDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Request body is required"));
        }
        const { isCreate, payload } = req.body;
        if (isCreate === undefined || !payload) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("isCreate and payload are required fields"));
        }
        if (!isCreate) {
            const missingId = payload.some((item) => !item.tenureDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include tenureDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateTenureDisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Tenure disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateTenureDisaggregationController = createOrUpdateTenureDisaggregationController;
const getTenureDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getTenureDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No tenure disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Tenure disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getTenureDisaggregationByIndicatorController = getTenureDisaggregationByIndicatorController;
const createOrUpdateAgeDisaggregationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Request body is required"));
        }
        const { isCreate, payload } = req.body;
        if (isCreate === undefined || !payload) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("isCreate and payload are required fields"));
        }
        if (!isCreate) {
            const missingId = payload.some((item) => !item.ageDisaggregationId);
            if (missingId) {
                return res
                    .status(400)
                    .json((0, responseHandler_1.errorResponse)("Each item must include ageDisaggregationId for update"));
            }
        }
        const result = yield (0, projectManagementService_1.createOrUpdateAgeDisaggregation)(payload, isCreate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Age disaggregations saved", result));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateAgeDisaggregationController = createOrUpdateAgeDisaggregationController;
const getAgeDisaggregationByIndicatorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorId } = req.params;
        const disaggregations = yield (0, projectManagementService_1.getAgeDisaggregationByIndicatorId)(indicatorId);
        if (!disaggregations || disaggregations.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No age disaggregations found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Age disaggregations retrieved", disaggregations));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAgeDisaggregationByIndicatorController = getAgeDisaggregationByIndicatorController;
const getResultDashboardDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const dashboardData = yield (0, kpiDashboardService_1.getResultDashboardData)(projectId);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Data", dashboardData));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getResultDashboardDataController = getResultDashboardDataController;
const getOrgKpiDashboardDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dashboardData = yield (0, kpiDashboardService_1.getOrgKpiDashboardData)();
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Data", dashboardData));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getOrgKpiDashboardDataController = getOrgKpiDashboardDataController;
const getProjectActivityDashboardDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const dashboardData = yield (0, kpiDashboardService_1.getProjectActivityDashboardData)(projectId);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Data", dashboardData));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getProjectActivityDashboardDataController = getProjectActivityDashboardDataController;
