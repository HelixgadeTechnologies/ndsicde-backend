import { Prisma, PrismaClient, Project } from '@prisma/client';
import { IIndicatorView } from "../interface/projectManagementInterface";
import { ArchiveApiOptions } from 'cloudinary';
const prisma = new PrismaClient();

export interface IKpiDashboardData {
    projectId: string,
    resultTypeId: string,
    disaggregationId: string,
    data: void | any[]
}
export interface IKpiDashboardOutput {
    INDICATOR_STATUS: void | any[],
    INDICATOR_DATA: Array<IKpiDashboardData>,
    AVERAGE_INDICATOR_PERFORMANCE: void | any[],
    INDICATOR_PERFORMANCE: void | any[],
}

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

    const section: IKpiDashboardOutput = {
        INDICATOR_STATUS: [],
        INDICATOR_DATA: [],
        AVERAGE_INDICATOR_PERFORMANCE: [],
        INDICATOR_PERFORMANCE: [],
    }

    const indicators = await prisma.$queryRaw<IIndicatorView[]>`
        SELECT * FROM indicator_view WHERE resultProjectId = ${projectId};
      `;

    if (indicators.length == 0) {
        throw new Error("No indicator found for this project");
    }

    const result1 = await callProcedure(1, "ALL", projectId)
    section.INDICATOR_STATUS = result1

    const result2 = await callProcedure(9, "ALL", projectId)
    section.AVERAGE_INDICATOR_PERFORMANCE = result2

    const result3 = await callProcedure(10, "ALL", projectId)
    section.INDICATOR_PERFORMANCE = result3

    indicators.forEach(async (value: IIndicatorView, index: number, array: IIndicatorView[]) => {
        const data: IKpiDashboardData = {
            projectId: value.resultProjectId as string,
            resultTypeId: value.resultTypeId as string,
            disaggregationId: value.disaggregationId as string,
            data: []
        }
        if (value.disaggregationName == "DEPARTMENT") {
            const result = await callProcedure(2, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "AGE") {
            const result = await callProcedure(3, value.indicatorId, projectId)

        } else if (value.disaggregationName == "PRODUCT") {
            const result = await callProcedure(4, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "STATE") {
            const result = await callProcedure(5, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "LGA") {
            const result = await callProcedure(6, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "TENURE") {
            const result = await callProcedure(7, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "GENDER") {
            const result = await callProcedure(8, value.indicatorId, projectId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        }
    })

    // console.log("result", section)
    return section;
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
export async function getOrgKpiDashboardData() {

    const section: IKpiDashboardOutput = {
        INDICATOR_STATUS: [],
        INDICATOR_DATA: [],
        AVERAGE_INDICATOR_PERFORMANCE: [],
        INDICATOR_PERFORMANCE: [],
    }

    const indicators = await prisma.$queryRaw<IIndicatorView[]>`
        SELECT * FROM indicator_view;
      `;

    if (indicators.length == 0) {
        throw new Error("No indicator found for any project");
    }

    const result1 = await callOrgKpiProcedure(1, "ALL")
    section.INDICATOR_STATUS = result1

    const result2 = await callOrgKpiProcedure(9, "ALL")
    section.AVERAGE_INDICATOR_PERFORMANCE = result2

    const result3 = await callOrgKpiProcedure(10, "ALL")
    section.INDICATOR_PERFORMANCE = result3

    indicators.forEach(async (value: IIndicatorView, index: number, array: IIndicatorView[]) => {
        const data: IKpiDashboardData = {
            projectId: value.resultProjectId as string,
            resultTypeId: value.resultTypeId as string,
            disaggregationId: value.disaggregationId as string,
            data: []
        }
        if (value.disaggregationName == "DEPARTMENT") {
            const result = await callOrgKpiProcedure(2, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "AGE") {
            const result = await callOrgKpiProcedure(3, value.indicatorId)

        } else if (value.disaggregationName == "PRODUCT") {
            const result = await callOrgKpiProcedure(4, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "STATE") {
            const result = await callOrgKpiProcedure(5, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "LGA") {
            const result = await callOrgKpiProcedure(6, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "TENURE") {
            const result = await callOrgKpiProcedure(7, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        } else if (value.disaggregationName == "GENDER") {
            const result = await callOrgKpiProcedure(8, value.indicatorId)
            data.data = result
            section.INDICATOR_DATA.push(data)

        }
    })

    // console.log("result", section)
    return section;
}