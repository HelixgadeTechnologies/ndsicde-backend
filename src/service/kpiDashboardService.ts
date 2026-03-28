import { IIndicatorView } from "../interface/projectManagementInterface";
import { IKpiDashboardData, IKpiDashboardOutput } from '../interface/dashboardInterface';
import { prisma } from '../lib/prisma';



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

async function callProcedure(option: number, indicatorId: string, selectedProject: string): Promise<void | any[]> {
    const raws = await prisma.$queryRawUnsafe<any[]>(
        `CALL ResultDashboard(?,?,?)`,
        option,
        indicatorId,
        selectedProject
    );
    // console.log(selectedYear,selectedState)
    // console.log(raws)

    const cleaned = normalizeBigInts(raws);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["totalSubmitted"]: Number(row.f0),
            ["totalPending"]: Number(row.f1),
            ["totalApproved"]: Number(row.f2),
            ["totalDeclined"]: Number(row.f3),
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["departmentDisaggregationId"]: row.f0,
            ["departmentName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["ageDisaggregationId"]: row.f0,
            ["actualFrom"]: Number(row.f1),
            ["actualTo"]: Number(row.f2),
            ["targetFrom"]: Number(row.f3),
            ["targetTo"]: Number(row.f4),
            ["disaggregationId"]: row.f5,
            ["indicatorId"]: row.f6,
            ["resultTypeId"]: row.f7,
            ["resultName"]: row.f8,
            ["result"]: row.f9,
            ["resultProjectId"]: row.f10,
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["productDisaggregationId"]: row.f0,
            ["productName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 5) {
        return cleaned.map((row: any) => ({
            ["stateDisaggregationId"]: row.f0,
            ["stateName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 6) {
        return cleaned.map((row: any) => ({
            ["lgaDisaggregationId"]: row.f0,
            ["lgaName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 7) {
        return cleaned.map((row: any) => ({
            ["tenureDisaggregationId"]: row.f0,
            ["tenureName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 8) {
        return cleaned.map((row: any) => ({
            ["genderDisaggregationId"]: row.f0,
            ["actualFemale"]: Number(row.f1),
            ["actualMale"]: Number(row.f2),
            ["targetFemale"]: Number(row.f3),
            ["targetMale"]: Number(row.f4),
            ["disaggregationId"]: row.f5,
            ["indicatorId"]: row.f6,
            ["resultTypeId"]: row.f7,
            ["resultName"]: row.f8,
            ["result"]: row.f9,
            ["resultProjectId"]: row.f10,
            ["achievementPercentageFemale"]: Number(row.f11),
            ["achievementPercentageMale"]: Number(row.f11),
        }));
    } else if (option == 9) {
        return cleaned.map((row: any) => ({
            ["avgProjectPerformance"]: Number(row.f0),
        }));
    } else if (option == 10) {
        return cleaned.map((row: any) => ({
            ["indicatorId"]: row.f0,
            ["statement"]: row.f1,
            ["cumulativeTargetValue"]: Number(row.f2),
            ["cumulativeActualValue"]: Number(row.f3),
            ["achievementPercentage"]: Number(row.f4),
        }));
    } else {
        return []
    }
}

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

    //console.log("approvedReports", approvedReports)

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

    // console.log("reportDisaggByIndicator", reportDisaggByIndicator)

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

    //console.log("uniqueIndicatorMeta", uniqueIndicatorMeta)

    for (const [indicatorId, meta] of uniqueIndicatorMeta.entries()) {
        const disaggs = disaggByIndicator.get(indicatorId) ?? [];
        const reportDisaggs = reportDisaggByIndicator.get(indicatorId) ?? [];
        // console.log("reportDisaggs", reportDisaggs)
        // Baseline – from indicator.cumulativeValue
        const baseline = meta.cumulativeValue ?? 0;

        // Determine disaggregation type (use first record's type, or fall back)
        const disaggType = disaggs.length > 0 ? disaggs[0].type.toUpperCase() : null;

        let target = 0;
        let actual = 0;

        if (disaggType === "GENDER") {
            // Gender: exactly two rows – Male & Female. Sum both.
            target = disaggs.reduce((sum, d) => sum + (d.target ?? 0), 0);
            actual = reportDisaggs.reduce((sum, rd) => sum + (rd.actual ?? 0), 0);
        } else {
            // All other types: straightforward sum
            target = disaggs.reduce((sum, d) => sum + (d.target ?? 0), 0);
            actual = reportDisaggs.reduce((sum, rd) => sum + (rd.actual ?? 0), 0);
        }

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
            // Build male / female breakdown
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
            // Generic breakdown: one entry per category row
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

// ─── Org KPI Dashboard filter params ────────────────────────────────────────
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

async function callOrgKpiProcedure(option: number, indicatorId: string): Promise<void | any[]> {
    const raws = await prisma.$queryRawUnsafe<any[]>(
        `CALL OrgKpiDashboard(?,?)`,
        option,
        indicatorId
    );
    // console.log(selectedYear,selectedState)
    // console.log(raws)

    const cleaned = normalizeBigInts(raws);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["totalSubmitted"]: Number(row.f0),
            ["totalPending"]: Number(row.f1),
            ["totalApproved"]: Number(row.f2),
            ["totalDeclined"]: Number(row.f3),
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["departmentDisaggregationId"]: row.f0,
            ["departmentName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["ageDisaggregationId"]: row.f0,
            ["actualFrom"]: Number(row.f1),
            ["actualTo"]: Number(row.f2),
            ["targetFrom"]: Number(row.f3),
            ["targetTo"]: Number(row.f4),
            ["disaggregationId"]: row.f5,
            ["indicatorId"]: row.f6,
            ["resultTypeId"]: row.f7,
            ["resultName"]: row.f8,
            ["result"]: row.f9,
            ["resultProjectId"]: row.f10,
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["productDisaggregationId"]: row.f0,
            ["productName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 5) {
        return cleaned.map((row: any) => ({
            ["stateDisaggregationId"]: row.f0,
            ["stateName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 6) {
        return cleaned.map((row: any) => ({
            ["lgaDisaggregationId"]: row.f0,
            ["lgaName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 7) {
        return cleaned.map((row: any) => ({
            ["tenureDisaggregationId"]: row.f0,
            ["tenureName"]: row.f1,
            ["actualCount"]: Number(row.f2),
            ["targetCount"]: Number(row.f3),
            ["disaggregationId"]: row.f4,
            ["indicatorId"]: row.f5,
            ["resultTypeId"]: row.f6,
            ["resultName"]: row.f7,
            ["result"]: row.f8,
            ["resultProjectId"]: row.f9,
            ["achievementPercentage"]: Number(row.f10),
        }));
    } else if (option == 8) {
        return cleaned.map((row: any) => ({
            ["genderDisaggregationId"]: row.f0,
            ["actualFemale"]: Number(row.f1),
            ["actualMale"]: Number(row.f2),
            ["targetFemale"]: Number(row.f3),
            ["targetMale"]: Number(row.f4),
            ["disaggregationId"]: row.f5,
            ["indicatorId"]: row.f6,
            ["resultTypeId"]: row.f7,
            ["resultName"]: row.f8,
            ["result"]: row.f9,
            ["resultProjectId"]: row.f10,
            ["achievementPercentageFemale"]: Number(row.f11),
            ["achievementPercentageMale"]: Number(row.f11),
        }));
    } else if (option == 9) {
        return cleaned.map((row: any) => ({
            ["avgProjectPerformance"]: Number(row.f0),
        }));
    } else if (option == 10) {
        return cleaned.map((row: any) => ({
            ["indicatorId"]: row.f0,
            ["statement"]: row.f1,
            ["cumulativeTargetValue"]: Number(row.f2),
            ["cumulativeActualValue"]: Number(row.f3),
            ["achievementPercentage"]: Number(row.f4),
        }));
    } else {
        return []
    }
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
    // kpiId → { totalActual, monthlyActuals: Map<"YYYY-MM",num>, quarterlyActuals: Map<"YYYY-QN",num> }
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

        // Sum actuals from disaggregation rows
        const reportActual = report.IndicatorReportDisaggregation.reduce(
            (sum, rd) => sum + (rd.actual ?? 0),
            0
        );
        agg.totalActual += reportActual;

        // Group by actualDate for chart
        const date = report.actualDate;
        if (date) {
            const reportYear  = date.getFullYear();
            // Skip if year filter is set and doesn't match
            if (year && reportYear !== year) continue;

            const month   = date.getMonth() + 1; // 1-12
            const quarter = Math.ceil(month / 3); // 1-4

            const monthKey   = `${reportYear}-${String(month).padStart(2, "0")}`;
            const quarterKey = `${reportYear}-Q${quarter}`;

            agg.monthlyActuals.set(monthKey, (agg.monthlyActuals.get(monthKey) ?? 0) + reportActual);
            agg.quarterlyActuals.set(quarterKey, (agg.quarterlyActuals.get(quarterKey) ?? 0) + reportActual);
        }
    }

    // ── 4. THEMATIC_AREA_SUMMARY – top cards ─────────────────────────────────
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

    // ── 5. KPI_TABLE_DATA – table view ───────────────────────────────────────
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
            code:              kpi.specificAreas ?? "",   // specificAreas used as code (EDU-01 etc.)
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

    // ── 6. KPI_OVERVIEW_CHART – bar chart (monthly + quarterly) ──────────────
    // Aggregate across ALL filtered KPIs so the chart shows the combined picture
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

    // Build sorted monthly array
    const monthly = Array.from(allMonthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, mo] = key.split("-");
            return {
                period:  MONTH_LABELS[parseInt(mo) - 1],
                year:    parseInt(yr),
                actual,
                target:  totalTarget,   // full annual target as reference
            };
        });

    // Build sorted quarterly array
    const quarterly = Array.from(allQuarterlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, actual]) => {
            const [yr, q] = key.split("-");
            return {
                period:  q,           // "Q1" | "Q2" | "Q3" | "Q4"
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

    // ── 7. PROJECT_INDICATOR_PERFORMANCE – line chart ─────────────────────────
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


// ─── Helper: days between two dates ─────────────────────────────────────────
function daysBetween(a: Date, b: Date): number {
    return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Helper: CPI status label ────────────────────────────────────────────────
function cpiStatus(cpi: number): string {
    if (cpi === 0) return "NO SPENDING YET";
    if (cpi < 1)   return "OVER BUDGET";
    if (cpi === 1) return "BUDGET AS PLANNED";
    return "UNDER BUDGET";
}

// ─── Helper: SPI status label ────────────────────────────────────────────────
function spiStatus(spi: number): string {
    if (spi === 0) return "NOT STARTED YET";
    if (spi < 1)   return "BEHIND SCHEDULE";
    if (spi === 1) return "ON SCHEDULE";
    return "AHEAD OF SCHEDULE";
}

// ─── Helper: Implementation Time Analysis status ──────────────────────────────
function implementationTimeAnalysisStatus(
    plannedStart: Date | null,
    plannedEnd: Date | null,
    actualStart: Date | null,
    actualEnd: Date | null
): string {
    const today = new Date();

    // No report at all
    if (!actualStart && !actualEnd) {
        if (!plannedStart) return "Due to Start";
        const daysToStart = (plannedStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (daysToStart > 30) return "Future Activity";
        if (daysToStart > 0)  return "Due to Start";
        return "Due to Start"; // past planned start but no actual start
    }

    // Completed
    if (actualEnd) {
        if (plannedEnd && actualEnd < plannedEnd) return "Completed Early";
        return "Completed Late";
    }

    // In Progress
    if (actualStart && plannedStart) {
        if (actualStart < plannedStart) return "In Progress (Early Start)";
        return "In Progress (Late Start)";
    }

    return "Due to Start";
}

export async function getProjectActivityDashboardData(projectId: string) {
    const today = new Date();

    // ── 1. Fetch all activities with their output and latest report ────────────
    const activitiesRaw = await prisma.activity.findMany({
        where: { projectId },
        include: {
            output: {
                select: { outputId: true, outputStatement: true },
            },
            activityReport: {
                orderBy: { createAt: "desc" },
                take: 1, // most recent report per activity
            },
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
            IMPLEMENTATION_TIME_ANALYSIS: { chart: [], table: [] },
            BURN_RATE: [],
            ACTIVITY_FINANCIAL_DATA: [],
        };
    }

    // ── 2. Per-activity EVM computation ───────────────────────────────────────
    const activityData = activitiesRaw.map((activity) => {
        const report = activity.activityReport[0] ?? null;

        const plannedStart: Date | null = activity.startDate ?? null;
        const plannedEnd:   Date | null = activity.endDate   ?? null;
        const actualStart:  Date | null = report?.actualStartDate ?? null;
        const actualEnd:    Date | null = report?.actualEndDate   ?? null;
        const bac = activity.activityTotalBudget ?? 0;                      // Budget At Completion
        const actualCost = report?.actualCost ?? 0;
        const pctComplete = report?.percentageCompletion ?? 0;               // 0-100

        // Planned days
        const totalPlannedDays = (plannedStart && plannedEnd)
            ? daysBetween(plannedStart, plannedEnd)
            : 0;

        // Days spent = (actualEnd OR today) - plannedStart
        const refEnd = actualEnd ?? today;
        const totalDaysSpent = plannedStart
            ? Math.max(0, Math.round((refEnd.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24)))
            : 0;

        const remainingDays = Math.max(0, totalPlannedDays - totalDaysSpent);

        // % days spent = days spent / total planned days x 100
        const percentageDaysSpent = totalPlannedDays > 0
            ? Math.min(100, Number(((totalDaysSpent / totalPlannedDays) * 100).toFixed(2)))
            : 0;

        // EVM core metrics
        const earnedValue  = Number((bac * (pctComplete / 100)).toFixed(2));       // EV = BAC × %complete
        const plannedValue = Number((bac * (percentageDaysSpent / 100)).toFixed(2)); // PV = BAC × %days spent
        const costVariance     = Number((earnedValue - actualCost).toFixed(2));
        const scheduleVariance = Number((earnedValue - plannedValue).toFixed(2));

        const cpi = actualCost > 0 ? Number((earnedValue / actualCost).toFixed(4)) : 0;
        const spi = plannedValue > 0 ? Number((earnedValue / plannedValue).toFixed(4)) : 0;

        // Burn rate per activity: actual cost / budget × 100
        const burnRatePct = bac > 0 ? Number(((actualCost / bac) * 100).toFixed(2)) : 0;

        // Implementation time status
        const timeStatus = implementationTimeAnalysisStatus(plannedStart, plannedEnd, actualStart, actualEnd);

        return {
            activityId:              activity.activityId,
            activityStatement:       activity.activityStatement ?? "",
            outputId:                activity.outputId ?? "",
            outputStatement:         activity.output?.outputStatement ?? "",
            projectId:               activity.projectId ?? projectId,

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

    // ── 4. IMPLEMENTATION_TIME_ANALYSIS – chart + table ───────────────────────
    // Chart: group by output → total planned vs actual days
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

    // Table: flat per-activity rows for the table view
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

    // ── 5. BURN_RATE – per output  ────────────────────────────────────────────
    const burnRateOutputMap = new Map<string, { outputStatement: string; sumActualCost: number; sumBudget: number }>();

    for (const act of activityData) {
        const key = act.outputId || "no-output";
        if (!burnRateOutputMap.has(key)) {
            burnRateOutputMap.set(key, { outputStatement: act.outputStatement, sumActualCost: 0, sumBudget: 0 });
        }
        const entry = burnRateOutputMap.get(key)!;
        entry.sumActualCost += act.actualCost;
        entry.sumBudget     += act.budgetAtCompletion;
    }

    const BURN_RATE = Array.from(burnRateOutputMap.entries()).map(([outputId, val]) => ({
        outputId,
        outputStatement: val.outputStatement,
        sumActualCost:   val.sumActualCost,
        sumBudget:       val.sumBudget,
        burnRate:        val.sumBudget > 0
            ? Number(((val.sumActualCost / val.sumBudget) * 100).toFixed(2))
            : 0,
    }));

    // ── 6. ACTIVITY_FINANCIAL_DATA – full per-activity data ───────────────────
    const ACTIVITY_FINANCIAL_DATA = activityData;

    // ── 7. PROJECT_BUDGET_PERFORMANCE_SUMMARY ────────────────────────────────
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
        IMPLEMENTATION_TIME_ANALYSIS,
        BURN_RATE,
        ACTIVITY_FINANCIAL_DATA,
    };
}