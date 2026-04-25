import { IIndicatorView } from "../interface/projectManagementInterface";
import { IKpiDashboardData, IKpiDashboardOutput } from '../interface/dashboardInterface';
import { prisma } from '../lib/prisma';


// ─── Utility: convert BigInt values to Number recursively ────────────────────
function normalizeBigInts<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts) as any;
    }

    if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data;
        }

        const normalized: any = {};
        for (const key in data) {
            const value = (data as any)[key];

            if (typeof value === 'bigint') {
                normalized[key] = Number(value);
            } else if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                normalized[key] = value;
            } else {
                normalized[key] = normalizeBigInts(value);
            }
        }
        return normalized;
    }

    return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT RESULT DASHBOARD
// GET /result_dashboard/:projectId  (single-project indicator data)
// ─────────────────────────────────────────────────────────────────────────────
export async function getResultDashboardData(projectId: string) {

    // ── 1. Fetch all indicators for this project via the existing DB view ──────
    const indicatorRows = await prisma.$queryRaw<IIndicatorView[]>`
        SELECT * FROM indicator_view WHERE resultProjectId = ${projectId};
    `;

    if (indicatorRows.length === 0) {
        throw new Error("No indicator found for this project");
    }

    // Unique indicator IDs belonging to this project
    const indicatorIds = [...new Set(indicatorRows.map((r) => r.indicatorId))];

    // ── 2. Fetch IndicatorDisaggregation (targets) for those indicators ────────
    const allDisaggregations = await prisma.indicatorDisaggregation.findMany({
        where: { indicatorId: { in: indicatorIds } },
    });

    // ── 3. Fetch all APPROVED IndicatorReports with their disaggregations ──────
    const approvedReports = await prisma.indicatorReport.findMany({
        where: {
            indicatorId: { in: indicatorIds },
            status: "APPROVE",
        },
        include: { IndicatorReportDisaggregation: true },
    });

    // ── 4. Build lookup maps ───────────────────────────────────────────────────
    // disaggregations per indicator
    const disaggByIndicator = new Map<string, typeof allDisaggregations>();
    for (const d of allDisaggregations) {
        if (!disaggByIndicator.has(d.indicatorId)) disaggByIndicator.set(d.indicatorId, []);
        disaggByIndicator.get(d.indicatorId)!.push(d);
    }

    // approved report disaggregations per indicator
    const reportDisaggByIndicator = new Map<string, { type: string; category: string; actual: number | null }[]>();
    for (const report of approvedReports) {
        const iId = report.indicatorId!;
        if (!reportDisaggByIndicator.has(iId)) reportDisaggByIndicator.set(iId, []);
        for (const rd of report.IndicatorReportDisaggregation) {
            reportDisaggByIndicator.get(iId)!.push({
                type: rd.type.toUpperCase(),
                category: rd.category.toUpperCase(),
                actual: rd.actual,
            });
        }
    }

    // ── 5. INDICATOR_STATUS – total / pending / approved / rejected ───────────
    const allReportCounts = await prisma.indicatorReport.groupBy({
        by: ["status"],
        where: { indicatorId: { in: indicatorIds } },
        _count: { status: true },
    });

    const countByStatus = Object.fromEntries(
        allReportCounts.map((r) => [r.status ?? "null", r._count.status])
    );

    const INDICATOR_STATUS = [{
        totalSubmitted: (countByStatus["PENDING"] ?? 0) + (countByStatus["APPROVE"] ?? 0) + (countByStatus["DECLINE"] ?? 0),
        totalPending: countByStatus["PENDING"] ?? 0,
        totalApproved: countByStatus["APPROVE"] ?? 0,
        totalDeclined: countByStatus["DECLINE"] ?? 0,
    }];

    // ── 6. Per-indicator: Baseline / Target / Actual ──────────────────────────
    const INDICATOR_PERFORMANCE: any[] = [];
    const performancePercentages: number[] = [];

    // Use the first row per unique indicator for metadata (statement etc.)
    const uniqueIndicatorMeta = new Map<string, IIndicatorView>();
    for (const row of indicatorRows) {
        if (!uniqueIndicatorMeta.has(row.indicatorId)) {
            uniqueIndicatorMeta.set(row.indicatorId, row);
        }
    }

    for (const [indicatorId, meta] of uniqueIndicatorMeta.entries()) {
        const disaggs = disaggByIndicator.get(indicatorId) ?? [];
        const reportDisaggs = reportDisaggByIndicator.get(indicatorId) ?? [];

        // Baseline – from indicator.cumulativeValue
        const baseline = meta.cumulativeValue ?? 0;

        // Determine disaggregation type
        const disaggType = disaggs.length > 0 ? disaggs[0].type.toUpperCase() : null;

        let target = 0;
        let actual = 0;

        // Both GENDER and all other types: straightforward sum
        target = disaggs.reduce((sum, d) => sum + (d.target ?? 0), 0);
        actual = reportDisaggs.reduce((sum, rd) => sum + (rd.actual ?? 0), 0);

        const achievementPercentage = target > 0 ? (actual / target) * 100 : 0;
        performancePercentages.push(achievementPercentage);

        INDICATOR_PERFORMANCE.push({
            indicatorId,
            statement: meta.statement ?? null,
            resultTypeId: meta.resultTypeId ?? null,
            resultName: meta.resultName ?? null,
            resultProjectId: meta.resultProjectId ?? projectId,
            baseline,
            cumulativeTargetValue: target,
            cumulativeActualValue: actual,
            achievementPercentage: Number(achievementPercentage.toFixed(2)),
        });
    }

    // ── 7. Average project performance across all indicators ──────────────────
    const avgPerformance =
        performancePercentages.length > 0
            ? performancePercentages.reduce((s, p) => s + p, 0) / performancePercentages.length
            : 0;

    const AVERAGE_INDICATOR_PERFORMANCE = [{
        avgProjectPerformance: Number(avgPerformance.toFixed(2)),
    }];

    // ── 8. INDICATOR_DATA – disaggregation breakdown per indicator ────────────
    const INDICATOR_DATA: IKpiDashboardData[] = [];

    for (const [indicatorId, meta] of uniqueIndicatorMeta.entries()) {
        const disaggs = disaggByIndicator.get(indicatorId) ?? [];
        const reportDisaggs = reportDisaggByIndicator.get(indicatorId) ?? [];
        const disaggType = disaggs.length > 0 ? disaggs[0].type.toUpperCase() : null;

        if (!disaggType) continue;

        const data: IKpiDashboardData = {
            projectId: meta.resultProjectId as string ?? projectId,
            resultTypeId: meta.resultTypeId as string ?? "",
            disaggregationId: meta.disaggregationId as string ?? "",
            data: [],
        };

        if (disaggType === "GENDER") {
            const maleTarget = disaggs.find((d) => d.category.toUpperCase() === "MALE")?.target ?? 0;
            const femaleTarget = disaggs.find((d) => d.category.toUpperCase() === "FEMALE")?.target ?? 0;

            const maleActual = reportDisaggs
                .filter((rd) => rd.category.toUpperCase() === "MALE")
                .reduce((s, rd) => s + (rd.actual ?? 0), 0);
            const femaleActual = reportDisaggs
                .filter((rd) => rd.category.toUpperCase() === "FEMALE")
                .reduce((s, rd) => s + (rd.actual ?? 0), 0);

            const achMale = maleTarget > 0 ? (maleActual / maleTarget) * 100 : 0;
            const achFemale = femaleTarget > 0 ? (femaleActual / femaleTarget) * 100 : 0;

            data.data = [{
                genderDisaggregationId: indicatorId,
                targetMale: maleTarget,
                targetFemale: femaleTarget,
                actualMale: maleActual,
                actualFemale: femaleActual,
                disaggregationId: meta.disaggregationId,
                indicatorId,
                resultTypeId: meta.resultTypeId,
                resultName: meta.resultName,
                result: meta.result,
                resultProjectId: meta.resultProjectId ?? projectId,
                achievementPercentageMale: Number(achMale.toFixed(2)),
                achievementPercentageFemale: Number(achFemale.toFixed(2)),
            }];
            INDICATOR_DATA.push(data);

        } else {
            const breakdown = disaggs.map((d) => {
                const catActual = reportDisaggs
                    .filter((rd) => rd.category.toUpperCase() === d.category.toUpperCase())
                    .reduce((s, rd) => s + (rd.actual ?? 0), 0);
                const ach = (d.target ?? 0) > 0 ? (catActual / (d.target ?? 1)) * 100 : 0;

                return {
                    disaggregationId: d.indicatorDisaggregationId,
                    category: d.category,
                    categoryType: d.type,
                    targetCount: d.target ?? 0,
                    actualCount: catActual,
                    indicatorId,
                    resultTypeId: meta.resultTypeId,
                    resultName: meta.resultName,
                    result: meta.result,
                    resultProjectId: meta.resultProjectId ?? projectId,
                    achievementPercentage: Number(ach.toFixed(2)),
                };
            });

            data.data = breakdown;
            if (breakdown.length > 0) INDICATOR_DATA.push(data);
        }
    }

    // ── 9. Assemble final response ────────────────────────────────────────────
    const section: IKpiDashboardOutput = {
        INDICATOR_STATUS,
        INDICATOR_DATA,
        AVERAGE_INDICATOR_PERFORMANCE,
        INDICATOR_PERFORMANCE,
    };

    return section;
}


