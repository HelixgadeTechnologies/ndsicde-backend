import { prisma } from "../lib/prisma";

// ─────────────────────────────────────────────────────────────
// 1. STAT CARDS
// ─────────────────────────────────────────────────────────────
export const getKpiDashboardStats = async (
    _userId?: string,
    _projectId?: string
) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Total assigned KPIs = IndicatorReport entries from Survey Data with a linked orgKpiId
    const totalAssignedKpis = await prisma.indicatorReport.count({
        where: {
            indicatorSource: "Survey Data",
            orgKpiId: { not: null },
        },
    });

    // Distinct projects linked via: IndicatorReport → ResultType → Impact/Outcome/Output → Project
    const reportResultTypes = await prisma.indicatorReport.findMany({
        where: {
            indicatorSource: "Survey Data",
            orgKpiId: { not: null },
            resultTypeId: { not: null },
        },
        select: { resultTypeId: true },
    });

    const resultTypeIds = [
        ...new Set(reportResultTypes.map((r) => r.resultTypeId as string)),
    ];

    const [impactProjects, outcomeProjects, outputProjects] = await Promise.all([
        prisma.impact.findMany({
            where: { resultTypeId: { in: resultTypeIds }, projectId: { not: null } },
            select: { projectId: true },
        }),
        prisma.outcome.findMany({
            where: { resultTypeId: { in: resultTypeIds }, projectId: { not: null } },
            select: { projectId: true },
        }),
        prisma.output.findMany({
            where: { resultTypeId: { in: resultTypeIds }, projectId: { not: null } },
            select: { projectId: true },
        }),
    ]);

    const distinctProjectIds = new Set([
        ...impactProjects.map((i) => i.projectId),
        ...outcomeProjects.map((o) => o.projectId),
        ...outputProjects.map((o) => o.projectId),
    ]);
    const acrossProjects = distinctProjectIds.size;

    // Pending Updates from IndicatorReport
    const pendingUpdates = await prisma.indicatorReport.count({
        where: {
            status: "PENDING",
            createAt: { gte: sevenDaysAgo },
        },
    });

    // Fetch all Indicators that have a cumulative target
    const indicators = await prisma.indicator.findMany({
        where: { cumulativeTarget: { not: null } },
        select: { orgKpiId: true, cumulativeTarget: true },
    });

    // Actual values come from IndicatorReport (Survey Data) matched by orgKpiId
    const surveyReports = await prisma.indicatorReport.findMany({
        where: { indicatorSource: "Survey Data" },
        select: { orgKpiId: true, cumulativeActual: true },
    });

    // Sum cumulativeActual per orgKpiId
    const actualByOrgKpiId: Record<string, number> = {};
    for (const report of surveyReports) {
        if (report.orgKpiId) {
            actualByOrgKpiId[report.orgKpiId] =
                (actualByOrgKpiId[report.orgKpiId] ?? 0) +
                Number(report.cumulativeActual ?? 0);
        }
    }

    // Achieved Targets: summed actual >= cumulativeTarget
    const achievedTargets = indicators.filter((ind) => {
        const actual = actualByOrgKpiId[ind.orgKpiId ?? ""] ?? 0;
        return actual >= (ind.cumulativeTarget ?? 0);
    }).length;

    const successRate =
        indicators.length > 0
            ? Number(((achievedTargets / indicators.length) * 100).toFixed(1))
            : 0;

    return {
        totalAssignedKpis,
        acrossProjects,
        pendingUpdates,
        achievedTargets,
        successRate,
    };
};

// ─────────────────────────────────────────────────────────────
// 2. KPI PERFORMANCE CHART (Target vs Actual by Month)
// ─────────────────────────────────────────────────────────────
export const getKpiPerformanceChart = async (filters?: {
    projectId?: string;
    startDate?: string;
    endDate?: string;
}) => {
    // Build date filter against IndicatorReport.createAt
    const dateWhere: any = {};
    if (filters?.startDate || filters?.endDate) {
        dateWhere.createAt = {};
        if (filters?.startDate) dateWhere.createAt.gte = new Date(filters.startDate);
        if (filters?.endDate) dateWhere.createAt.lte = new Date(filters.endDate);
    } else {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        dateWhere.createAt = { gte: sixMonthsAgo };
    }

    // Fetch Survey Data reports with their orgKpiId and createAt for monthly grouping
    const indicatorReports = await prisma.indicatorReport.findMany({
        where: {
            indicatorSource: "Survey Data",
            orgKpiId: { not: null },
            ...dateWhere,
        },
        select: { orgKpiId: true, cumulativeActual: true, createAt: true },
        orderBy: { createAt: "asc" },
    });

    // Fetch cumulativeTarget from Kpi table for each distinct orgKpiId
    const distinctOrgKpiIds = [...new Set(
        indicatorReports.map((r) => r.orgKpiId as string)
    )];

    const kpis = await prisma.kpi.findMany({
        where: { kpiId: { in: distinctOrgKpiIds } },
        select: { kpiId: true, cumulativeTarget: true },
    });

    const targetByKpiId: Record<string, number> = {};
    for (const kpi of kpis) {
        targetByKpiId[kpi.kpiId] = kpi.cumulativeTarget ?? 0;
    }

    // Group by month — sum cumulativeActual and corresponding cumulativeTarget
    const monthMap: Record<string, { totalActual: number; totalTarget: number }> = {};

    for (const r of indicatorReports) {
        const key = (r.createAt as Date).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        if (!monthMap[key]) monthMap[key] = { totalActual: 0, totalTarget: 0 };
        monthMap[key].totalActual += Number(r.cumulativeActual ?? 0);
        monthMap[key].totalTarget += targetByKpiId[r.orgKpiId as string] ?? 0;
    }

    return Object.entries(monthMap).map(([month, data]) => ({
        month,
        actual: Math.round(data.totalActual),
        target: Math.round(data.totalTarget),
    }));
};

