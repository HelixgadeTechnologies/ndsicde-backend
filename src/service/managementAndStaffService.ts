import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardSummaryService = async () => {
    const [
        totalProjects,
        completedProjects,
        onHoldProjects,
        activeProjects,
        activeKpis
    ] = await Promise.all([
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
};

export const getKpiPerformanceService = async (year: number) => {
    const indicators = await prisma.indicator.findMany({
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

    const monthlyData: Record<string, { target: number; actual: number }> = {
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
};




interface ProjectQuery {
    search?: string;
    status?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

import { Prisma } from "@prisma/client";

export const getProjectsService = async (query: ProjectQuery) => {
    const {
        search,
        status,
        category,
        startDate,
        endDate,
        page = 1,
        limit = 10
    } = query;

    // ✅ ensure valid pagination
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const pageLimit = Number(limit) > 0 ? Number(limit) : 10;

    // ✅ strongly-typed Prisma where clause
    const where: Prisma.ProjectWhereInput = {
        ...(status && { status }),
        ...(category && { thematicAreasOrPillar: category }),
        ...(search && {
            projectName: {
                contains: search
            }
        }),
        ...(startDate || endDate
            ? {
                startDate: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(endDate) })
                }
            }
            : {})
    };

    const [data, total] = await Promise.all([
        prisma.project.findMany({
            where,
            skip: (pageNumber - 1) * pageLimit,
            take: pageLimit,
            orderBy: { createAt: "desc" },
            select: {
                projectId: true,
                projectName: true,
                status: true,
                startDate: true,
                endDate: true,
                strategicObjective: {
                    select: { statement: true }
                },
                teamMember: {
                    select: {
                        // ✅ nullable-safe
                        fullName: true
                    }
                }
            }
        }),
        prisma.project.count({ where })
    ]);

    return {
        data,
        pagination: {
            total,
            page: pageNumber,
            limit: pageLimit,
            totalPages: Math.ceil(total / pageLimit)
        }
    };
};




export const getProjectStatusDistributionService = async () => {
    const totalProjects = await prisma.project.count();

    if (totalProjects === 0) return [];

    const grouped = await prisma.project.groupBy({
        by: ["status"],
        _count: {
            status: true
        }
    });

    return grouped.map(item => ({
        label: item.status,
        count: item._count.status,
        percentage: Math.round(
            (item._count.status / totalProjects) * 100
        )
    }));
};


export const getBudgetUtilizationService = async () => {
    const projects = await prisma.project.findMany({
        select: {
            totalBudgetAmount: true
        }
    });

    const totalBudget = projects.reduce(
        (sum, p) => sum + Number(p.totalBudgetAmount || 0),
        0
    );

    if (totalBudget === 0) return [];

    // TEMP LOGIC (replace when expense model exists)
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
};


interface IndicatorReportQuery {
    search?: string;
    status?: string;
    impact?: string;
    output?: string;
    outcome?: string;
    activity?: string;
    page?: number;
    limit?: number;
}

export const getIndicatorReportsService = async (
    query: IndicatorReportQuery
) => {
    const {
        search,
        status,
        impact,
        outcome,
        output,
        page = 1,
        limit = 10
    } = query;

    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const pageLimit = Number(limit) > 0 ? Number(limit) : 10;

    const where: Prisma.IndicatorReportWhereInput = {
        ...(status && { status }),

        ...(search && {
            indicatorStatement: {
                contains: search
            }
        }),

        // ✅ IMPACT filter (ResultType → Impact)
        ...(impact && {
            ResultType: {
                resultTypeId: impact
            }
        }),

        // ✅ OUTCOME filter (IndicatorReport → Indicator → Outcome)
        ...(outcome && {
            Indicator: {
                outcome: {
                    some: {
                        ResultType: {
                            resultTypeId: outcome
                        }
                    }
                }
            }
        }),

        // ✅ OUTPUT filter (IndicatorReport → Indicator → Outcome → Output)
        ...(output && {
            Indicator: {
                outcome: {
                    some: {
                        output: {
                            some: {
                                ResultType: {
                                    resultTypeId: output
                                }
                            }
                        }
                    }
                }
            }
        })
    };

    const [data, total] = await Promise.all([
        prisma.indicatorReport.findMany({
            where,
            skip: (pageNumber - 1) * pageLimit,
            take: pageLimit,
            orderBy: { createAt: "desc" },
            select: {
                indicatorReportId: true,
                indicatorStatement: true,
                thematicAreasOrPillar: true,
                status: true,
                createAt: true,
                cumulativeActual: true,
                indicator: {
                    select: {
                        cumulativeTarget: true
                    }
                }
            }
        }),
        prisma.indicatorReport.count({ where })
    ]);

    const formatted = data.map((report) => {
        const actual = Number(report.cumulativeActual || 0);
        const target = Number(report.indicator?.cumulativeTarget || 0);

        return {
            ...report,
            kpiStatus: actual >= target ? "Met" : "Not Met"
        };
    });

    return {
        data: formatted,
        pagination: {
            total,
            page: pageNumber,
            limit: pageLimit,
            totalPages: Math.ceil(total / pageLimit)
        }
    };
};

// ----------------------
// Service: indicatorReportCommentService.ts
// ----------------------

interface CreateIndicatorReportCommentInput {
    indicatorReportId: string;
    comment: string;
}

export const createIndicatorReportCommentService = async (
    payload: CreateIndicatorReportCommentInput
) => {
    const { indicatorReportId, comment } = payload;

    const newComment = await prisma.indicatorReportComment.create({
        data: {
            indicatorReportId,
            comment
        }
    });

    return newComment;
};

export const getCommentsByIndicatorReportIdService = async (
    indicatorReportId: string
) => {
    const comments = await prisma.indicatorReportComment.findMany({
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
};

export const getAllIndicatorReportCommentsService = async () => {
    // WORKAROUND: missing columns in DB (createAt, updateAt)
    const comments = await prisma.indicatorReportComment.findMany({
        select: {
            indicatorReportCommentId: true,
            indicatorReportId: true,
            comment: true,
            // createAt: true,
            updateAt: true
        }
    });

    return comments;
};