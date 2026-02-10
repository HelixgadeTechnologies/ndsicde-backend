"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const performanceDashboardController_1 = require("../controller/performanceDashboardController");
const router = express_1.default.Router();
router.get("/", performanceDashboardController_1.getPerformanceDashboardController);
router.get("/summary", performanceDashboardController_1.getPerformanceSummaryController);
router.get("/kpi-actuals-vs-targets", performanceDashboardController_1.getKpiActualsVsTargetsController);
router.get("/status-distribution", performanceDashboardController_1.getProjectStatusDistributionController);
router.get("/progress-tracking", performanceDashboardController_1.getProgressTrackingController);
router.get("/project-details", performanceDashboardController_1.getProjectPerformanceDetailsController);
exports.default = router;
