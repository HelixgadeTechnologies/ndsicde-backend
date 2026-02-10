"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardOverviewController_1 = require("../controller/dashboardOverviewController");
const dashboardOverviewRouter = express_1.default.Router();
dashboardOverviewRouter.get('/stats', dashboardOverviewController_1.getDashboardStatsController);
dashboardOverviewRouter.get('/recent-activities', dashboardOverviewController_1.getRecentActivitiesController);
dashboardOverviewRouter.get('/pending-fund-requests', dashboardOverviewController_1.getPendingFundRequestsController);
dashboardOverviewRouter.get('/pending-report-approvals', dashboardOverviewController_1.getPendingReportApprovalsController);
dashboardOverviewRouter.get('/', dashboardOverviewController_1.getDashboardOverviewController);
exports.default = dashboardOverviewRouter;