// ─────────────────────────────────────────────────────────────────────────────
// ORG KPI DASHBOARD FILTERS
// ─────────────────────────────────────────────────────────────────────────────
export interface IOrgKpiDashboardFilters {
    thematicArea?: string;
    strategicObjectiveId?: string;
    resultLevel?: string;       // "Impact" | "Outcome" | "Output"
    kpiId?: string;
    startDate?: Date;
    endDate?: Date;
    disaggregationType?: string; // e.g. "GENDER", "STATE"
    year?: number;              // filter chart to a specific year
}

export async function getOrgKpiDashboardData(filters: IOrgKpiDashboardFilters = {}) {
    const { thematicArea, strategicObjectiveId, resultLevel, kpiId, startDate, endDate, disaggregationType, year } = filters;

    // ── 1. Fetch KPIs with their Strategic Objectives (apply filters) ──────────
    const kpis = await prisma.kpi.findMany({
        where: {
            ...(kpiId               ? { kpiId }                                              : {}),
            ...(strategicObjectiveId ? { strategicObjectiveId }                               : {}),
            ...(resultLevel          ? { type: resultLevel }                                  : {}),
            ...(thematicArea         ? { strategicObjective: { thematicAreas: thematicArea } } : {}),
        },
        include: { strategicObjective: true },
    });

    if (kpis.length === 0) {
        return {
            THEMATIC_AREA_SUMMARY: [],
            KPI_OVERVIEW_CHART:    { monthly: [], quarterly: [], baseline: 0, annualTarget: 0 },
            KPI_TABLE_DATA:        [],
            PROJECT_INDICATOR_PERFORMANCE: { kpis: [], averagePerformance: 0 },
        };
    }

    const kpiIds = kpis.map((k) => k.kpiId);

    // ── 2. Fetch approved IndicatorReports that link to these org KPIs ─────────
    const reports = await prisma.indicatorReport.findMany({
        where: {
            orgKpiId: { in: kpiIds },
            status:   "APPROVE",
            ...(startDate || endDate
                ? { actualDate: {
                    ...(startDate ? { gte: startDate } : {}),
                    ...(endDate   ? { lte: endDate   } : {}),
                }}
                : {}),
        },
        include: {
            IndicatorReportDisaggregation: {
                where: disaggregationType
                    ? { type: disaggregationType.toUpperCase() }
                    : {},
            },
        },
    });

    // ── 3. Build per-KPI aggregation maps ─────────────────────────────────────
    const kpiAggMap = new Map<string, {
        totalActual:      number;
        monthlyActuals:   Map<string, number>;
        quarterlyActuals: Map<string, number>;
    }>();

    for (const kpi of kpis) {
        kpiAggMap.set(kpi.kpiId, { totalActual: 0, monthlyActuals: new Map(), quarterlyActuals: new Map() });
    }

    for (const report of reports) {
        if (!report.orgKpiId) continue;
        const agg = kpiAggMap.get(report.orgKpiId);
        if (!agg) continue;

        const reportActual = report.IndicatorReportDisaggregation.reduce(
            (sum, rd) => sum + (rd.actual ?? 0),
            0
        );
        agg.totalActual += reportActual;

        const date = report.actualDate;
        if (date) {
            const reportYear  = date.getFullYear();
            if (year && reportYear !== year) continue;

            const month   = date.getMonth() + 1;
            const quarter = Math.ceil(month / 3);

            const monthKey   = `${reportYear}-${String(month).padStart(2, "0")}`;
            const quarterKey = `${reportYear}-Q${quarter}`;

            agg.monthlyActuals.set(monthKey, (agg.monthlyActuals.get(monthKey) ?? 0) + reportActual);
            agg.quarterlyActuals.set(quarterKey, (agg.quarterlyActuals.get(quarterKey) ?? 0) + reportActual);
        }
    }

    // ── 4. THEMATIC_AREA_SUMMARY ─────────────────────────────────────────────
    const thematicMap = new Map<string, { soIds: Set<string>; kpiCount: number; totalPerformance: number }>();

    for (const kpi of kpis) {
        const area = kpi.strategicObjective?.thematicAreas ?? "Uncategorised";
        if (!thematicMap.has(area)) {
            thematicMap.set(area, { soIds: new Set(), kpiCount: 0, totalPerformance: 0 });
        }
        const entry = thematicMap.get(area)!;
        if (kpi.strategicObjectiveId) entry.soIds.add(kpi.strategicObjectiveId);
        entry.kpiCount += 1;

        const agg    = kpiAggMap.get(kpi.kpiId)!;
        const target = parseFloat(kpi.target ?? "0");
        const perf   = target > 0 ? (agg.totalActual / target) * 100 : 0;
        entry.totalPerformance += perf;
    }

    const THEMATIC_AREA_SUMMARY = Array.from(thematicMap.entries()).map(([area, entry]) => ({
        thematicArea:          area,
        totalSOs:              entry.soIds.size,
        totalKPIs:             entry.kpiCount,
        overallKPIPerformance: entry.kpiCount > 0
            ? Number((entry.totalPerformance / entry.kpiCount).toFixed(2))
            : 0,
    }));

    // ── 5. KPI_TABLE_DATA ───────────────────────────────────────────────────
    const statusLabel = (perf: number): string => {
        if (perf >= 100) return "Met";
        if (perf >= 50)  return "Partially Met";
        return "Not Met";
    };

    const KPI_TABLE_DATA = kpis.map((kpi) => {
        const agg    = kpiAggMap.get(kpi.kpiId)!;
        const target = parseFloat(kpi.target   ?? "0");
        const base   = parseFloat(kpi.baseLine ?? "0");
        const perf   = target > 0 ? Number(((agg.totalActual / target) * 100).toFixed(2)) : 0;
        return {
            kpiId:             kpi.kpiId,
            code:              kpi.specificAreas ?? "",
            statement:         kpi.statement    ?? "",
            thematicArea:      kpi.strategicObjective?.thematicAreas ?? "",
            strategicObjective: kpi.strategicObjective?.statement   ?? "",
            resultLevel:       kpi.type         ?? "",
            baseline:          base,
            target,
            actual:            agg.totalActual,
            performance:       perf,
            status:            statusLabel(perf),
        };
    });

    // ── 6. KPI_OVERVIEW_CHART ─────────────────────────────────────────────────
    const allMonthlyMap   = new Map<string, number>();
    const allQuarterlyMap = new Map<string, number>();
    let totalTarget = 0;
    let totalBaseline = 0;

    for (const kpi of kpis) {
        const agg = kpiAggMap.get(kpi.kpiId)!;
        totalTarget   += parseFloat(kpi.target   ?? "0");
        totalBaseline += parseFloat(kpi.baseLine ?? "0");
        for (const [k, v] of agg.monthlyActuals)   allMonthlyMap.set(k, (allMonthlyMap.get(k)   ?? 0) + v);
        for (const [k, v] of agg.quarterlyActuals) allQuarterlyMap.set(k, (allQuarterlyMap.get(k) ?? 0) + v);
    }

    const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const monthly = Array.from(allMonthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, mo] = key.split("-");
            return {
                period:  MONTH_LABELS[parseInt(mo) - 1],
                year:    parseInt(yr),
                actual,
                target:  totalTarget,
            };
        });

    const quarterly = Array.from(allQuarterlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, q] = key.split("-");
            return {
                period:  q,
                year:    parseInt(yr),
                actual,
                target:  totalTarget,
            };
        });

    const KPI_OVERVIEW_CHART = {
        monthly,
        quarterly,
        baseline:     totalBaseline,
        annualTarget: totalTarget,
    };

    // ── 7. PROJECT_INDICATOR_PERFORMANCE ─────────────────────────────────────
    const kpiPerformances = kpis.map((kpi) => {
        const agg    = kpiAggMap.get(kpi.kpiId)!;
        const target = parseFloat(kpi.target ?? "0");
        const perf   = target > 0 ? Number(((agg.totalActual / target) * 100).toFixed(2)) : 0;
        return {
            kpiId:      kpi.kpiId,
            code:       kpi.specificAreas ?? "",
            statement:  kpi.statement    ?? "",
            actual:     agg.totalActual,
            target,
            performance: perf,
        };
    });

    const avgPerformance = kpiPerformances.length > 0
        ? Number((kpiPerformances.reduce((s, k) => s + k.performance, 0) / kpiPerformances.length).toFixed(2))
        : 0;

    const PROJECT_INDICATOR_PERFORMANCE = {
        kpis: kpiPerformances,
        averagePerformance: avgPerformance,
    };

    return {
        THEMATIC_AREA_SUMMARY,
        KPI_OVERVIEW_CHART,
        KPI_TABLE_DATA,
        PROJECT_INDICATOR_PERFORMANCE,
    };
}


