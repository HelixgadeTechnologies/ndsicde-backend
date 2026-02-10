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
exports.getProjectPerformanceDetailsController = exports.getProgressTrackingController = exports.getProjectStatusDistributionController = exports.getKpiActualsVsTargetsController = exports.getPerformanceSummaryController = exports.getPerformanceDashboardController = void 0;
const performanceDashboardService_1 = require("../service/performanceDashboardService");
const getPerformanceDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            projectId: req.query.projectId,
            thematicArea: req.query.thematicArea,
            resultType: req.query.resultType,
        };
        const data = yield (0, performanceDashboardService_1.getPerformanceDashboard)(filter);
        res.status(200).json({
            success: true,
            message: "Performance dashboard data retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getPerformanceDashboardController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve performance dashboard data",
            error: error.message,
        });
    }
});
exports.getPerformanceDashboardController = getPerformanceDashboardController;
const getPerformanceSummaryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            projectId: req.query.projectId,
        };
        const data = yield (0, performanceDashboardService_1.getPerformanceSummary)(filter);
        res.status(200).json({
            success: true,
            message: "Performance summary retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getPerformanceSummaryController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve performance summary",
            error: error.message,
        });
    }
});
exports.getPerformanceSummaryController = getPerformanceSummaryController;
const getKpiActualsVsTargetsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            projectId: req.query.projectId,
            thematicArea: req.query.thematicArea,
            resultType: req.query.resultType,
        };
        const data = yield (0, performanceDashboardService_1.getKpiActualsVsTargets)(filter);
        res.status(200).json({
            success: true,
            message: "KPI actuals vs targets retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getKpiActualsVsTargetsController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve KPI actuals vs targets",
            error: error.message,
        });
    }
});
exports.getKpiActualsVsTargetsController = getKpiActualsVsTargetsController;
const getProjectStatusDistributionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            projectId: req.query.projectId,
        };
        const data = yield (0, performanceDashboardService_1.getProjectStatusDistribution)(filter);
        res.status(200).json({
            success: true,
            message: "Project status distribution retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getProjectStatusDistributionController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project status distribution",
            error: error.message,
        });
    }
});
exports.getProjectStatusDistributionController = getProjectStatusDistributionController;
const getProgressTrackingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            projectId: req.query.projectId,
        };
        const data = yield (0, performanceDashboardService_1.getProgressTracking)(filter);
        res.status(200).json({
            success: true,
            message: "Progress tracking data retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getProgressTrackingController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve progress tracking data",
            error: error.message,
        });
    }
});
exports.getProgressTrackingController = getProgressTrackingController;
const getProjectPerformanceDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            projectId: req.query.projectId,
        };
        const data = yield (0, performanceDashboardService_1.getProjectPerformanceDetails)(filter);
        res.status(200).json({
            success: true,
            message: "Project performance details retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in getProjectPerformanceDetailsController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project performance details",
            error: error.message,
        });
    }
});
exports.getProjectPerformanceDetailsController = getProjectPerformanceDetailsController;