// ─────────────────────────────────────────────────────────────
// 3. KPI TYPE DISTRIBUTION (Pie Chart)
// ─────────────────────────────────────────────────────────────
export const getKpiTypeDistribution = async (filters?: {
    projectId?: string;
    startDate?: string;
    endDate?: string;
}) => {
    // Build date filter against IndicatorReport.createAt
    const dateWhere: any = {};
    if (filters?.startDate || filters?.endDate) {
        dateWhere.createAt = {};
        if (filters?.startDate) dateWhere.createAt.gte = new Date(filters.startDate);
        if (filters?.endDate) dateWhere.createAt.lte = new Date(filters.endDate);
    }

    // Get all Survey Data reports with their orgKpiId
    const indicatorReports = await prisma.indicatorReport.findMany({
        where: {
            indicatorSource: "Survey Data",
            orgKpiId: { not: null },
            ...dateWhere,
        },
        select: { orgKpiId: true },
    });

    if (indicatorReports.length === 0) return [];

    // Lookup Kpi.type for each distinct orgKpiId
    const distinctOrgKpiIds = [
        ...new Set(indicatorReports.map((r) => r.orgKpiId as string)),
    ];

    const kpis = await prisma.kpi.findMany({
        where: { kpiId: { in: distinctOrgKpiIds }, type: { not: null } },
        select: { kpiId: true, type: true },
    });

    const typeByKpiId: Record<string, string> = {};
    for (const kpi of kpis) {
        typeByKpiId[kpi.kpiId] = kpi.type as string;
    }

    // Count reports per KPI type
    const typeCountMap: Record<string, number> = {};
    for (const r of indicatorReports) {
        const kpiType = typeByKpiId[r.orgKpiId as string];
        if (!kpiType) continue;
        typeCountMap[kpiType] = (typeCountMap[kpiType] ?? 0) + 1;
    }

    const total = Object.values(typeCountMap).reduce((sum, c) => sum + c, 0);

    return Object.entries(typeCountMap).map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
};

