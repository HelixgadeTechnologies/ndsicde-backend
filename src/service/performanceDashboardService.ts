import { PrismaClient } from "@prisma/client";
import {
    IPerformanceSummary,
    IKpiActualVsTarget,
    IProjectStatusDistribution,
    IProgressTracking,
    IProjectPerformanceDetail,
    IPerformanceDashboardResponse,
    IDateRangeFilter,
} from "../interface/performanceDashboardInterface";

const prisma = new PrismaClient();

// Helper function to build date filter
const buildDateFilter = (filter: IDateRangeFilter) => {
    const dateFilter: any = {};

    if (filter.startDate || filter.endDate) {
        dateFilter.createAt = {};
        if (filter.startDate) dateFilter.createAt.gte = new Date(filter.startDate);
        if (filter.endDate) dateFilter.createAt.lte = new Date(filter.endDate);
    }

    return dateFilter;
};

// Helper function to calculate project health score
const calculateHealthScore = (
    budgetUtilization: number,
    indicatorAchievement: number,
    activityCompletion: number,
    timelinessScore: number
): number => {
    // Normalize budget utilization (ideal is 80-100%, over 100% is bad)
    let budgetScore = 100;
    if (budgetUtilization > 100) {
        budgetScore = Math.max(0, 100 - (budgetUtilization - 100));
    } else if (budgetUtilization < 80) {
        budgetScore = (budgetUtilization / 80) * 100;
    }

    // Weighted calculation
    const healthScore =
        budgetScore * 0.3 +
        indicatorAchievement * 0.4 +
        activityCompletion * 0.2 +
        timelinessScore * 0.1;

    return Math.min(100, Math.max(0, healthScore));
};

// ✅ Get Performance Summary
export const getPerformanceSummary = async (
    filter: IDateRangeFilter = {}
): Promise<IPerformanceSummary> => {
    try {
        const dateFilter = buildDateFilter(filter);
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        // Count total active projects
        const totalActiveProjects = await prisma.project.count({
            where: {
                ...projectFilter,
                status: {
                    notIn: ["Completed", "Cancelled"],
                },
            },
        });

        // Calculate completed KPIs percentage
        const totalIndicators = await prisma.indicator.count();
        const approvedIndicatorReports = await prisma.indicatorReport.count({
            where: {
                ...dateFilter,
                status: "Approved",
            },
        });

        const completedKPIsPercentage =
            totalIndicators > 0 ? (approvedIndicatorReports / totalIndicators) * 100 : 0;

        // Count pending requests
        const pendingRequests = await prisma.request.count({
            where: {
                ...projectFilter,
                ...dateFilter,
                status: "Pending",
            },
        });

        // Calculate budget utilization
        const projects = await prisma.project.findMany({
            where: {
                ...projectFilter,
                status: {
                    notIn: ["Completed", "Cancelled"],
                },
            },
            select: {
                totalBudgetAmount: true,
                request: {
                    select: {
                        retirement: {
                            where: dateFilter,
                            select: {
                                actualCost: true,
                            },
                        },
                    },
                },
            },
        });

        let totalBudget = 0;
        let totalExpenses = 0;

        projects.forEach((project) => {
            totalBudget += parseFloat(project.totalBudgetAmount || "0");
            project.request.forEach((req) => {
                req.retirement.forEach((ret) => {
                    totalExpenses += ret.actualCost || 0;
                });
            });
        });

        const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

        // Calculate average project health score
        const projectHealthScores = await Promise.all(
            projects.map(async (project) => {
                const budget = parseFloat(project.totalBudgetAmount || "0");
                const expenses = project.request.reduce((sum, req) => {
                    return (
                        sum +
                        req.retirement.reduce((retSum, ret) => retSum + (ret.actualCost || 0), 0)
                    );
                }, 0);

                const budgetUtil = budget > 0 ? (expenses / budget) * 100 : 0;

                // Simplified calculation for summary
                return calculateHealthScore(budgetUtil, completedKPIsPercentage, 80, 90);
            })
        );

        const projectHealthScore =
            projectHealthScores.length > 0
                ? projectHealthScores.reduce((sum, score) => sum + score, 0) /
                projectHealthScores.length
                : 0;

        // Calculate percentage from last period
        let percentageFromLastPeriod = 0;
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate);
            const end = new Date(filter.endDate);
            const duration = end.getTime() - start.getTime();

            const previousStart = new Date(start.getTime() - duration);
            const previousEnd = start;

            const previousProjects = await prisma.project.count({
                where: {
                    ...projectFilter,
                    createAt: {
                        gte: previousStart,
                        lt: previousEnd,
                    },
                    status: {
                        notIn: ["Completed", "Cancelled"],
                    },
                },
            });

            if (previousProjects > 0) {
                percentageFromLastPeriod =
                    ((totalActiveProjects - previousProjects) / previousProjects) * 100;
            }
        }

        return {
            totalActiveProjects,
            completedKPIsPercentage: Number(completedKPIsPercentage.toFixed(2)),
            pendingRequests,
            budgetUtilization: Number(budgetUtilization.toFixed(2)),
            projectHealthScore: Number(projectHealthScore.toFixed(2)),
            percentageFromLastPeriod: Number(percentageFromLastPeriod.toFixed(2)),
        };
    } catch (error) {
        console.error("Error in getPerformanceSummary:", error);
        throw error;
    }
};

