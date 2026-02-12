import { PrismaClient } from '@prisma/client';
import path from 'path';
import {
    ReportGenerationParams,
    ReportData,
    ReportSummary,
    ChartData,
    TableData,
    ReportMetadata,
    AggregatedActivityData,
    AggregatedRequestData,
    AggregatedRetirementData,
    ActivityReportData,
    RequestReportData,
    RetirementReportData
} from '../interface/reportInterface';
import { generatePDFReport, getFileSize } from '../utils/pdfGenerator';

const prisma = new PrismaClient();

/**
 * Main function to generate a complete report
 */
export async function generateReport(params: ReportGenerationParams) {
    try {
        // Set default report name if not provided
        const reportName = params.reportName || `${params.reportType} - ${new Date().toLocaleDateString()}`;

        // Aggregate data based on report type
        const reportData = await aggregateReportData(params);

        // Generate PDF
        const timestamp = Date.now();
        const fileName = `report_${timestamp}.pdf`;
        const outputPath = path.join(process.cwd(), 'reports', fileName);

        const pdfPath = await generatePDFReport({
            reportData,
            outputPath,
            includeCharts: true,
            includeTables: true
        });

        const fileSize = getFileSize(pdfPath);

        // Save report metadata to database
        const savedReport = await prisma.report.create({
            data: {
                reportName,
                reportType: params.reportType,
                projectId: params.projectId && params.projectId.trim() !== '' ? params.projectId : null,
                startDate: params.startDate ? new Date(params.startDate) : null,
                endDate: params.endDate ? new Date(params.endDate) : null,
                selectedMetrics: params.selectedMetrics ? JSON.stringify(params.selectedMetrics) : null,
                generatedBy: params.generatedBy && params.generatedBy.trim() !== '' ? params.generatedBy : null,
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
    } catch (error: any) {
        console.error('Error generating report:', error);
        throw new Error(`Failed to generate report: ${error.message}`);
    }
}

/**
 * Aggregate data based on report type and filters
 */
async function aggregateReportData(params: ReportGenerationParams): Promise<ReportData> {
    const { reportType, projectId, startDate, endDate } = params;

    // Build where clause for filtering
    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (startDate || endDate) {
        whereClause.createAt = {};
        if (startDate) whereClause.createAt.gte = new Date(startDate);
        if (endDate) whereClause.createAt.lte = new Date(endDate);
    }

    // Get project name if filtering by project
    let projectName: string | undefined;
    if (projectId) {
        const project = await prisma.project.findUnique({
            where: { projectId },
            select: { projectName: true }
        });
        projectName = project?.projectName || undefined;
    }

    // Aggregate data based on report type
    let activityData: AggregatedActivityData | null = null;
    let requestData: AggregatedRequestData | null = null;
    let retirementData: AggregatedRetirementData | null = null;

    switch (reportType) {
        case 'Activity Summary':
            activityData = await aggregateActivityData(whereClause);
            break;
        case 'Financial Overview':
            activityData = await aggregateActivityData(whereClause);
            requestData = await aggregateRequestData(whereClause);
            retirementData = await aggregateRetirementData(whereClause);
            break;
        case 'Request Analysis':
            requestData = await aggregateRequestData(whereClause);
            break;
        case 'Retirement Analysis':
            retirementData = await aggregateRetirementData(whereClause);
            break;
    }

    // Build summary
    const summary = buildSummary(activityData, requestData, retirementData);

    // Build charts
    const charts = buildCharts(reportType, activityData, requestData, retirementData);

    // Build tables
    const tables = buildTables(reportType, activityData, requestData, retirementData);

    // Build metadata
    const metadata: ReportMetadata = {
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
}

/**
 * Aggregate activity data
 */
async function aggregateActivityData(whereClause: any): Promise<AggregatedActivityData> {
    const activities = await prisma.activity.findMany({
        where: whereClause,
        include: {
            activityReport: true,
            project: {
                select: { projectName: true }
            }
        }
    });

    const activityReports: ActivityReportData[] = activities.map(activity => {
        const report = activity.activityReport[0]; // Get latest report
        const percentageCompletion = report?.percentageCompletion || 0;

        let status: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed' = 'Not Started';
        if (percentageCompletion === 100) status = 'Completed';
        else if (percentageCompletion > 0) status = 'In Progress';

        // Check if delayed
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
            actualCost: report?.actualCost || 0,
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
}

/**
 * Aggregate request data
 */
async function aggregateRequestData(whereClause: any): Promise<AggregatedRequestData> {
    const requests = await prisma.request.findMany({
        where: whereClause,
        include: {
            project: {
                select: { projectName: true }
            }
        }
    });

    const requestReports: RequestReportData[] = requests.map(request => ({
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

    // Count approvals (1 = Approved, 0 = Rejected, null = Pending)
    const approvedRequests = requestReports.filter(r =>
        r.approvalLevels.A === 1 &&
        r.approvalLevels.B === 1 &&
        r.approvalLevels.C === 1 &&
        r.approvalLevels.D === 1 &&
        r.approvalLevels.E === 1
    ).length;

    const rejectedRequests = requestReports.filter(r =>
        r.approvalLevels.A === 0 ||
        r.approvalLevels.B === 0 ||
        r.approvalLevels.C === 0 ||
        r.approvalLevels.D === 0 ||
        r.approvalLevels.E === 0
    ).length;

    const pendingRequests = totalRequests - approvedRequests - rejectedRequests;
    const totalAmount = requestReports.reduce((sum, r) => sum + r.total, 0);

    // Calculate approval rate by level
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
}

/**
 * Aggregate retirement data
 */
async function aggregateRetirementData(whereClause: any): Promise<AggregatedRetirementData> {
    const retirements = await prisma.retirement.findMany({
        where: whereClause,
        include: {
            request: {
                select: { activityTitle: true }
            }
        }
    });

    const retirementReports: RetirementReportData[] = retirements.map(retirement => {
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
}

/**
 * Build summary from aggregated data
 */
function buildSummary(
    activityData: AggregatedActivityData | null,
    requestData: AggregatedRequestData | null,
    retirementData: AggregatedRetirementData | null
): ReportSummary {
    const totalBudget = (activityData?.totalBudget || 0) + (retirementData?.totalBudget || 0);
    const actualCost = (activityData?.totalActualCost || 0) + (retirementData?.totalActualCost || 0);
    const budgetUtilization = totalBudget > 0 ? (actualCost / totalBudget) * 100 : 0;
    const completionRate = activityData?.totalActivities
        ? (activityData.completedActivities / activityData.totalActivities) * 100
        : 0;
    const approvalRate = requestData?.totalRequests
        ? (requestData.approvedRequests / requestData.totalRequests) * 100
        : 0;

    return {
        totalActivities: activityData?.totalActivities || 0,
        completedActivities: activityData?.completedActivities || 0,
        totalRequests: requestData?.totalRequests || 0,
        approvedRequests: requestData?.approvedRequests || 0,
        rejectedRequests: requestData?.rejectedRequests || 0,
        pendingRequests: requestData?.pendingRequests || 0,
        totalRetirements: retirementData?.totalRetirements || 0,
        completedRetirements: retirementData?.completedRetirements || 0,
        totalBudget,
        actualCost,
        budgetUtilization,
        completionRate,
        approvalRate
    };
}

/**
 * Build charts based on report type
 */
function buildCharts(
    reportType: string,
    activityData: AggregatedActivityData | null,
    requestData: AggregatedRequestData | null,
    retirementData: AggregatedRetirementData | null
): ChartData[] {
    const charts: ChartData[] = [];

    if (reportType === 'Activity Summary' && activityData) {
        // Activity status distribution (Pie Chart)
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

        // Budget vs Actual Cost (Bar Chart)
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
        // Request status distribution (Doughnut Chart)
        charts.push({
            type: 'doughnut',
            title: 'Request Status Distribution',
            data: {
                labels: ['Approved', 'Rejected', 'Pending'],
                values: [requestData.approvedRequests, requestData.rejectedRequests, requestData.pendingRequests],
                colors: ['#27AE60', '#E74C3C', '#F39C12']
            }
        });

        // Approval rate by level (Bar Chart)
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
        // Retirement status (Pie Chart)
        charts.push({
            type: 'pie',
            title: 'Retirement Status',
            data: {
                labels: ['Completed', 'Pending'],
                values: [retirementData.completedRetirements, retirementData.pendingRetirements],
                colors: ['#27AE60', '#F39C12']
            }
        });

        // Budget vs Actual Cost (Bar Chart)
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
        // Combined budget utilization
        const totalBudget = (activityData?.totalBudget || 0) + (retirementData?.totalBudget || 0);
        const totalActualCost = (activityData?.totalActualCost || 0) + (retirementData?.totalActualCost || 0);

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

/**
 * Build tables based on report type
 */
function buildTables(
    reportType: string,
    activityData: AggregatedActivityData | null,
    requestData: AggregatedRequestData | null,
    retirementData: AggregatedRetirementData | null
): TableData[] {
    const tables: TableData[] = [];

    if (reportType === 'Activity Summary' && activityData) {
        // Top 10 activities by budget
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
        // Recent requests
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
        // Retirements with highest variance
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

/**
 * Get all reports
 */
export async function getAllReports(filters?: { projectId?: string; reportType?: string }) {
    const whereClause: any = {};
    if (filters?.projectId) whereClause.projectId = filters.projectId;
    if (filters?.reportType) whereClause.reportType = filters.reportType;

    const reports = await prisma.report.findMany({
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
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string) {
    const report = await prisma.report.findUnique({
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
}

/**
 * Delete report
 */
export async function deleteReport(reportId: string) {
    const report = await prisma.report.findUnique({
        where: { reportId }
    });

    if (!report) {
        throw new Error('Report not found');
    }

    // Delete file if exists
    if (report.fileUrl) {
        const fs = require('fs');
        if (fs.existsSync(report.fileUrl)) {
            fs.unlinkSync(report.fileUrl);
        }
    }

    await prisma.report.delete({
        where: { reportId }
    });

    return {
        success: true,
        message: 'Report deleted successfully'
    };
}
