"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financialDashboardController_1 = require("../controller/financialDashboardController");
const router = express_1.default.Router();
router.get("/", financialDashboardController_1.getFinancialDashboardController);
router.get("/summary", financialDashboardController_1.getFinancialSummaryController);
router.get("/budget-trends", financialDashboardController_1.getBudgetTrendsController);
router.get("/expense-breakdown", financialDashboardController_1.getExpenseBreakdownController);
router.get("/project-performance", financialDashboardController_1.getProjectFinancialPerformanceController);
router.get("/budget-vs-actuals", financialDashboardController_1.getBudgetVsActualsController);
router.get("/detailed-expenses", financialDashboardController_1.getDetailedExpensesController);
exports.default = router;