// ─────────────────────────────────────────────────────────────
// 4. RECENT SUBMISSIONS TABLE
// ─────────────────────────────────────────────────────────────
export const getKpiRecentSubmissions = async (filters?: {
    search?: string;
    status?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
}) => {
    const where: any = {
        indicatorSource: "Survey Data",
        orgKpiId: { not: null },
    };

    if (filters?.status && filters.status !== "All") where.status = filters.status;
    if (filters?.search) where.indicatorStatement = { contains: filters.search };
    if (filters?.startDate || filters?.endDate) {
        where.createAt = {};
        if (filters?.startDate) where.createAt.gte = new Date(filters.startDate);
        if (filters?.endDate) where.createAt.lte = new Date(filters.endDate);
    }

    // IndicatorReport has no direct projectId — resolve via Project → Impact/Outcome/Output → ResultType
    if (filters?.projectId && filters.projectId !== "All") {
        const [impacts, outcomes, outputs] = await Promise.all([
            prisma.impact.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
            prisma.outcome.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
            prisma.output.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
        ]);

        const resultTypeIds = [
            ...new Set([
                ...impacts.map((i) => i.resultTypeId as string),
                ...outcomes.map((o) => o.resultTypeId as string),
                ...outputs.map((o) => o.resultTypeId as string),
            ]),
        ];

        where.resultTypeId = { in: resultTypeIds };
    }

    const reports = await prisma.indicatorReport.findMany({
        where,
        select: {
            indicatorReportId: true,
            indicatorStatement: true,
            orgKpiId: true,
            status: true,
            cumulativeActual: true,
            actualNarrative: true,
            attachmentUrl: true,
            createAt: true,
            updateAt: true,
            indicatorReportComment: {
                select: {
                    indicatorReportCommentId: true,
                    comment: true,
                    createAt: true,
                },
                orderBy: { createAt: "desc" },
                take: 1,
            },
        },
        orderBy: { createAt: "desc" },
    });

    if (reports.length === 0) return [];

    // Enrich with Kpi data: type, baseline, target, strategicObjective
    const distinctOrgKpiIds = [
        ...new Set(reports.map((r) => r.orgKpiId as string)),
    ];

    const kpis = await prisma.kpi.findMany({
        where: { kpiId: { in: distinctOrgKpiIds } },
        select: {
            kpiId: true,
            type: true,
            cumulativeValue: true,
            cumulativeTarget: true,
            strategicObjective: {
                select: { strategicObjectiveId: true, statement: true },
            },
        },
    });

    const kpiMap: Record<string, (typeof kpis)[0]> = {};
    for (const kpi of kpis) kpiMap[kpi.kpiId] = kpi;

    return reports.map((r) => {
        const kpi = kpiMap[r.orgKpiId as string];
        return {
            indicatorReportId: r.indicatorReportId,
            kpiName: r.indicatorStatement,
            kpiType: kpi?.type ?? null,
            status: r.status,
            baseline: kpi?.cumulativeValue ?? null,
            target: kpi?.cumulativeTarget ?? null,
            actualValue: r.cumulativeActual,
            observation: r.actualNarrative,
            evidence: r.attachmentUrl,
            createdAt: r.createAt,
            updatedAt: r.updateAt,
            strategicObjective: kpi?.strategicObjective ?? null,
            kpiReview: r.indicatorReportComment[0] ?? null,
        };
    });
};

// ─────────────────────────────────────────────────────────────
// 4b. ASSIGNED KPI LIST (Table Page - Image 1)
// ─────────────────────────────────────────────────────────────
export const getAssignedKpiList = async (filters?: {
    userId?: string;
    projectId?: string;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}) => {
    const where: any = {
        indicatorSource: "Survey Data",
        orgKpiId: { not: null },
    };

    if (filters?.status && filters.status !== "All") where.status = filters.status;
    if (filters?.search) where.indicatorStatement = { contains: filters.search };
    if (filters?.startDate || filters?.endDate) {
        where.createAt = {};
        if (filters?.startDate) where.createAt.gte = new Date(filters.startDate);
        if (filters?.endDate) where.createAt.lte = new Date(filters.endDate);
    }

    // IndicatorReport has no direct projectId — resolve via Project → Impact/Outcome/Output → ResultType
    if (filters?.projectId && filters.projectId !== "All") {
        const [impacts, outcomes, outputs] = await Promise.all([
            prisma.impact.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
            prisma.outcome.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
            prisma.output.findMany({
                where: { projectId: filters.projectId, resultTypeId: { not: null } },
                select: { resultTypeId: true },
            }),
        ]);

        const resultTypeIds = [
            ...new Set([
                ...impacts.map((i) => i.resultTypeId as string),
                ...outcomes.map((o) => o.resultTypeId as string),
                ...outputs.map((o) => o.resultTypeId as string),
            ]),
        ];

        where.resultTypeId = { in: resultTypeIds };
    }

    const reports = await prisma.indicatorReport.findMany({
        where,
        select: {
            indicatorReportId: true,
            indicatorStatement: true,
            orgKpiId: true,
            status: true,
            cumulativeActual: true,
            createAt: true,
        },
        orderBy: { createAt: "desc" },
    });

    if (reports.length === 0) return [];

    // Enrich with Kpi: type, baseline, target, strategicObjective
    const distinctOrgKpiIds = [
        ...new Set(reports.map((r) => r.orgKpiId as string)),
    ];

    const kpis = await prisma.kpi.findMany({
        where: { kpiId: { in: distinctOrgKpiIds } },
        select: {
            kpiId: true,
            type: true,
            cumulativeValue: true,
            cumulativeTarget: true,
            strategicObjective: {
                select: { strategicObjectiveId: true, statement: true },
            },
        },
    });

    const kpiMap: Record<string, (typeof kpis)[0]> = {};
    for (const kpi of kpis) kpiMap[kpi.kpiId] = kpi;

    return reports.map((r) => {
        const kpi = kpiMap[r.orgKpiId as string];
        return {
            indicatorReportId: r.indicatorReportId,
            kpiName: r.indicatorStatement,
            kpiType: kpi?.type ?? null,
            baseline: kpi?.cumulativeValue ?? null,
            target: kpi?.cumulativeTarget ?? null,
            actualValue: r.cumulativeActual,
            status: r.status,
            createdAt: r.createAt,
            strategicObjective: kpi?.strategicObjective ?? null,
        };
    });
};