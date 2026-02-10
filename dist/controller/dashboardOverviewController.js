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
exports.getDashboardStatsController = getDashboardStatsController;
exports.getRecentActivitiesController = getRecentActivitiesController;
exports.getPendingFundRequestsController = getPendingFundRequestsController;
exports.getPendingReportApprovalsController = getPendingReportApprovalsController;
exports.getDashboardOverviewController = getDashboardOverviewController;
const dashboardOverviewService_1 = require("../service/dashboardOverviewService");
function getDashboardStatsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stats = yield (0, dashboardOverviewService_1.getDashboardStats)();
            res.status(200).json({
                success: true,
                message: 'Dashboard statistics retrieved successfully',
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve dashboard statistics',
                error: error.message
            });
        }
    });
}
function getRecentActivitiesController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const projectId = req.query.projectId;
            const days = req.query.days ? parseInt(req.query.days) : undefined;
            const activities = yield (0, dashboardOverviewService_1.getRecentActivities)({ limit, projectId, days });
            res.status(200).json({
                success: true,
                message: 'Recent activities retrieved successfully',
                data: activities
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve recent activities',
                error: error.message
            });
        }
    });
}
function getPendingFundRequestsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const requests = yield (0, dashboardOverviewService_1.getPendingActivityFundRequests)(limit);
            res.status(200).json({
                success: true,
                message: 'Pending fund requests retrieved successfully',
                data: requests
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve pending fund requests',
                error: error.message
            });
        }
    });
}
function getPendingReportApprovalsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const approvals = yield (0, dashboardOverviewService_1.getPendingReportApprovals)(limit);
            res.status(200).json({
                success: true,
                message: 'Pending report approvals retrieved successfully',
                data: approvals
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve pending report approvals',
                error: error.message
            });
        }
    });
}
function getDashboardOverviewController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectId = req.query.projectId;
            const [stats, recentActivities, pendingRequests, pendingApprovals] = yield Promise.all([
                (0, dashboardOverviewService_1.getDashboardStats)(),
                (0, dashboardOverviewService_1.getRecentActivities)({ limit: 10, projectId }),
                (0, dashboardOverviewService_1.getPendingActivityFundRequests)(5),
                (0, dashboardOverviewService_1.getPendingReportApprovals)(5)
            ]);
            res.status(200).json({
                success: true,
                message: 'Dashboard overview retrieved successfully',
                data: {
                    stats,
                    recentActivities,
                    pendingFundRequests: pendingRequests,
                    pendingReportApprovals: pendingApprovals
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve dashboard overview',
                error: error.message
            });
        }
    });
}