// ✅ Get KPI Actuals vs Targets
export const getKpiActualsVsTargets = async (
    filter: IDateRangeFilter = {}
): Promise<IKpiActualVsTarget[]> => {
    try {
        const dateFilter = buildDateFilter(filter);

        // Get all indicators with their reports
        const indicators = await prisma.indicator.findMany({
            where: {
                ...(filter.thematicArea ? { thematicAreasOrPillar: filter.thematicArea } : {}),
                ...(filter.resultType ? { result: filter.resultType } : {}),
            },
            select: {
                indicatorId: true,
                statement: true,
                cumulativeTarget: true,
                result: true,
                indicatorReport: {
                    where: dateFilter,
                    select: {
                        cumulativeActual: true,
                        actualDate: true,
                    },
                },
            },
        });

        // Group by quarter
        const quarterlyData: Map<
            string,
            { actual: number; target: number; year: number; count: number }
        > = new Map();

        indicators.forEach((indicator) => {
            indicator.indicatorReport.forEach((report) => {
                if (report.actualDate) {
                    const date = new Date(report.actualDate);
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    const year = date.getFullYear();
                    const key = `${year}-Q${quarter}`;

                    if (!quarterlyData.has(key)) {
                        quarterlyData.set(key, { actual: 0, target: 0, year, count: 0 });
                    }

                    const data = quarterlyData.get(key)!;
                    data.actual += parseFloat(report.cumulativeActual || "0");
                    data.target += indicator.cumulativeTarget || 0;
                    data.count += 1;
                }
            });
        });

        // Convert to array and format
        const kpiData: IKpiActualVsTarget[] = [];

        Array.from(quarterlyData.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(([key, data]) => {
                const quarter = key.split("-")[1];
                const achievementPercentage =
                    data.target > 0 ? (data.actual / data.target) * 100 : 0;

                kpiData.push({
                    period: `Quarter ${quarter.replace("Q", "")}`,
                    year: data.year,
                    actual: Number(data.actual.toFixed(2)),
                    target: Number(data.target.toFixed(2)),
                    achievementPercentage: Number(achievementPercentage.toFixed(2)),
                });
            });

        return kpiData;
    } catch (error) {
        console.error("Error in getKpiActualsVsTargets:", error);
        throw error;
    }
};

// ✅ Get Project Status Distribution
export const getProjectStatusDistribution = async (
    filter: IDateRangeFilter = {}
): Promise<IProjectStatusDistribution[]> => {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        // Get all active projects with their data
        const projects = await prisma.project.findMany({
            where: {
                ...projectFilter,
                status: {
                    notIn: ["Completed", "Cancelled"],
                },
            },
            select: {
                projectId: true,
                totalBudgetAmount: true,
                request: {
                    select: {
                        retirement: {
                            select: {
                                actualCost: true,
                            },
                        },
                    },
                },
                activity: {
                    select: {
                        activityReport: {
                            select: {
                                percentageCompletion: true,
                            },
                        },
                    },
                },
            },
        });

        let onTrackCount = 0;
        let delaysCount = 0;
        let atRiskCount = 0;

        // Categorize each project
        projects.forEach((project) => {
            const budget = parseFloat(project.totalBudgetAmount || "0");
            const expenses = project.request.reduce((sum, req) => {
                return (
                    sum + req.retirement.reduce((retSum, ret) => retSum + (ret.actualCost || 0), 0)
                );
            }, 0);

            const budgetUtil = budget > 0 ? (expenses / budget) * 100 : 0;

            // Calculate activity completion
            let totalCompletion = 0;
            let activityCount = 0;

            project.activity.forEach((activity) => {
                activity.activityReport.forEach((report) => {
                    totalCompletion += report.percentageCompletion || 0;
                    activityCount += 1;
                });
            });

            const avgActivityCompletion =
                activityCount > 0 ? totalCompletion / activityCount : 0;

            // Calculate health score
            const healthScore = calculateHealthScore(budgetUtil, 75, avgActivityCompletion, 85);

            // Categorize
            if (healthScore >= 75) {
                onTrackCount++;
            } else if (healthScore >= 50) {
                delaysCount++;
            } else {
                atRiskCount++;
            }
        });

        const total = projects.length;

        return [
            {
                status: "On Track",
                count: onTrackCount,
                percentage: total > 0 ? Number(((onTrackCount / total) * 100).toFixed(2)) : 0,
            },
            {
                status: "Delays",
                count: delaysCount,
                percentage: total > 0 ? Number(((delaysCount / total) * 100).toFixed(2)) : 0,
            },
            {
                status: "At Risk",
                count: atRiskCount,
                percentage: total > 0 ? Number(((atRiskCount / total) * 100).toFixed(2)) : 0,
            },
        ];
    } catch (error) {
        console.error("Error in getProjectStatusDistribution:", error);
        throw error;
    }
};

