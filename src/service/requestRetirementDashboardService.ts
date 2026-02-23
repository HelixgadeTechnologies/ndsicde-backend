import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// HELPER: week-over-week percentage change
// ─────────────────────────────────────────────────────────────
function calcPercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
}

function lastWeekRange() {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    return { startOfThisWeek, startOfLastWeek, endOfLastWeek: startOfThisWeek };
}

// ─────────────────────────────────────────────────────────────
// 1. DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
export const getRequestRetirementDashboardStats = async () => {
    const { startOfThisWeek, startOfLastWeek, endOfLastWeek } = lastWeekRange();

    // ── Pending Requests ──
    const pendingNow = await prisma.request.count({
        where: { status: "Pending" },
    });
    const pendingLastWeek = await prisma.request.count({
        where: {
            status: "Pending",
            createAt: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
    });

    // ── Awaiting Approval ──
    // Requests that are neither fully Approved nor Rejected
    const awaitingNow = await prisma.request.count({
        where: {
            status: { notIn: ["Approved", "Rejected"] },
        },
    });
    const awaitingLastWeek = await prisma.request.count({
        where: {
            status: { notIn: ["Approved", "Rejected"] },
            createAt: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
    });

    // ── Retirement Requests ──
    const retirementNow = await prisma.retirement.count();
    const retirementLastWeek = await prisma.retirement.count({
        where: {
            createAt: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
    });

    // ── Status Distribution ──
    const [approvedCount, rejectedCount, pendingCount] = await Promise.all([
        prisma.request.count({ where: { status: "Approved" } }),
        prisma.request.count({ where: { status: "Rejected" } }),
        prisma.request.count({ where: { status: "Pending" } }),
    ]);

    // ── Total Approved Amount (sum of `total` on approved requests) ──
    const approvedAmountAgg = await prisma.request.aggregate({
        where: { status: "Approved" },
        _sum: { total: true },
    });
    const totalApprovedAmount = approvedAmountAgg._sum.total ?? 0;

    // ── Total Retired Amount (sum of `actualCost` across all retirements) ──
    const retiredAmountAgg = await prisma.retirement.aggregate({
        _sum: { actualCost: true },
    });
    const totalRetiredAmount = retiredAmountAgg._sum.actualCost ?? 0;

    // ── Percent Amount Retired ──
    const percentAmountRetired =
        totalApprovedAmount > 0
            ? Number(((totalRetiredAmount / totalApprovedAmount) * 100).toFixed(1))
            : 0;

    return {
        pendingRequests: {
            count: pendingNow,
            percentageChange: calcPercentageChange(pendingNow, pendingLastWeek),
        },
        awaitingApproval: {
            count: awaitingNow,
            percentageChange: calcPercentageChange(awaitingNow, awaitingLastWeek),
        },
        retirementRequests: {
            count: retirementNow,
            percentageChange: calcPercentageChange(retirementNow, retirementLastWeek),
        },
        statusDistribution: {
            approved: approvedCount,
            rejected: rejectedCount,
            pending: pendingCount,
        },
        totalApprovedAmount,
        totalRetiredAmount,
        percentAmountRetired,
    };
};

// ─────────────────────────────────────────────────────────────
// 2. ACTIVITY FINANCIAL LIST (both tabs)
// ─────────────────────────────────────────────────────────────
export type ActivityListType = "request" | "retirement";

export interface ActivityListFilters {
    type: ActivityListType;
    search?: string;
    status?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
}

export const getActivityFinancialList = async (
    filters: ActivityListFilters
) => {
    const { type, search, status, projectId, startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
        dateFilter.createAt = {};
        if (startDate) dateFilter.createAt.gte = new Date(startDate);
        if (endDate) dateFilter.createAt.lte = new Date(endDate);
    }

    // ── REQUEST tab ──
    if (type === "request") {
        const where: any = { ...dateFilter };

        if (status && status !== "All") {
            where.status = status;
        }

        if (projectId && projectId !== "All") {
            where.projectId = projectId;
        }

        if (search) {
            where.OR = [
                { activityTitle: { contains: search } },
                { activityLineDescription: { contains: search } },
                { staff: { contains: search } },
            ];
        }

        return await prisma.request.findMany({
            where,
            include: {
                project: {
                    select: { projectId: true, projectName: true },
                },
            },
            orderBy: { createAt: "desc" },
        });
    }

    // ── RETIREMENT tab ──
    const where: any = { ...dateFilter };

    if (status && status !== "All") {
        where.status = status;
    }

    if (search) {
        where.activityLineDescription = { contains: search };
    }

    const retirements = await prisma.retirement.findMany({
        where,
        include: {
            request: {
                select: {
                    requestId: true,
                    activityTitle: true,
                    projectId: true,
                    project: {
                        select: { projectId: true, projectName: true },
                    },
                },
            },
        },
        orderBy: { createAt: "desc" },
    });

    // Filter by projectId after join (Prisma doesn't allow nested relation filter on optional)
    if (projectId && projectId !== "All") {
        return retirements.filter(
            (r) => r.request?.projectId === projectId
        );
    }

    return retirements;
};
