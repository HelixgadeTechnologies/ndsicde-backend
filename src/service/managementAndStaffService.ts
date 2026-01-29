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