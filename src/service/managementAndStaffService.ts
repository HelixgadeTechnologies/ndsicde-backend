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




export const getProjectsService = async () => {
    const projects = await prisma.project.findMany({
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


export const getAllIndicatorReportsService = async () => {
    try {
        // Fetch all indicator reports with ResultType included
        const reports = await prisma.indicatorReport.findMany({
            include: {
                // Include indicator for KPI calculation
                indicator: {
                    select: {
                        cumulativeTarget: true
                    }
                },
                // Include ResultType to get resultName
                ResultType: {
                    select: {
                        resultName: true,
                        resultTypeId: true
                    }
                }
            }
        });

        // Format the data
        const formattedReports = reports.map((report) => {
            const actual = Number(report.cumulativeActual || 0);
            const target = Number(report.indicator?.cumulativeTarget || 0);

            // Calculate KPI status
            let kpiStatus = "Not Met";
            if (actual >= target && target > 0) {
                kpiStatus = "Met";
            } else if (target === 0) {
                kpiStatus = "N/A";
            }

            return {
                // From UI screenshot columns
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

                // ResultType field
                resultType: report.ResultType?.resultName || "Not Specified",
                resultTypeId: report.ResultType?.resultTypeId || "",

                // Additional fields from schema
                indicatorSource: report.indicatorSource,
                responsiblePersons: report.responsiblePersons,
                actualDate: report.actualDate,
                cumulativeActual: report.cumulativeActual,
                actualNarrative: report.actualNarrative,
                attachmentUrl: report.attachmentUrl,
                createAt: report.createAt,
                updateAt: report.updateAt,

                // Optional: Include the full ResultType object if needed
                resultTypeDetails: report.ResultType
            };
        });

        return formattedReports;
    } catch (error) {
        console.error('Error fetching all indicator reports:', error);
        throw new Error('Failed to fetch indicator reports');
    }
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
            createAt: true,
            updateAt: true
        }
    });

    return comments;
};

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const getIndicatorReportOverviewService = async (
    indicatorReportId: string
) => {
    const report = await prisma.indicatorReport.findUnique({
        where: { indicatorReportId },
        include: {
            indicator: true,
            indicatorReportComment: {
                orderBy: { createAt: "desc" },
            },
        },
    });

    if (!report || !report.indicator) return null;

    const indicator = report.indicator;

    /**
     * 🔹 Fetch all reports for this indicator (across months)
     */
    const allReports = await prisma.indicatorReport.findMany({
        where: {
            indicatorId: indicator.indicatorId,
        },
        select: {
            cumulativeActual: true,
            actualDate: true,
            createAt: true,
        },
    });

    /**
     * 🔹 Initialize month-aligned arrays
     */
    const budget = Array(12).fill(0);
    const actualSpending = Array(12).fill(0);

    allReports.forEach((r) => {
        const date = r.actualDate ?? r.createAt;
        if (!date) return;

        const monthIndex = new Date(date).getMonth(); // 0–11

        actualSpending[monthIndex] += Number(r.cumulativeActual || 0);

        /**
         * Budget usually does NOT change monthly,
         * but we align it to months for chart consistency
         */
        budget[monthIndex] = Number(indicator.cumulativeTarget || 0);
    });

    /**
     * 🔹 Final UI-friendly structure
     */
    const financialOverview = {
        months: MONTHS,
        budget,
        actualSpending,
    };

    return {
        financialOverview,
        comments: report.indicatorReportComment,
    };
};