// ✅ Get Progress Tracking
export const getProgressTracking = async (
    filter: IDateRangeFilter = {}
): Promise<IProgressTracking> => {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        // Activity Progress
        const activityReports = await prisma.activityReport.findMany({
            where: {
                activity: {
                    project: projectFilter,
                },
            },
            select: {
                percentageCompletion: true,
            },
        });

        const activityPercentage =
            activityReports.length > 0
                ? activityReports.reduce((sum, r) => sum + (r.percentageCompletion || 0), 0) /
                activityReports.length
                : 0;

        // Output Progress (based on activities)
        const outputs = await prisma.output.findMany({
            where: {
                project: projectFilter,
            },
            select: {
                activity: {
                    select: {
                        activityReport: {
                            select: {
                                percentageCompletion: true,
                            },
                        },
                    },
                },
            },
        });

        let outputProgress = 0;
        let outputCount = 0;

        outputs.forEach((output) => {
            let activitySum = 0;
            let actCount = 0;

            output.activity.forEach((activity) => {
                activity.activityReport.forEach((report) => {
                    activitySum += report.percentageCompletion || 0;
                    actCount += 1;
                });
            });

            if (actCount > 0) {
                outputProgress += activitySum / actCount;
                outputCount += 1;
            }
        });

        const outputPercentage = outputCount > 0 ? outputProgress / outputCount : 0;

        // Outcome Progress (based on outputs)
        const outcomes = await prisma.outcome.findMany({
            where: {
                project: projectFilter,
            },
            select: {
                output: {
                    select: {
                        activity: {
                            select: {
                                activityReport: {
                                    select: {
                                        percentageCompletion: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        let outcomeProgress = 0;
        let outcomeCount = 0;

        outcomes.forEach((outcome) => {
            let outputSum = 0;
            let outCount = 0;

            outcome.output.forEach((output) => {
                let activitySum = 0;
                let actCount = 0;

                output.activity.forEach((activity) => {
                    activity.activityReport.forEach((report) => {
                        activitySum += report.percentageCompletion || 0;
                        actCount += 1;
                    });
                });

                if (actCount > 0) {
                    outputSum += activitySum / actCount;
                    outCount += 1;
                }
            });

            if (outCount > 0) {
                outcomeProgress += outputSum / outCount;
                outcomeCount += 1;
            }
        });

        const outcomePercentage = outcomeCount > 0 ? outcomeProgress / outcomeCount : 0;

        // Impact Progress (based on indicator achievement)
        const indicatorReports = await prisma.indicatorReport.findMany({
            where: {
                status: "Approved",
            },
            select: {
                cumulativeActual: true,
                indicator: {
                    select: {
                        cumulativeTarget: true,
                    },
                },
            },
        });

        let impactProgress = 0;
        let impactCount = 0;

        indicatorReports.forEach((report) => {
            const target = report.indicator?.cumulativeTarget || 0;
            const actual = parseFloat(report.cumulativeActual || "0");

            if (target > 0) {
                impactProgress += (actual / target) * 100;
                impactCount += 1;
            }
        });

        const impactPercentage = impactCount > 0 ? impactProgress / impactCount : 0;

        // Determine status based on percentage
        const getStatus = (percentage: number): string => {
            if (percentage >= 80) return "On Track";
            if (percentage >= 50) return "In Progress";
            if (percentage > 0) return "At Risk";
            return "Not Started";
        };

        return {
            activity: {
                percentage: Number(activityPercentage.toFixed(2)),
                status: getStatus(activityPercentage),
            },
            output: {
                percentage: Number(outputPercentage.toFixed(2)),
                status: getStatus(outputPercentage),
            },
            outcomes: {
                percentage: Number(outcomePercentage.toFixed(2)),
                status: getStatus(outcomePercentage),
            },
            impact: {
                percentage: Number(impactPercentage.toFixed(2)),
                status: getStatus(impactPercentage),
            },
        };
    } catch (error) {
        console.error("Error in getProgressTracking:", error);
        throw error;
    }
};

// ✅ Get Project Performance Details
export const getProjectPerformanceDetails = async (
    filter: IDateRangeFilter = {}
): Promise<IProjectPerformanceDetail[]> => {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        const projects = await prisma.project.findMany({
            where: projectFilter,
            select: {
                projectId: true,
                projectName: true,
                status: true,
                startDate: true,
                endDate: true,
                totalBudgetAmount: true,
                request: {
                    select: {
                        retirement: {
                            select: {
                                actualCost: true,
                            },
                        },
                    },
                },
                activity: {
                    select: {
                        activityId: true,
                        activityReport: {
                            select: {
                                percentageCompletion: true,
                            },
                        },
                    },
                },
            },
        });

        // Get indicator data separately
        const indicatorReports = await prisma.indicatorReport.findMany({
            select: {
                status: true,
                cumulativeActual: true,
                indicator: {
                    select: {
                        cumulativeTarget: true,
                    },
                },
            },
        });

        const totalIndicators = await prisma.indicator.count();
        const achievedIndicators = indicatorReports.filter((r) => r.status === "Approved").length;
        const pendingIndicators = indicatorReports.filter((r) => r.status === "Pending").length;

        const indicatorAchievementRate =
            totalIndicators > 0 ? (achievedIndicators / totalIndicators) * 100 : 0;

        const details: IProjectPerformanceDetail[] = projects.map((project) => {
            const budget = parseFloat(project.totalBudgetAmount || "0");
            const expenses = project.request.reduce((sum, req) => {
                return (
                    sum + req.retirement.reduce((retSum, ret) => retSum + (ret.actualCost || 0), 0)
                );
            }, 0);

            const budgetUtilization = budget > 0 ? (expenses / budget) * 100 : 0;

            // Calculate activity completion
            const totalActivities = project.activity.length;
            let completedActivities = 0;

            project.activity.forEach((activity) => {
                const avgCompletion =
                    activity.activityReport.length > 0
                        ? activity.activityReport.reduce(
                            (sum, r) => sum + (r.percentageCompletion || 0),
                            0
                        ) / activity.activityReport.length
                        : 0;

                if (avgCompletion >= 100) {
                    completedActivities++;
                }
            });

            const activityCompletionRate =
                totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

            // Calculate health score
            const healthScore = calculateHealthScore(
                budgetUtilization,
                indicatorAchievementRate,
                activityCompletionRate,
                85
            );

            // Determine risk level
            let riskLevel: "Low" | "Medium" | "High";
            if (healthScore >= 75) {
                riskLevel = "Low";
            } else if (healthScore >= 50) {
                riskLevel = "Medium";
            } else {
                riskLevel = "High";
            }

            return {
                projectId: project.projectId,
                projectName: project.projectName || "Unnamed Project",
                status: project.status || "Unknown",
                startDate: project.startDate,
                endDate: project.endDate,
                totalBudget: Number(budget.toFixed(2)),
                budgetUtilization: Number(budgetUtilization.toFixed(2)),
                healthScore: Number(healthScore.toFixed(2)),
                indicators: {
                    total: totalIndicators,
                    achieved: achievedIndicators,
                    pending: pendingIndicators,
                    achievementRate: Number(indicatorAchievementRate.toFixed(2)),
                },
                activities: {
                    total: totalActivities,
                    completed: completedActivities,
                    completionRate: Number(activityCompletionRate.toFixed(2)),
                },
                riskLevel,
            };
        });

        return details;
    } catch (error) {
        console.error("Error in getProjectPerformanceDetails:", error);
        throw error;
    }
};

// ✅ Get Complete Performance Dashboard
export const getPerformanceDashboard = async (
    filter: IDateRangeFilter = {}
): Promise<IPerformanceDashboardResponse> => {
    try {
        const [summary, kpiActualsVsTargets, statusDistribution, progressTracking, projectDetails] =
            await Promise.all([
                getPerformanceSummary(filter),
                getKpiActualsVsTargets(filter),
                getProjectStatusDistribution(filter),
                getProgressTracking(filter),
                getProjectPerformanceDetails(filter),
            ]);

        return {
            summary,
            kpiActualsVsTargets,
            statusDistribution,
            progressTracking,
            projectDetails,
        };
    } catch (error) {
        console.error("Error in getPerformanceDashboard:", error);
        throw error;
    }
};
