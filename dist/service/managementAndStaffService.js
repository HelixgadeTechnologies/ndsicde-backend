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
exports.getIndicatorReportOverviewService = exports.getAllIndicatorReportCommentsService = exports.getCommentsByIndicatorReportIdService = exports.createIndicatorReportCommentService = exports.getAllIndicatorReportsService = exports.getBudgetUtilizationService = exports.getProjectStatusDistributionService = exports.getProjectsService = exports.getKpiPerformanceService = exports.getDashboardSummaryService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardSummaryService = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalProjects, completedProjects, onHoldProjects, activeProjects, activeKpis] = yield Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { status: "Completed" } }),
        prisma.project.count({ where: { status: "On Hold" } }),
        prisma.project.count({ where: { status: "Active" } }),
        prisma.indicator.count()
    ]);
    return {
        totalProjects,
        completedProjects,
        onHoldProjects,
        activeProjects,
        activeKpis
    };
});
exports.getDashboardSummaryService = getDashboardSummaryService;
const getKpiPerformanceService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const indicators = yield prisma.indicator.findMany({
        where: {
            targetDate: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(`${year}-12-31`)
            }
        },
        select: {
            targetDate: true,
            cumulativeTarget: true,
            indicatorReport: {
                select: {
                    actualDate: true,
                    cumulativeActual: true
                }
            }
        }
    });
    const monthlyData = {
        Jan: { target: 0, actual: 0 },
        Feb: { target: 0, actual: 0 },
        Mar: { target: 0, actual: 0 },
        Apr: { target: 0, actual: 0 },
        May: { target: 0, actual: 0 },
        Jun: { target: 0, actual: 0 },
        Jul: { target: 0, actual: 0 },
        Aug: { target: 0, actual: 0 },
        Sep: { target: 0, actual: 0 },
        Oct: { target: 0, actual: 0 },
        Nov: { target: 0, actual: 0 },
        Dec: { target: 0, actual: 0 }
    };
    indicators.forEach(indicator => {
        if (indicator.targetDate) {
            const month = indicator.targetDate.toLocaleString("en-US", { month: "short" });
            monthlyData[month].target += indicator.cumulativeTarget || 0;
        }
        indicator.indicatorReport.forEach(report => {
            if (report.actualDate) {
                const month = report.actualDate.toLocaleString("en-US", { month: "short" });
                monthlyData[month].actual += Number(report.cumulativeActual || 0);
            }
        });
    });
    return monthlyData;
});
exports.getKpiPerformanceService = getKpiPerformanceService;
const getProjectsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield prisma.project.findMany({
        orderBy: { createAt: "desc" },
        select: {
            projectId: true,
            projectName: true,
            status: true,
            startDate: true,
            endDate: true,
            thematicAreasOrPillar: true,
            strategicObjective: {
                select: { statement: true }
            },
            teamMember: {
                select: {
                    fullName: true
                }
            }
        }
    });
    return projects;
});
exports.getProjectsService = getProjectsService;
const getProjectStatusDistributionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalProjects = yield prisma.project.count();
    if (totalProjects === 0)
        return [];
    const grouped = yield prisma.project.groupBy({
        by: ["status"],
        _count: {
            status: true
        }
    });
    return grouped.map(item => ({
        label: item.status,
        count: item._count.status,
        percentage: Math.round((item._count.status / totalProjects) * 100)
    }));
});
exports.getProjectStatusDistributionService = getProjectStatusDistributionService;
const getBudgetUtilizationService = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield prisma.project.findMany({
        select: {
            totalBudgetAmount: true
        }
    });
    const totalBudget = projects.reduce((sum, p) => sum + Number(p.totalBudgetAmount || 0), 0);
    if (totalBudget === 0)
        return [];
    const spentPercentage = 33;
    const spentAmount = Math.round(totalBudget * (spentPercentage / 100));
    const remainingAmount = totalBudget - spentAmount;
    return [
        {
            label: "Spent",
            amount: spentAmount,
            percentage: spentPercentage
        },
        {
            label: "Remaining",
            amount: remainingAmount,
            percentage: 100 - spentPercentage
        }
    ];
});
exports.getBudgetUtilizationService = getBudgetUtilizationService;
const getAllIndicatorReportsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield prisma.indicatorReport.findMany({
            include: {
                indicator: {
                    select: {
                        cumulativeTarget: true
                    }
                },
                ResultType: {
                    select: {
                        resultName: true,
                        resultTypeId: true
                    }
                }
            }
        });
        const formattedReports = reports.map((report) => {
            var _a, _b, _c;
            const actual = Number(report.cumulativeActual || 0);
            const target = Number(((_a = report.indicator) === null || _a === void 0 ? void 0 : _a.cumulativeTarget) || 0);
            let kpiStatus = "Not Met";
            if (actual >= target && target > 0) {
                kpiStatus = "Met";
            }
            else if (target === 0) {
                kpiStatus = "N/A";
            }
            return {
                reportId: report.indicatorReportId,
                reportTitle: report.indicatorStatement || "Untitled Report",
                project: report.thematicAreasOrPillar || "No Project",
                dateGenerated: report.createAt
                    ? new Date(report.createAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                    : "N/A",
                status: report.status || "Pending",
                kpiStatus: kpiStatus,
                resultType: ((_b = report.ResultType) === null || _b === void 0 ? void 0 : _b.resultName) || "Not Specified",
                resultTypeId: ((_c = report.ResultType) === null || _c === void 0 ? void 0 : _c.resultTypeId) || "",
                indicatorSource: report.indicatorSource,
                responsiblePersons: report.responsiblePersons,
                actualDate: report.actualDate,
                cumulativeActual: report.cumulativeActual,
                actualNarrative: report.actualNarrative,
                attachmentUrl: report.attachmentUrl,
                createAt: report.createAt,
                updateAt: report.updateAt,
                resultTypeDetails: report.ResultType
            };
        });
        return formattedReports;
    }
    catch (error) {
        console.error('Error fetching all indicator reports:', error);
        throw new Error('Failed to fetch indicator reports');
    }
});
exports.getAllIndicatorReportsService = getAllIndicatorReportsService;
const createIndicatorReportCommentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { indicatorReportId, comment } = payload;
    const newComment = yield prisma.indicatorReportComment.create({
        data: {
            indicatorReportId,
            comment
        }
    });
    return newComment;
});
exports.createIndicatorReportCommentService = createIndicatorReportCommentService;
const getCommentsByIndicatorReportIdService = (indicatorReportId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma.indicatorReportComment.findMany({
        where: { indicatorReportId },
        select: {
            indicatorReportCommentId: true,
            indicatorReportId: true,
            comment: true,
            createAt: true,
            updateAt: true
        },
        orderBy: { createAt: "desc" }
    });
    return comments;
});
exports.getCommentsByIndicatorReportIdService = getCommentsByIndicatorReportIdService;
const getAllIndicatorReportCommentsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma.indicatorReportComment.findMany({
        select: {
            indicatorReportCommentId: true,
            indicatorReportId: true,
            comment: true,
            createAt: true,
            updateAt: true
        }
    });
    return comments;
});
exports.getAllIndicatorReportCommentsService = getAllIndicatorReportCommentsService;
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const getIndicatorReportOverviewService = (indicatorReportId) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield prisma.indicatorReport.findUnique({
        where: { indicatorReportId },
        include: {
            indicator: true,
            indicatorReportComment: {
                orderBy: { createAt: "desc" },
            },
        },
    });
    if (!report || !report.indicator)
        return null;
    const indicator = report.indicator;
    const allReports = yield prisma.indicatorReport.findMany({
        where: {
            indicatorId: indicator.indicatorId,
        },
        select: {
            cumulativeActual: true,
            actualDate: true,
            createAt: true,
        },
    });
    const budget = Array(12).fill(0);
    const actualSpending = Array(12).fill(0);
    allReports.forEach((r) => {
        var _a;
        const date = (_a = r.actualDate) !== null && _a !== void 0 ? _a : r.createAt;
        if (!date)
            return;
        const monthIndex = new Date(date).getMonth();
        actualSpending[monthIndex] += Number(r.cumulativeActual || 0);
        budget[monthIndex] = Number(indicator.cumulativeTarget || 0);
    });
    const financialOverview = {
        months: MONTHS,
        budget,
        actualSpending,
    };
    return {
        financialOverview,
        comments: report.indicatorReportComment,
    };
});
exports.getIndicatorReportOverviewService = getIndicatorReportOverviewService;