// ─────────────────────────────────────────────────────────────────────────────
// HELPERS  (used by getProjectActivityDashboardData)
// ─────────────────────────────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
    return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function cpiStatus(cpi: number): string {
    if (cpi === 0) return "NO SPENDING YET";
    if (cpi < 1)   return "OVER BUDGET";
    if (cpi === 1) return "BUDGET AS PLANNED";
    return "UNDER BUDGET";
}

function spiStatus(spi: number): string {
    if (spi === 0) return "NOT STARTED YET";
    if (spi < 1)   return "BEHIND SCHEDULE";
    if (spi === 1) return "ON SCHEDULE";
    return "AHEAD OF SCHEDULE";
}

function implementationTimeAnalysisStatus(
    plannedStart: Date | null,
    plannedEnd: Date | null,
    actualStart: Date | null,
    actualEnd: Date | null
): string {
    const today = new Date();

    if (!actualStart && !actualEnd) {
        if (!plannedStart) return "Due to Start";
        const daysToStart = (plannedStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (daysToStart > 30) return "Future Activity";
        if (daysToStart > 0)  return "Due to Start";
        return "Due to Start";
    }

    if (actualEnd) {
        if (plannedEnd && actualEnd < plannedEnd) return "Completed Early";
        return "Completed Late";
    }

    if (actualStart && plannedStart) {
        if (actualStart < plannedStart) return "In Progress (Early Start)";
        return "In Progress (Late Start)";
    }

    return "Due to Start";
}


// ─────────────────────────────────────────────────────────────────────────────
// PROJECT ACTIVITY DASHBOARD
// GET /project_activity_dashboard/:projectId
// ─────────────────────────────────────────────────────────────────────────────
export async function getProjectActivityDashboardData(projectId: string) {
    const today = new Date();

    // ── 1. Fetch all activities with their output and ALL reports ──────────────
    const activitiesRaw = await prisma.activity.findMany({
        where: { projectId },
        include: {
            output: {
                select: { outputId: true, outputStatement: true },
            },
            activityReport: {
                orderBy: { createAt: "desc" },
            },
            lineItem:true
        },
    });

    if (activitiesRaw.length === 0) {
        return {
            PROJECT_BUDGET_PERFORMANCE_SUMMARY: {
                totalActivities: 0,
                onBudgetActivities: 0,
                overBudgetActivities: 0,
                underBudgetActivities: 0,
                onScheduleActivities: 0,
                behindScheduleActivities: 0,
                aheadScheduleActivities: 0,
                onBudgetPercentage: 0,
                overBudgetPercentage: 0,
                underBudgetPercentage: 0,
                onSchedulePercentage: 0,
            },
            ACTIVITY_OVERVIEW: [],
            ACTIVITY_TABLE: [],
            IMPLEMENTATION_TIME_ANALYSIS: { chart: [], table: [] },
            BURN_RATE: [],
            ACTIVITY_FINANCIAL_DATA: [],
        };
    }

    // ── 2. Per-activity EVM computation ───────────────────────────────────────
    const activityData = activitiesRaw.map((activity) => {
        // Latest report for EVM / dates
        const report = activity.activityReport[0] ?? null;

        const plannedStart: Date | null = activity.startDate ?? null;
        const plannedEnd:   Date | null = activity.endDate   ?? null;
        const actualStart:  Date | null = report?.actualStartDate ?? null;
        const actualEnd:    Date | null = report?.actualEndDate   ?? null;
        const bac = activity.activityTotalBudget ?? 0;
        const actualCost = report?.actualCost ?? 0;
        const pctComplete = report?.percentageCompletion ?? 0;

        // ── Line Item totals for burn rate ────────────────────────────────────
        const lineItemTotalBudget = activity.lineItem.reduce(
            (sum, li) => sum + (li.totalBudget ?? 0), 0
        );
        const lineItemTotalSpent = activity.lineItem.reduce(
            (sum, li) => sum + (li.totalSpent ?? 0), 0
        );
        const lineItemBurnRate = lineItemTotalBudget > 0
            ? Number(((lineItemTotalSpent / lineItemTotalBudget) * 100).toFixed(2))
            : 0;

        const totalPlannedDays = (plannedStart && plannedEnd)
            ? daysBetween(plannedStart, plannedEnd)
            : 0;

        const refEnd = actualEnd ?? today;
        const totalDaysSpent = plannedStart
            ? Math.max(0, Math.round((refEnd.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24)))
            : 0;

        const remainingDays = Math.max(0, totalPlannedDays - totalDaysSpent);

        const percentageDaysSpent = totalPlannedDays > 0
            ? Math.min(100, Number(((totalDaysSpent / totalPlannedDays) * 100).toFixed(2)))
            : 0;

        const earnedValue  = Number((bac * pctComplete).toFixed(2));
        const plannedValue = Number((pctComplete * percentageDaysSpent).toFixed(2));
        const costVariance     = Number((earnedValue - actualCost).toFixed(2));
        const scheduleVariance = Number((earnedValue - plannedValue).toFixed(2));

        const cpi = actualCost > 0 ? Number((earnedValue / actualCost).toFixed(4)) : 0;
        const spi = plannedValue > 0 ? Number((earnedValue / plannedValue).toFixed(4)) : 0;

        const burnRatePct = bac > 0 ? Number(((actualCost / bac) * 100).toFixed(2)) : 0;

        const timeStatus = implementationTimeAnalysisStatus(plannedStart, plannedEnd, actualStart, actualEnd);

        // Actual frequency = total number of activity reports submitted
        const actualFrequency = activity.activityReport.length;

        return {
            activityId:              activity.activityId,
            activityStatement:       activity.activityStatement ?? "",
            outputId:                activity.outputId ?? "",
            outputStatement:         activity.output?.outputStatement ?? "",
            projectId:               activity.projectId ?? projectId,

            // Frequency
            targetFrequency:         activity.activityFrequency ?? 0,
            actualFrequency,

            // Dates
            activityPlannedStartDate: plannedStart,
            activityPlannedEndDate:   plannedEnd,
            activityActualStartDate:  actualStart,
            activityActualEndDate:    actualEnd,

            // Time
            totalPlannedDays,
            totalDaysSpent,
            remainingDays,
            percentageDaysSpent,

            // EVM
            budgetAtCompletion: bac,
            actualCost,
            percentageCompletion: pctComplete,
            earnedValue,
            plannedValue,
            costVariance,
            scheduleVariance,

            // Indices
            costPerformanceIndex:     cpi,
            schedulePerformanceIndex: spi,
            costPerformanceStatus:    cpiStatus(cpi),
            schedulePerformanceStatus: spiStatus(spi),

            // Burn rate
            burnRate: burnRatePct,

            // Line Item financial data (for burn rate chart)
            lineItemTotalBudget,
            lineItemTotalSpent,
            lineItemBurnRate,

            // Time analysis
            implementationTimeAnalysis: timeStatus,
        };
    });

    // ── 3. ACTIVITY_OVERVIEW – pie chart breakdown ─────────────────────────────
    const overviewCategories = [
        "Due to Start",
        "In Progress (Early Start)",
        "In Progress (Late Start)",
        "Future Activity",
        "Completed Early",
        "Completed Late",
    ];

    const overviewCounts = overviewCategories.map((cat) => ({
        category: cat,
        count: activityData.filter((a) => a.implementationTimeAnalysis === cat).length,
    }));

    const totalActivities = activityData.length;
    const ACTIVITY_OVERVIEW = overviewCounts.map((o) => ({
        category:   o.category,
        count:      o.count,
        percentage: totalActivities > 0
            ? Number(((o.count / totalActivities) * 100).toFixed(2))
            : 0,
    }));

    // ── 4. ACTIVITY_TABLE – table view (Activity Statement, Target Frequency,
    //       Actual Frequency, Performance %, Status) ──────────────────────────
    const ACTIVITY_TABLE = activityData.map((a) => ({
        activityId:        a.activityId,
        activityStatement: a.activityStatement,
        targetFrequency:   a.targetFrequency,
        actualFrequency:   a.actualFrequency,
        performance:       a.percentageCompletion,  // latest report's % completion
        status:            a.implementationTimeAnalysis,
    }));

    // ── 5. IMPLEMENTATION_TIME_ANALYSIS – chart + table ───────────────────────
    const outputChartMap = new Map<string, { outputStatement: string; totalPlannedDays: number; totalActualDays: number; count: number }>();

    for (const act of activityData) {
        const key = act.outputId || "no-output";
        if (!outputChartMap.has(key)) {
            outputChartMap.set(key, {
                outputStatement: act.outputStatement,
                totalPlannedDays: 0,
                totalActualDays: 0,
                count: 0,
            });
        }
        const entry = outputChartMap.get(key)!;
        entry.totalPlannedDays += act.totalPlannedDays;
        entry.totalActualDays  += act.totalDaysSpent;
        entry.count += 1;
    }

    const itaChart = Array.from(outputChartMap.entries()).map(([outputId, val]) => ({
        outputId,
        outputStatement:   val.outputStatement,
        totalPlannedDays:  val.totalPlannedDays,
        totalActualDays:   val.totalActualDays,
        activityCount:     val.count,
    }));

    const itaTable = activityData.map((a) => ({
        activityId:           a.activityId,
        activityDescription:  a.activityStatement,
        outputId:             a.outputId,
        outputStatement:      a.outputStatement,
        totalPlannedDays:     a.totalPlannedDays,
        totalActivitySpentDays: a.totalDaysSpent,
        percentageDaysSpent:  a.percentageDaysSpent,
        earnedValue:          a.earnedValue,
        plannedValue:         a.plannedValue,
        status:               a.implementationTimeAnalysis,
        costVariance:         a.costVariance,
        scheduleVariance:     a.scheduleVariance,
    }));

    const IMPLEMENTATION_TIME_ANALYSIS = { chart: itaChart, table: itaTable };

    // ── 6. BURN_RATE – per output (based on LineItem totalBudget & totalSpent) ─
    const burnRateOutputMap = new Map<string, {
        outputStatement: string;
        sumLineItemBudget: number;
        sumLineItemSpent: number;
    }>();

    for (const act of activityData) {
        const key = act.outputId || "no-output";
        if (!burnRateOutputMap.has(key)) {
            burnRateOutputMap.set(key, {
                outputStatement:   act.outputStatement,
                sumLineItemBudget: 0,
                sumLineItemSpent:  0,
            });
        }
        const entry = burnRateOutputMap.get(key)!;
        entry.sumLineItemBudget += act.lineItemTotalBudget;
        entry.sumLineItemSpent  += act.lineItemTotalSpent;
    }

    const BURN_RATE = Array.from(burnRateOutputMap.entries()).map(([outputId, val]) => ({
        outputId,
        outputStatement:   val.outputStatement,
        totalBudget:       val.sumLineItemBudget,
        totalSpent:        val.sumLineItemSpent,
        burnRate:          val.sumLineItemBudget > 0
            ? Number(((val.sumLineItemSpent / val.sumLineItemBudget) * 100).toFixed(2))
            : 0,
    }));

    // ── 7. ACTIVITY_FINANCIAL_DATA – full per-activity EVM data ──────────────
    const ACTIVITY_FINANCIAL_DATA = activityData;

    // ── 8. PROJECT_BUDGET_PERFORMANCE_SUMMARY ────────────────────────────────
    const onBudget      = activityData.filter((a) => a.costPerformanceStatus === "BUDGET AS PLANNED" || a.costPerformanceStatus === "UNDER BUDGET").length;
    const overBudget    = activityData.filter((a) => a.costPerformanceStatus === "OVER BUDGET").length;
    const underBudget   = activityData.filter((a) => a.costPerformanceStatus === "UNDER BUDGET").length;
    const onSchedule    = activityData.filter((a) => a.schedulePerformanceStatus === "ON SCHEDULE" || a.schedulePerformanceStatus === "AHEAD OF SCHEDULE").length;
    const behindSched   = activityData.filter((a) => a.schedulePerformanceStatus === "BEHIND SCHEDULE").length;
    const aheadSched    = activityData.filter((a) => a.schedulePerformanceStatus === "AHEAD OF SCHEDULE").length;

    const pct = (n: number) => totalActivities > 0 ? Number(((n / totalActivities) * 100).toFixed(2)) : 0;

    const PROJECT_BUDGET_PERFORMANCE_SUMMARY = {
        totalActivities,
        onBudgetActivities:      onBudget,
        overBudgetActivities:    overBudget,
        underBudgetActivities:   underBudget,
        onScheduleActivities:    onSchedule,
        behindScheduleActivities: behindSched,
        aheadScheduleActivities:  aheadSched,
        onBudgetPercentage:      pct(onBudget),
        overBudgetPercentage:    pct(overBudget),
        underBudgetPercentage:   pct(underBudget),
        onSchedulePercentage:    pct(onSchedule),
    };

    return {
        PROJECT_BUDGET_PERFORMANCE_SUMMARY,
        ACTIVITY_OVERVIEW,
        ACTIVITY_TABLE,
        IMPLEMENTATION_TIME_ANALYSIS,
        BURN_RATE,
        ACTIVITY_FINANCIAL_DATA,
    };
}


// ─────────────────────────────────────────────────────────────────────────────
// COMBINED RESULT DASHBOARD FULL
// GET /result_dashboard_full/:projectId
// Returns summary cards + activity overview/table in one call.
// The KPI bar chart and indicator line chart come from the separate
// GET /org_kpi_dashboard endpoint.
// ─────────────────────────────────────────────────────────────────────────────
export async function getResultDashboardFullData(projectId: string) {

    // ── 1. Count Impacts, Outcomes, Outputs, Activities for this project ───────
    const [totalImpacts, totalOutcomes, totalOutputs, totalActivities] = await Promise.all([
        prisma.impact.count({ where: { projectId } }),
        prisma.outcome.count({ where: { projectId } }),
        prisma.output.count({ where: { projectId } }),
        prisma.activity.count({ where: { projectId } }),
    ]);

    // ── 2. Fetch indicators tied to this project (via indicator_view) ──────────
    const indicatorRows = await prisma.$queryRaw<IIndicatorView[]>`
        SELECT * FROM indicator_view WHERE resultProjectId = ${projectId};
    `;

    const indicatorIds = [...new Set(indicatorRows.map((r) => r.indicatorId))];

    // ── 3. KPIs Due For Reporting: indicators that have NO IndicatorReport ──────
    //    For each indicator, check if any report exists with that indicatorId.
    const reportsExist = await prisma.indicatorReport.findMany({
        where: { indicatorId: { in: indicatorIds } },
        select: { indicatorId: true },
        distinct: ["indicatorId"],
    });
    const indicatorsWithReport = new Set(reportsExist.map((r) => r.indicatorId));

    // Group indicators by resultName to get counts per type
    const indicatorsWithNoReport = indicatorRows.filter(
        (r) => !indicatorsWithReport.has(r.indicatorId)
    );

    // Helper: de-duplicate by indicatorId, then group
    const dueByType: Record<string, Set<string>> = {};
    for (const row of indicatorsWithNoReport) {
        const typeName = (row.resultName ?? "Unknown").toLowerCase();
        if (!dueByType[typeName]) dueByType[typeName] = new Set();
        dueByType[typeName].add(row.indicatorId);
    }

    const kpisDue = {
        impacts:    dueByType["impact"]  ? dueByType["impact"].size  : 0,
        outcomes:   dueByType["outcome"] ? dueByType["outcome"].size : 0,
        outputs:    dueByType["output"]  ? dueByType["output"].size  : 0,
    };

    // ── 4. Overall Performance: avg achievement % per result type ──────────────
    // Reuse the same logic as getResultDashboardData but aggregate by resultName
    const allDisaggregations = indicatorIds.length > 0
        ? await prisma.indicatorDisaggregation.findMany({
            where: { indicatorId: { in: indicatorIds } },
        })
        : [];

    const approvedReports = indicatorIds.length > 0
        ? await prisma.indicatorReport.findMany({
            where: { indicatorId: { in: indicatorIds }, status: "APPROVE" },
            include: { IndicatorReportDisaggregation: true },
        })
        : [];

    const disaggByIndicator = new Map<string, typeof allDisaggregations>();
    for (const d of allDisaggregations) {
        if (!disaggByIndicator.has(d.indicatorId)) disaggByIndicator.set(d.indicatorId, []);
        disaggByIndicator.get(d.indicatorId)!.push(d);
    }

    const reportActualByIndicator = new Map<string, number>();
    for (const report of approvedReports) {
        if (!report.indicatorId) continue;
        const sum = report.IndicatorReportDisaggregation.reduce((s, rd) => s + (rd.actual ?? 0), 0);
        reportActualByIndicator.set(
            report.indicatorId,
            (reportActualByIndicator.get(report.indicatorId) ?? 0) + sum
        );
    }

    // Unique indicator metadata
    const uniqueIndicatorMeta = new Map<string, IIndicatorView>();
    for (const row of indicatorRows) {
        if (!uniqueIndicatorMeta.has(row.indicatorId)) uniqueIndicatorMeta.set(row.indicatorId, row);
    }

    // Performance grouped by resultName
    const perfByType: Record<string, { sum: number; count: number }> = {};
    let totalPerfSum = 0;
    let totalPerfCount = 0;

    for (const [indicatorId, meta] of uniqueIndicatorMeta.entries()) {
        const disaggs = disaggByIndicator.get(indicatorId) ?? [];
        const target  = disaggs.reduce((s, d) => s + (d.target ?? 0), 0);
        const actual  = reportActualByIndicator.get(indicatorId) ?? 0;
        const perf    = target > 0 ? (actual / target) * 100 : 0;

        const typeName = (meta.resultName ?? "Unknown").toLowerCase();
        if (!perfByType[typeName]) perfByType[typeName] = { sum: 0, count: 0 };
        perfByType[typeName].sum   += perf;
        perfByType[typeName].count += 1;

        totalPerfSum   += perf;
        totalPerfCount += 1;
    }

    const avg = (entry?: { sum: number; count: number }) =>
        entry && entry.count > 0 ? Number((entry.sum / entry.count).toFixed(2)) : 0;

    const overallPerformance = {
        impacts:       avg(perfByType["impact"]),
        outcomes:      avg(perfByType["outcome"]),
        outputs:       avg(perfByType["output"]),
        totalActivity: totalPerfCount > 0 ? Number((totalPerfSum / totalPerfCount).toFixed(2)) : 0,
    };

    // ── 5. RESULT_SUMMARY – the three top cards ───────────────────────────────
    const RESULT_SUMMARY = {
        resultAndActivities: {
            totalImpacts,
            totalOutcomes,
            totalOutputs,
            totalActivities,
        },
        kpisDueForReporting: kpisDue,
        overallPerformance,
    };

    // ── 6. Activity overview + table (delegate to existing function) ───────────
    const activityDashboard = await getProjectActivityDashboardData(projectId);

    return {
        RESULT_SUMMARY,
        ACTIVITY_OVERVIEW:   activityDashboard.ACTIVITY_OVERVIEW,
        ACTIVITY_TABLE:      activityDashboard.ACTIVITY_TABLE,
    };
}


// ─────────────────────────────────────────────────────────────────────────────
// RESULT DASHBOARD — KPI SECTION (Block 3 + Block 4)
//   • Key Performance Indicator Overview  (bar chart + table)
//   • Project Indicator Performance       (line chart + avg)
//
// This is driven by the project's own Indicator records (not Org KPIs).
// The filter bar on the frontend makes separate calls to this endpoint
// whenever the user changes Thematic Area / Result Level / Indicator / Date Range / Disaggregation.
//
// GET /result_dashboard_kpi/:projectId?thematicArea=&resultLevel=&...
// ─────────────────────────────────────────────────────────────────────────────

export interface IResultDashboardKpiFilters {
    /** e.g. "Health & Sanitation" — maps to Indicator.thematicAreasOrPillar */
    thematicArea?: string;
    /** Filter by a StrategicObjective ID — indicators linked via orgKpiId → Kpi.strategicObjectiveId */
    strategicObjectiveId?: string;
    /** e.g. "Impact" | "Outcome" | "Output" — maps to ResultType.resultName */
    resultLevel?: string;
    /** Filter to a single indicator */
    indicatorId?: string;
    /** Filter IndicatorReports from this date */
    startDate?: Date;
    /** Filter IndicatorReports up to this date */
    endDate?: Date;
    /** Filter IndicatorReportDisaggregation by type e.g. "GENDER", "STATE" */
    disaggregationType?: string;
    /** Restrict the chart time-series to a specific year */
    year?: number;
}

// ── Helper: empty response when no data matches ───────────────────────────────
function emptyKpiSectionResult() {
    return {
        KPI_OVERVIEW_CHART: { monthly: [], quarterly: [], baseline: 0, annualTarget: 0 },
        KPI_TABLE_DATA:     [],
        PROJECT_INDICATOR_PERFORMANCE: { indicators: [], averagePerformance: 0 },
    };
}

export async function getResultDashboardKpiSectionData(
    projectId: string,
    filters: IResultDashboardKpiFilters = {}
) {
    const {
        thematicArea,
        strategicObjectiveId,
        resultLevel,
        indicatorId,
        startDate,
        endDate,
        disaggregationType,
        year,
    } = filters;

    // ── 1. Fetch all indicators for this project via the DB view ───────────────
    let indicatorRows = await prisma.$queryRaw<IIndicatorView[]>`
        SELECT * FROM indicator_view WHERE resultProjectId = ${projectId};
    `;

    if (indicatorRows.length === 0) return emptyKpiSectionResult();

    // ── 2. Apply in-memory filters on the indicator rows ─────────────────────
    if (thematicArea) {
        indicatorRows = indicatorRows.filter(
            (r) => r.thematicAreasOrPillar === thematicArea
        );
    }
    if (resultLevel) {
        indicatorRows = indicatorRows.filter(
            (r) => (r.resultName ?? "").toLowerCase() === resultLevel.toLowerCase()
        );
    }
    if (indicatorId) {
        indicatorRows = indicatorRows.filter((r) => r.indicatorId === indicatorId);
    }

    // Strategic Objective filter: look up KPI IDs for that SO, then keep
    // indicators whose orgKpiId matches one of those KPIs.
    if (strategicObjectiveId) {
        const soKpis = await prisma.kpi.findMany({
            where: { strategicObjectiveId },
            select: { kpiId: true },
        });
        const soKpiIds = new Set(soKpis.map((k) => k.kpiId));
        indicatorRows = indicatorRows.filter(
            (r) => r.orgKpiId && soKpiIds.has(r.orgKpiId)
        );
    }

    if (indicatorRows.length === 0) return emptyKpiSectionResult();

    // ── 3. De-duplicate into a map keyed by indicatorId ──────────────────────
    const uniqueMeta = new Map<string, IIndicatorView>();
    for (const row of indicatorRows) {
        if (!uniqueMeta.has(row.indicatorId)) uniqueMeta.set(row.indicatorId, row);
    }
    const indicatorIds = [...uniqueMeta.keys()];

    // ── 4. Fetch targets (IndicatorDisaggregation) ────────────────────────────
    const disaggs = await prisma.indicatorDisaggregation.findMany({
        where: { indicatorId: { in: indicatorIds } },
    });
    const disaggByIndicator = new Map<string, typeof disaggs>();
    for (const d of disaggs) {
        if (!disaggByIndicator.has(d.indicatorId)) disaggByIndicator.set(d.indicatorId, []);
        disaggByIndicator.get(d.indicatorId)!.push(d);
    }

    // ── 5. Fetch approved IndicatorReports (with optional date + disagg filter) ─
    const reports = await prisma.indicatorReport.findMany({
        where: {
            indicatorId: { in: indicatorIds },
            status: "APPROVE",
            ...(startDate || endDate
                ? {
                    actualDate: {
                        ...(startDate ? { gte: startDate } : {}),
                        ...(endDate   ? { lte: endDate }   : {}),
                    },
                }
                : {}),
        },
        include: {
            IndicatorReportDisaggregation: {
                where: disaggregationType
                    ? { type: disaggregationType.toUpperCase() }
                    : {},
            },
        },
    });

    // ── 6. Build per-indicator aggregation maps ───────────────────────────────
    type IndAgg = {
        totalActual:      number;
        monthlyActuals:   Map<string, number>;
        quarterlyActuals: Map<string, number>;
    };
    const indAggMap = new Map<string, IndAgg>();
    for (const id of indicatorIds) {
        indAggMap.set(id, { totalActual: 0, monthlyActuals: new Map(), quarterlyActuals: new Map() });
    }

    for (const report of reports) {
        if (!report.indicatorId) continue;
        const agg = indAggMap.get(report.indicatorId);
        if (!agg) continue;

        const reportActual = report.IndicatorReportDisaggregation.reduce(
            (s, rd) => s + (rd.actual ?? 0), 0
        );
        agg.totalActual += reportActual;

        const date = report.actualDate;
        if (date) {
            const reportYear = date.getFullYear();
            if (year && reportYear !== year) continue;

            const month   = date.getMonth() + 1;
            const quarter = Math.ceil(month / 3);

            const monthKey   = `${reportYear}-${String(month).padStart(2, "0")}`;
            const quarterKey = `${reportYear}-Q${quarter}`;

            agg.monthlyActuals.set(monthKey, (agg.monthlyActuals.get(monthKey) ?? 0) + reportActual);
            agg.quarterlyActuals.set(quarterKey, (agg.quarterlyActuals.get(quarterKey) ?? 0) + reportActual);
        }
    }

    // ── 7. KPI_TABLE_DATA — one row per indicator ─────────────────────────────
    const statusLabel = (perf: number): string => {
        if (perf >= 100) return "Met";
        if (perf >= 50)  return "Partially Met";
        return "Not Met";
    };

    const KPI_TABLE_DATA = [...uniqueMeta.entries()].map(([indId, meta]) => {
        const agg       = indAggMap.get(indId)!;
        const indDisaggs = disaggByIndicator.get(indId) ?? [];
        const target    = indDisaggs.reduce((s, d) => s + (d.target ?? 0), 0);
        const baseline  = meta.cumulativeValue ?? 0;
        const perf      = target > 0 ? Number(((agg.totalActual / target) * 100).toFixed(2)) : 0;

        return {
            indicatorId:   indId,
            code:          meta.specificArea           ?? "",
            statement:     meta.statement              ?? "",
            thematicArea:  meta.thematicAreasOrPillar  ?? "",
            resultLevel:   meta.resultName             ?? "",
            baseline,
            target,
            actual:        agg.totalActual,
            performance:   perf,
            status:        statusLabel(perf),
        };
    });

    // ── 8. KPI_OVERVIEW_CHART — aggregate all filtered indicators ─────────────
    const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const allMonthlyMap   = new Map<string, number>();
    const allQuarterlyMap = new Map<string, number>();
    let totalTarget   = 0;
    let totalBaseline = 0;

    for (const [indId, meta] of uniqueMeta.entries()) {
        const agg        = indAggMap.get(indId)!;
        const indDisaggs = disaggByIndicator.get(indId) ?? [];
        totalTarget   += indDisaggs.reduce((s, d) => s + (d.target ?? 0), 0);
        totalBaseline += meta.cumulativeValue ?? 0;
        for (const [k, v] of agg.monthlyActuals)   allMonthlyMap.set(k, (allMonthlyMap.get(k)   ?? 0) + v);
        for (const [k, v] of agg.quarterlyActuals) allQuarterlyMap.set(k, (allQuarterlyMap.get(k) ?? 0) + v);
    }

    const monthly = Array.from(allMonthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, mo] = key.split("-");
            return { period: MONTH_LABELS[parseInt(mo) - 1], year: parseInt(yr), actual, target: totalTarget };
        });

    const quarterly = Array.from(allQuarterlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, q] = key.split("-");
            return { period: q, year: parseInt(yr), actual, target: totalTarget };
        });

    const KPI_OVERVIEW_CHART = {
        monthly,
        quarterly,
        baseline:     totalBaseline,
        annualTarget: totalTarget,
    };

    // ── 9. PROJECT_INDICATOR_PERFORMANCE — per-indicator line chart ───────────
    const kpiPerformances = KPI_TABLE_DATA.map((row) => ({
        indicatorId: row.indicatorId,
        code:        row.code,
        statement:   row.statement,
        actual:      row.actual,
        target:      row.target,
        performance: row.performance,
    }));

    const avgPerformance = kpiPerformances.length > 0
        ? Number(
            (kpiPerformances.reduce((s, k) => s + k.performance, 0) / kpiPerformances.length).toFixed(2)
          )
        : 0;

    const PROJECT_INDICATOR_PERFORMANCE = {
        indicators:         kpiPerformances,
        averagePerformance: avgPerformance,
    };

    return {
        KPI_OVERVIEW_CHART,
        KPI_TABLE_DATA,
        PROJECT_INDICATOR_PERFORMANCE,
    };
}