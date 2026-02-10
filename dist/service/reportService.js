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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
exports.getAllReports = getAllReports;
exports.getReportById = getReportById;
exports.deleteReport = deleteReport;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const pdfGenerator_1 = require("../utils/pdfGenerator");
const prisma = new client_1.PrismaClient();
function generateReport(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reportName = params.reportName || `${params.reportType} - ${new Date().toLocaleDateString()}`;
            const reportData = yield aggregateReportData(params);
            const timestamp = Date.now();
            const fileName = `report_${timestamp}.pdf`;
            const outputPath = path_1.default.join(process.cwd(), 'reports', fileName);
            const pdfPath = yield (0, pdfGenerator_1.generatePDFReport)({
                reportData,
                outputPath,
                includeCharts: true,
                includeTables: true
            });
            const fileSize = (0, pdfGenerator_1.getFileSize)(pdfPath);
            const savedReport = yield prisma.report.create({
                data: {
                    reportName,
                    reportType: params.reportType,
                    projectId: params.projectId,
                    startDate: params.startDate ? new Date(params.startDate) : null,
                    endDate: params.endDate ? new Date(params.endDate) : null,
                    selectedMetrics: params.selectedMetrics ? JSON.stringify(params.selectedMetrics) : null,
                    generatedBy: params.generatedBy,
                    fileUrl: pdfPath,
                    fileSize,
                    status: 'Completed',
                    totalActivities: reportData.summary.totalActivities,
                    totalRequests: reportData.summary.totalRequests,
                    totalRetirements: reportData.summary.totalRetirements,
                    budgetUtilization: reportData.summary.budgetUtilization
                }
            });
            return {
                success: true,
                message: 'Report generated successfully',
                data: {
                    reportId: savedReport.reportId,
                    reportName: savedReport.reportName,
                    fileUrl: savedReport.fileUrl,
                    fileSize: savedReport.fileSize,
                    summary: reportData.summary
                }
            };
        }
        catch (error) {
            console.error('Error generating report:', error);
            throw new Error(`Failed to generate report: ${error.message}`);
        }
    });
}
function aggregateReportData(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { reportType, projectId, startDate, endDate } = params;
        const whereClause = {};
        if (projectId)
            whereClause.projectId = projectId;
        if (startDate || endDate) {
            whereClause.createAt = {};
            if (startDate)
                whereClause.createAt.gte = new Date(startDate);
            if (endDate)
                whereClause.createAt.lte = new Date(endDate);
        }
        let projectName;
        if (projectId) {
            const project = yield prisma.project.findUnique({
                where: { projectId },
                select: { projectName: true }
            });
            projectName = (project === null || project === void 0 ? void 0 : project.projectName) || undefined;
        }
        let activityData = null;
        let requestData = null;
        let retirementData = null;
        switch (reportType) {
            case 'Activity Summary':
                activityData = yield aggregateActivityData(whereClause);
                break;
            case 'Financial Overview':
                activityData = yield aggregateActivityData(whereClause);
                requestData = yield aggregateRequestData(whereClause);
                retirementData = yield aggregateRetirementData(whereClause);
                break;
            case 'Request Analysis':
                requestData = yield aggregateRequestData(whereClause);
                break;
            case 'Retirement Analysis':
                retirementData = yield aggregateRetirementData(whereClause);
                break;
        }
        const summary = buildSummary(activityData, requestData, retirementData);
        const charts = buildCharts(reportType, activityData, requestData, retirementData);
        const tables = buildTables(reportType, activityData, requestData, retirementData);
        const metadata = {
            reportName: params.reportName || `${reportType} - ${new Date().toLocaleDateString()}`,
            reportType,
            generatedAt: new Date(),
            generatedBy: params.generatedBy,
            projectName,
            dateRange: {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            },
            filters: {
                projectId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                selectedMetrics: params.selectedMetrics
            }
        };
        return {
            summary,
            charts,
            tables,
            metadata
        };
    });
}
function aggregateActivityData(whereClause) {
    return __awaiter(this, void 0, void 0, function* () {
        const activities = yield prisma.activity.findMany({
            where: whereClause,
            include: {
                activityReport: true,
                project: {
                    select: { projectName: true }
                }
            }
        });
        const activityReports = activities.map(activity => {
            const report = activity.activityReport[0];
            const percentageCompletion = (report === null || report === void 0 ? void 0 : report.percentageCompletion) || 0;
            let status = 'Not Started';
            if (percentageCompletion === 100)
                status = 'Completed';
            else if (percentageCompletion > 0)
                status = 'In Progress';
            if (activity.endDate && new Date() > new Date(activity.endDate) && percentageCompletion < 100) {
                status = 'Delayed';
            }
            return {
                activityId: activity.activityId,
                activityStatement: activity.activityStatement || '',
                responsiblePerson: activity.responsiblePerson || '',
                startDate: activity.startDate,
                endDate: activity.endDate,
                totalBudget: activity.activityTotalBudget || 0,
                actualCost: (report === null || report === void 0 ? void 0 : report.actualCost) || 0,
                percentageCompletion,
                status
            };
        });
        const totalActivities = activityReports.length;
        const completedActivities = activityReports.filter(a => a.status === 'Completed').length;
        const inProgressActivities = activityReports.filter(a => a.status === 'In Progress').length;
        const delayedActivities = activityReports.filter(a => a.status === 'Delayed').length;
        const totalBudget = activityReports.reduce((sum, a) => sum + a.totalBudget, 0);
        const totalActualCost = activityReports.reduce((sum, a) => sum + a.actualCost, 0);
        const averageCompletion = totalActivities > 0
            ? activityReports.reduce((sum, a) => sum + a.percentageCompletion, 0) / totalActivities
            : 0;
        return {
            activities: activityReports,
            totalActivities,
            completedActivities,
            inProgressActivities,
            delayedActivities,
            totalBudget,
            totalActualCost,
            averageCompletion
        };
    });
}
function aggregateRequestData(whereClause) {
    return __awaiter(this, void 0, void 0, function* () {
        const requests = yield prisma.request.findMany({
            where: whereClause,
            include: {
                project: {
                    select: { projectName: true }
                }
            }
        });
        const requestReports = requests.map(request => ({
            requestId: request.requestId,
            activityTitle: request.activityTitle || '',
            staff: request.staff || '',
            total: request.total || 0,
            status: request.status || 'Pending',
            approvalLevels: {
                A: request.approval_A,
                B: request.approval_B,
                C: request.approval_C,
                D: request.approval_D,
                E: request.approval_E
            },
            createAt: request.createAt || new Date()
        }));
        const totalRequests = requestReports.length;
        const approvedRequests = requestReports.filter(r => r.approvalLevels.A === 1 &&
            r.approvalLevels.B === 1 &&
            r.approvalLevels.C === 1 &&
            r.approvalLevels.D === 1 &&
            r.approvalLevels.E === 1).length;
        const rejectedRequests = requestReports.filter(r => r.approvalLevels.A === 0 ||
            r.approvalLevels.B === 0 ||
            r.approvalLevels.C === 0 ||
            r.approvalLevels.D === 0 ||
            r.approvalLevels.E === 0).length;
        const pendingRequests = totalRequests - approvedRequests - rejectedRequests;
        const totalAmount = requestReports.reduce((sum, r) => sum + r.total, 0);
        const approvalRateByLevel = {
            A: totalRequests > 0 ? (requestReports.filter(r => r.approvalLevels.A === 1).length / totalRequests) * 100 : 0,
            B: totalRequests > 0 ? (requestReports.filter(r => r.approvalLevels.B === 1).length / totalRequests) * 100 : 0,
            C: totalRequests > 0 ? (requestReports.filter(r => r.approvalLevels.C === 1).length / totalRequests) * 100 : 0,
            D: totalRequests > 0 ? (requestReports.filter(r => r.approvalLevels.D === 1).length / totalRequests) * 100 : 0,
            E: totalRequests > 0 ? (requestReports.filter(r => r.approvalLevels.E === 1).length / totalRequests) * 100 : 0
        };
        return {
            requests: requestReports,
            totalRequests,
            approvedRequests,
            rejectedRequests,
            pendingRequests,
            totalAmount,
            approvalRateByLevel
        };
    });
}
function aggregateRetirementData(whereClause) {
    return __awaiter(this, void 0, void 0, function* () {
        const retirements = yield prisma.retirement.findMany({
            where: whereClause,
            include: {
                request: {
                    select: { activityTitle: true }
                }
            }
        });
        const retirementReports = retirements.map(retirement => {
            const totalBudget = retirement.totalBudget || 0;
            const actualCost = retirement.actualCost || 0;
            const variance = totalBudget - actualCost;
            const variancePercentage = totalBudget > 0 ? (variance / totalBudget) * 100 : 0;
            return {
                retirementId: retirement.retirementId,
                activityLineDescription: retirement.activityLineDescription || '',
                totalBudget,
                actualCost,
                variance,
                variancePercentage,
                status: retirement.status || 'Pending',
                createAt: retirement.createAt || new Date()
            };
        });
        const totalRetirements = retirementReports.length;
        const completedRetirements = retirementReports.filter(r => r.status === 'Completed').length;
        const pendingRetirements = totalRetirements - completedRetirements;
        const totalBudget = retirementReports.reduce((sum, r) => sum + r.totalBudget, 0);
        const totalActualCost = retirementReports.reduce((sum, r) => sum + r.actualCost, 0);
        const totalVariance = totalBudget - totalActualCost;
        const averageVariancePercentage = totalRetirements > 0
            ? retirementReports.reduce((sum, r) => sum + r.variancePercentage, 0) / totalRetirements
            : 0;
        return {
            retirements: retirementReports,
            totalRetirements,
            completedRetirements,
            pendingRetirements,
            totalBudget,
            totalActualCost,
            totalVariance,
            averageVariancePercentage
        };
    });
}
function buildSummary(activityData, requestData, retirementData) {
    const totalBudget = ((activityData === null || activityData === void 0 ? void 0 : activityData.totalBudget) || 0) + ((retirementData === null || retirementData === void 0 ? void 0 : retirementData.totalBudget) || 0);
    const actualCost = ((activityData === null || activityData === void 0 ? void 0 : activityData.totalActualCost) || 0) + ((retirementData === null || retirementData === void 0 ? void 0 : retirementData.totalActualCost) || 0);
    const budgetUtilization = totalBudget > 0 ? (actualCost / totalBudget) * 100 : 0;
    const completionRate = (activityData === null || activityData === void 0 ? void 0 : activityData.totalActivities)
        ? (activityData.completedActivities / activityData.totalActivities) * 100
        : 0;
    const approvalRate = (requestData === null || requestData === void 0 ? void 0 : requestData.totalRequests)
        ? (requestData.approvedRequests / requestData.totalRequests) * 100
        : 0;
    return {
        totalActivities: (activityData === null || activityData === void 0 ? void 0 : activityData.totalActivities) || 0,
        completedActivities: (activityData === null || activityData === void 0 ? void 0 : activityData.completedActivities) || 0,
        totalRequests: (requestData === null || requestData === void 0 ? void 0 : requestData.totalRequests) || 0,
        approvedRequests: (requestData === null || requestData === void 0 ? void 0 : requestData.approvedRequests) || 0,
        rejectedRequests: (requestData === null || requestData === void 0 ? void 0 : requestData.rejectedRequests) || 0,
        pendingRequests: (requestData === null || requestData === void 0 ? void 0 : requestData.pendingRequests) || 0,
        totalRetirements: (retirementData === null || retirementData === void 0 ? void 0 : retirementData.totalRetirements) || 0,
        completedRetirements: (retirementData === null || retirementData === void 0 ? void 0 : retirementData.completedRetirements) || 0,
        totalBudget,
        actualCost,
        budgetUtilization,
        completionRate,
        approvalRate
    };
}
function buildCharts(reportType, activityData, requestData, retirementData) {
    const charts = [];
    if (reportType === 'Activity Summary' && activityData) {
        charts.push({
            type: 'pie',
            title: 'Activity Status Distribution',
            data: {
                labels: ['Completed', 'In Progress', 'Delayed', 'Not Started'],
                values: [
                    activityData.completedActivities,
                    activityData.inProgressActivities,
                    activityData.delayedActivities,
                    activityData.totalActivities - activityData.completedActivities - activityData.inProgressActivities - activityData.delayedActivities
                ],
                colors: ['#27AE60', '#3498DB', '#E74C3C', '#95A5A6']
            }
        });
        charts.push({
            type: 'bar',
            title: 'Budget vs Actual Cost',
            data: {
                labels: ['Total Budget', 'Actual Cost'],
                values: [activityData.totalBudget, activityData.totalActualCost],
                colors: ['#3498DB', '#E67E22']
            }
        });
    }
    if (reportType === 'Request Analysis' && requestData) {
        charts.push({
            type: 'doughnut',
            title: 'Request Status Distribution',
            data: {
                labels: ['Approved', 'Rejected', 'Pending'],
                values: [requestData.approvedRequests, requestData.rejectedRequests, requestData.pendingRequests],
                colors: ['#27AE60', '#E74C3C', '#F39C12']
            }
        });
        charts.push({
            type: 'bar',
            title: 'Approval Rate by Level',
            data: {
                labels: ['Level A', 'Level B', 'Level C', 'Level D', 'Level E'],
                values: [
                    requestData.approvalRateByLevel.A,
                    requestData.approvalRateByLevel.B,
                    requestData.approvalRateByLevel.C,
                    requestData.approvalRateByLevel.D,
                    requestData.approvalRateByLevel.E
                ],
                colors: ['#3498DB']
            }
        });
    }
    if (reportType === 'Retirement Analysis' && retirementData) {
        charts.push({
            type: 'pie',
            title: 'Retirement Status',
            data: {
                labels: ['Completed', 'Pending'],
                values: [retirementData.completedRetirements, retirementData.pendingRetirements],
                colors: ['#27AE60', '#F39C12']
            }
        });
        charts.push({
            type: 'bar',
            title: 'Budget vs Actual Cost',
            data: {
                labels: ['Total Budget', 'Actual Cost', 'Variance'],
                values: [retirementData.totalBudget, retirementData.totalActualCost, Math.abs(retirementData.totalVariance)],
                colors: ['#3498DB', '#E67E22', retirementData.totalVariance >= 0 ? '#27AE60' : '#E74C3C']
            }
        });
    }
    if (reportType === 'Financial Overview') {
        const totalBudget = ((activityData === null || activityData === void 0 ? void 0 : activityData.totalBudget) || 0) + ((retirementData === null || retirementData === void 0 ? void 0 : retirementData.totalBudget) || 0);
        const totalActualCost = ((activityData === null || activityData === void 0 ? void 0 : activityData.totalActualCost) || 0) + ((retirementData === null || retirementData === void 0 ? void 0 : retirementData.totalActualCost) || 0);
        charts.push({
            type: 'bar',
            title: 'Overall Budget Utilization',
            data: {
                labels: ['Total Budget', 'Actual Cost'],
                values: [totalBudget, totalActualCost],
                colors: ['#3498DB', '#E67E22']
            }
        });
        if (requestData) {
            charts.push({
                type: 'doughnut',
                title: 'Request Status Overview',
                data: {
                    labels: ['Approved', 'Rejected', 'Pending'],
                    values: [requestData.approvedRequests, requestData.rejectedRequests, requestData.pendingRequests],
                    colors: ['#27AE60', '#E74C3C', '#F39C12']
                }
            });
        }
    }
    return charts;
}
function buildTables(reportType, activityData, requestData, retirementData) {
    const tables = [];
    if (reportType === 'Activity Summary' && activityData) {
        const topActivities = activityData.activities
            .sort((a, b) => b.totalBudget - a.totalBudget)
            .slice(0, 10);
        tables.push({
            title: 'Top 10 Activities by Budget',
            headers: ['Activity', 'Responsible Person', 'Budget', 'Actual Cost', 'Completion %', 'Status'],
            rows: topActivities.map(a => [
                a.activityStatement.substring(0, 40) + '...',
                a.responsiblePerson,
                `$${a.totalBudget.toLocaleString()}`,
                `$${a.actualCost.toLocaleString()}`,
                `${a.percentageCompletion}%`,
                a.status
            ])
        });
    }
    if (reportType === 'Request Analysis' && requestData) {
        const recentRequests = requestData.requests
            .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
            .slice(0, 15);
        tables.push({
            title: 'Recent Requests',
            headers: ['Activity', 'Staff', 'Amount', 'Status', 'Date'],
            rows: recentRequests.map(r => [
                r.activityTitle.substring(0, 30) + '...',
                r.staff,
                `$${r.total.toLocaleString()}`,
                r.status,
                new Date(r.createAt).toLocaleDateString()
            ])
        });
    }
    if (reportType === 'Retirement Analysis' && retirementData) {
        const topVarianceRetirements = retirementData.retirements
            .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
            .slice(0, 10);
        tables.push({
            title: 'Top 10 Retirements by Variance',
            headers: ['Description', 'Budget', 'Actual Cost', 'Variance', 'Variance %', 'Status'],
            rows: topVarianceRetirements.map(r => [
                r.activityLineDescription.substring(0, 30) + '...',
                `$${r.totalBudget.toLocaleString()}`,
                `$${r.actualCost.toLocaleString()}`,
                `$${r.variance.toLocaleString()}`,
                `${r.variancePercentage.toFixed(2)}%`,
                r.status
            ])
        });
    }
    return tables;
}
function getAllReports(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const whereClause = {};
        if (filters === null || filters === void 0 ? void 0 : filters.projectId)
            whereClause.projectId = filters.projectId;
        if (filters === null || filters === void 0 ? void 0 : filters.reportType)
            whereClause.reportType = filters.reportType;
        const reports = yield prisma.report.findMany({
            where: whereClause,
            include: {
                project: {
                    select: { projectName: true }
                }
            },
            orderBy: {
                createAt: 'desc'
            }
        });
        return {
            success: true,
            message: 'Reports retrieved successfully',
            data: reports
        };
    });
}
function getReportById(reportId) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = yield prisma.report.findUnique({
            where: { reportId },
            include: {
                project: {
                    select: { projectName: true }
                }
            }
        });
        if (!report) {
            throw new Error('Report not found');
        }
        return {
            success: true,
            message: 'Report retrieved successfully',
            data: report
        };
    });
}
function deleteReport(reportId) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = yield prisma.report.findUnique({
            where: { reportId }
        });
        if (!report) {
            throw new Error('Report not found');
        }
        if (report.fileUrl) {
            const fs = require('fs');
            if (fs.existsSync(report.fileUrl)) {
                fs.unlinkSync(report.fileUrl);
            }
        }
        yield prisma.report.delete({
            where: { reportId }
        });
        return {
            success: true,
            message: 'Report deleted successfully'
        };
    });
}
