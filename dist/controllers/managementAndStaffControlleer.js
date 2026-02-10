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
exports.getIndicatorReportOverviewController = exports.changePasswordController = exports.getAllIndicatorReportCommentsController = exports.getCommentsByIndicatorReportIdController = exports.createIndicatorReportCommentController = exports.getAllIndicatorReports = exports.getBudgetUtilization = exports.getProjectStatusDistribution = exports.getProjects = exports.getKpiPerformance = exports.getDashboardSummary = void 0;
const managementAndStaffService_1 = require("../service/managementAndStaffService");
const responseHandler_1 = require("../utils/responseHandler");
const authService_1 = require("../service/authService");
const getDashboardSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, managementAndStaffService_1.getDashboardSummaryService)();
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Dashboard summary not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Dashboard summary fetched successfully", result));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getDashboardSummary = getDashboardSummary;
const getKpiPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const result = yield (0, managementAndStaffService_1.getKpiPerformanceService)(year);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("KPI performance data not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("KPI performance fetched successfully", result));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getKpiPerformance = getKpiPerformance;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield (0, managementAndStaffService_1.getProjectsService)();
        if (!projects.length) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Projects not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Projects fetched successfully", projects));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getProjects = getProjects;
const getProjectStatusDistribution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, managementAndStaffService_1.getProjectStatusDistributionService)();
        if (!result.length) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Project status data not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Project status distribution fetched successfully", result));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getProjectStatusDistribution = getProjectStatusDistribution;
const getBudgetUtilization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, managementAndStaffService_1.getBudgetUtilizationService)();
        if (!result.length) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Budget utilization data not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Budget utilization fetched successfully", result));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getBudgetUtilization = getBudgetUtilization;
const getAllIndicatorReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield (0, managementAndStaffService_1.getAllIndicatorReportsService)();
        if (!reports || reports.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No indicator reports found", []));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Indicator reports fetched successfully", reports));
    }
    catch (error) {
        console.error('Controller error:', error);
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message || "Failed to fetch indicator reports"));
    }
});
exports.getAllIndicatorReports = getAllIndicatorReports;
const createIndicatorReportCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, managementAndStaffService_1.createIndicatorReportCommentService)(req.body);
        return res
            .status(201)
            .json((0, responseHandler_1.successResponse)("Comment created successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createIndicatorReportCommentController = createIndicatorReportCommentController;
const getCommentsByIndicatorReportIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { indicatorReportId } = req.params;
        const comments = yield (0, managementAndStaffService_1.getCommentsByIndicatorReportIdService)(indicatorReportId);
        if (!comments.length) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No comments found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Comments fetched successfully", comments));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getCommentsByIndicatorReportIdController = getCommentsByIndicatorReportIdController;
const getAllIndicatorReportCommentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield (0, managementAndStaffService_1.getAllIndicatorReportCommentsService)();
        if (!comments.length) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No comments found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Comments fetched successfully", comments));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllIndicatorReportCommentsController = getAllIndicatorReportCommentsController;
const changePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!userId) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("User not found", null));
        }
        const result = yield (0, authService_1.changePassword)(userId, oldPassword, newPassword, confirmPassword);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)(result.message, null));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.changePasswordController = changePasswordController;
const getIndicatorReportOverviewController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params", req.params);
        const { indicatorReportId } = req.params;
        const overview = yield (0, managementAndStaffService_1.getIndicatorReportOverviewService)(indicatorReportId);
        if (!overview) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Indicator report not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Indicator report overview fetched successfully", overview));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getIndicatorReportOverviewController = getIndicatorReportOverviewController;
