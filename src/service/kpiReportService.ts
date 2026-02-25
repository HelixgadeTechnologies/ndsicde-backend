import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function buildDateFilter(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return {};
    const filter: any = {};
    if (startDate) filter.gte = new Date(startDate);
    if (endDate) filter.lte = new Date(endDate);
    return { createdAt: filter };
}

function buildProjectFilter(projectId?: string) {
    if (!projectId || projectId === "All") return {};
    return { projectId };
}

// ─────────────────────────────────────────────────────────────
// 1. STAT CARDS
// ─────────────────────────────────────────────────────────────
export const getKpiDashboardStats = async (
    userId?: string,
    projectId?: string
) => {
    const baseWhere: any = {};
    if (userId) baseWhere.userId = userId;
    if (projectId && projectId !== "All") baseWhere.projectId = projectId;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Total assigned KPIs
    const totalAssignedKpis = await prisma.kpiReport.count({ where: baseWhere });

    // Distinct project count
    const projectGroups = await prisma.kpiReport.groupBy({
        by: ["projectId"],
        where: { ...baseWhere, projectId: { not: null } },
    });
    const acrossProjects = projectGroups.length;

    // Pending Updates (pending + submitted within last 7 days)
    const pendingUpdates = await prisma.kpiReport.count({
        where: {
            ...baseWhere,
            status: "Pending",
            createdAt: { gte: sevenDaysAgo },
        },
    });

    // Achieved Targets: actualValue >= target
    const allReports = await prisma.kpiReport.findMany({
        where: { ...baseWhere, actualValue: { not: null }, target: { not: null } },
        select: { actualValue: true, target: true },
    });

    const achievedTargets = allReports.filter(
        (r) => (r.actualValue ?? 0) >= (r.target ?? 0)
    ).length;

    const successRate =
        allReports.length > 0
            ? Number(((achievedTargets / allReports.length) * 100).toFixed(1))
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
    const where: any = {
        ...buildProjectFilter(filters?.projectId),
        ...buildDateFilter(filters?.startDate, filters?.endDate),
    };

    // Default: last 6 months if no date filter
    if (!filters?.startDate && !filters?.endDate) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        where.createdAt = { gte: sixMonthsAgo };
    }

    const reports = await prisma.kpiReport.findMany({
        where,
        select: { actualValue: true, target: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });

    // Group by month
    const monthMap: Record<
        string,
        { totalActual: number; totalTarget: number; count: number }
    > = {};

    for (const r of reports) {
        const key = r.createdAt.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        if (!monthMap[key]) {
            monthMap[key] = { totalActual: 0, totalTarget: 0, count: 0 };
        }
        monthMap[key].totalActual += r.actualValue ?? 0;
        monthMap[key].totalTarget += r.target ?? 0;
        monthMap[key].count += 1;
    }

    return Object.entries(monthMap).map(([month, data]) => ({
        month,
        actual: data.count > 0 ? Math.round(data.totalActual / data.count) : 0,
        target: data.count > 0 ? Math.round(data.totalTarget / data.count) : 0,
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
    const where: any = {
        ...buildProjectFilter(filters?.projectId),
        ...buildDateFilter(filters?.startDate, filters?.endDate),
        kpiType: { not: null },
    };

    const groups = await prisma.kpiReport.groupBy({
        by: ["kpiType"],
        where,
        _count: { _all: true },
    });

    const total = groups.reduce((sum, g) => sum + g._count._all, 0);

    return groups.map((g) => ({
        type: g.kpiType,
        count: g._count._all,
        percentage:
            total > 0 ? Number(((g._count._all / total) * 100).toFixed(1)) : 0,
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
        ...buildProjectFilter(filters?.projectId),
        ...buildDateFilter(filters?.startDate, filters?.endDate),
    };

    if (filters?.status && filters.status !== "All") {
        where.status = filters.status;
    }

    if (filters?.search) {
        where.kpiName = { contains: filters.search };
    }

    return await prisma.kpiReport.findMany({
        where,
        select: {
            kpiReportId: true,
            kpiName: true,
            kpiType: true,
            status: true,
            baseline: true,
            target: true,
            actualValue: true,
            observation: true,
            evidence: true,
            createdAt: true,
            updatedAt: true,
            project: { select: { projectId: true, projectName: true } },
            user: { select: { userId: true, fullName: true, email: true } },
            strategicObjective: {
                select: { strategicObjectiveId: true, statement: true },
            },
            kpiReview: {
                select: {
                    kpiReviewId: true,
                    comment: true,
                    reviewedBy: true,
                    reviewedAt: true,
                },
                orderBy: { reviewedAt: "desc" },
                take: 1,
            },
        },
        orderBy: { createdAt: "desc" },
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
        ...buildProjectFilter(filters?.projectId),
        ...buildDateFilter(filters?.startDate, filters?.endDate),
    };

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status && filters.status !== "All") where.status = filters.status;
    if (filters?.search) where.kpiName = { contains: filters.search };

    return await prisma.kpiReport.findMany({
        where,
        select: {
            kpiReportId: true,
            kpiName: true,
            kpiType: true,
            baseline: true,
            target: true,
            actualValue: true,
            status: true,
            createdAt: true,
            project: { select: { projectId: true, projectName: true } },
            strategicObjective: { select: { strategicObjectiveId: true, statement: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

// ─────────────────────────────────────────────────────────────
// 4c. GET SINGLE KPI REPORT BY ID (for edit/view)
// ─────────────────────────────────────────────────────────────
export const getKpiReportById = async (kpiReportId: string) => {
    return await prisma.kpiReport.findUnique({
        where: { kpiReportId },
        select: {
            kpiReportId: true,
            kpiName: true,
            kpiType: true,
            baseline: true,
            target: true,
            actualValue: true,
            status: true,
            observation: true,
            evidence: true,
            createdAt: true,
            updatedAt: true,
            project: { select: { projectId: true, projectName: true } },
            user: { select: { userId: true, fullName: true, email: true } },
            strategicObjective: { select: { strategicObjectiveId: true, statement: true } },
            kpiReview: {
                select: { kpiReviewId: true, comment: true, reviewedBy: true, reviewedAt: true },
                orderBy: { reviewedAt: "desc" },
            },
        },
    });
};

// ─────────────────────────────────────────────────────────────
// 5. CREATE / UPDATE KPI REPORT
// ─────────────────────────────────────────────────────────────
export interface IKpiReportPayload {
    kpiReportId?: string;
    projectId?: string;
    userId?: string;
    strategicObjectiveId?: string;
    kpiName?: string;
    kpiType?: string;
    baseline?: number;
    target?: number;
    actualValue?: number;
    status?: string;
    observation?: string;
    evidence?: string;
}

export const createOrUpdateKpiReport = async (
    payload: IKpiReportPayload,
    isCreate: boolean
) => {
    // Use undefined instead of null for optional fields to let Prisma handle them
    const data = {
        projectId: payload.projectId ?? undefined,
        userId: payload.userId ?? undefined,
        strategicObjectiveId: payload.strategicObjectiveId ?? undefined,
        kpiName: payload.kpiName ?? undefined,
        kpiType: payload.kpiType ?? undefined,
        baseline: payload.baseline ?? undefined,
        target: payload.target ?? undefined,
        actualValue: payload.actualValue ?? undefined,
        status: payload.status ?? undefined,
        observation: payload.observation ?? undefined,
        evidence: payload.evidence ?? undefined,
    };

    if (isCreate) {
        return await prisma.kpiReport.create({ data });
    }

    if (!payload.kpiReportId) {
        throw new Error("kpiReportId is required for update");
    }

    return await prisma.kpiReport.update({
        where: { kpiReportId: payload.kpiReportId },
        data: { ...data, updatedAt: new Date() },
    });
};

// ─────────────────────────────────────────────────────────────
// 6. DELETE KPI REPORT
// ─────────────────────────────────────────────────────────────
export const deleteKpiReport = async (kpiReportId: string) => {
    return await prisma.$transaction(async (tx) => {
        // Delete child KpiReview records first
        await tx.kpiReview.deleteMany({ where: { kpiReportId } });
        return await tx.kpiReport.delete({ where: { kpiReportId } });
    });
};
