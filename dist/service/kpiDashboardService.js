"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResultDashboardData = getResultDashboardData;
exports.getOrgKpiDashboardData = getOrgKpiDashboardData;
exports.getProjectActivityDashboardData = getProjectActivityDashboardData;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function normalizeBigInts(data) {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts);
    }
    if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data;
        }
        const normalized = {};
        for (const key in data) {
            const value = data[key];
            if (typeof value === 'bigint') {
                normalized[key] = Number(value);
            }
            else if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean') {
                normalized[key] = value;
            }
            else {
                normalized[key] = normalizeBigInts(value);
            }
        }
        return normalized;
    }
    return data;
}
function callProcedure(option, indicatorId, selectedProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const raws = yield prisma.$queryRawUnsafe(`CALL ResultDashboard(?,?,?)`, option, indicatorId, selectedProject);
        const cleaned = normalizeBigInts(raws);
        if (option == 1) {
            return cleaned.map((row) => ({
                ["totalSubmitted"]: Number(row.f0),
                ["totalPending"]: Number(row.f1),
                ["totalApproved"]: Number(row.f2),
                ["totalDeclined"]: Number(row.f3),
            }));
        }
        else if (option == 2) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 3) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 4) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 5) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 6) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 7) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 8) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 9) {
            return cleaned.map((row) => ({
                ["avgProjectPerformance"]: Number(row.f0),
            }));
        }
        else if (option == 10) {
            return cleaned.map((row) => ({
                ["indicatorId"]: row.f0,
                ["statement"]: row.f1,
                ["cumulativeTargetValue"]: Number(row.f2),
                ["cumulativeActualValue"]: Number(row.f3),
                ["achievementPercentage"]: Number(row.f4),
            }));
        }
        else {
            return [];
        }
    });
}
function getResultDashboardData(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const section = {
            INDICATOR_STATUS: [],
            INDICATOR_DATA: [],
            AVERAGE_INDICATOR_PERFORMANCE: [],
            INDICATOR_PERFORMANCE: [],
        };
        const indicators = yield prisma.$queryRaw `
        SELECT * FROM indicator_view WHERE resultProjectId = ${projectId};
      `;
        if (indicators.length == 0) {
            throw new Error("No indicator found for this project");
        }
        const result1 = yield callProcedure(1, "ALL", projectId);
        section.INDICATOR_STATUS = result1;
        const result2 = yield callProcedure(9, "ALL", projectId);
        section.AVERAGE_INDICATOR_PERFORMANCE = result2;
        const result3 = yield callProcedure(10, "ALL", projectId);
        section.INDICATOR_PERFORMANCE = result3;
        indicators.forEach((value, index, array) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                projectId: value.resultProjectId,
                resultTypeId: value.resultTypeId,
                disaggregationId: value.disaggregationId,
                data: []
            };
            if (value.disaggregationName == "DEPARTMENT") {
                const result = yield callProcedure(2, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "AGE") {
                const result = yield callProcedure(3, value.indicatorId, projectId);
            }
            else if (value.disaggregationName == "PRODUCT") {
                const result = yield callProcedure(4, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "STATE") {
                const result = yield callProcedure(5, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "LGA") {
                const result = yield callProcedure(6, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "TENURE") {
                const result = yield callProcedure(7, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "GENDER") {
                const result = yield callProcedure(8, value.indicatorId, projectId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
        }));
        return section;
    });
}
function callOrgKpiProcedure(option, indicatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const raws = yield prisma.$queryRawUnsafe(`CALL OrgKpiDashboard(?,?)`, option, indicatorId);
        const cleaned = normalizeBigInts(raws);
        if (option == 1) {
            return cleaned.map((row) => ({
                ["totalSubmitted"]: Number(row.f0),
                ["totalPending"]: Number(row.f1),
                ["totalApproved"]: Number(row.f2),
                ["totalDeclined"]: Number(row.f3),
            }));
        }
        else if (option == 2) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 3) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 4) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 5) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 6) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 7) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 8) {
            return cleaned.map((row) => ({
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
        }
        else if (option == 9) {
            return cleaned.map((row) => ({
                ["avgProjectPerformance"]: Number(row.f0),
            }));
        }
        else if (option == 10) {
            return cleaned.map((row) => ({
                ["indicatorId"]: row.f0,
                ["statement"]: row.f1,
                ["cumulativeTargetValue"]: Number(row.f2),
                ["cumulativeActualValue"]: Number(row.f3),
                ["achievementPercentage"]: Number(row.f4),
            }));
        }
        else {
            return [];
        }
    });
}
function getOrgKpiDashboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        const section = {
            INDICATOR_STATUS: [],
            INDICATOR_DATA: [],
            AVERAGE_INDICATOR_PERFORMANCE: [],
            INDICATOR_PERFORMANCE: [],
        };
        const indicators = yield prisma.$queryRaw `
        SELECT * FROM indicator_view;
      `;
        if (indicators.length == 0) {
            throw new Error("No indicator found for any project");
        }
        const result1 = yield callOrgKpiProcedure(1, "ALL");
        section.INDICATOR_STATUS = result1;
        const result2 = yield callOrgKpiProcedure(9, "ALL");
        section.AVERAGE_INDICATOR_PERFORMANCE = result2;
        const result3 = yield callOrgKpiProcedure(10, "ALL");
        section.INDICATOR_PERFORMANCE = result3;
        indicators.forEach((value, index, array) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                projectId: value.resultProjectId,
                resultTypeId: value.resultTypeId,
                disaggregationId: value.disaggregationId,
                data: []
            };
            if (value.disaggregationName == "DEPARTMENT") {
                const result = yield callOrgKpiProcedure(2, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "AGE") {
                const result = yield callOrgKpiProcedure(3, value.indicatorId);
            }
            else if (value.disaggregationName == "PRODUCT") {
                const result = yield callOrgKpiProcedure(4, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "STATE") {
                const result = yield callOrgKpiProcedure(5, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "LGA") {
                const result = yield callOrgKpiProcedure(6, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "TENURE") {
                const result = yield callOrgKpiProcedure(7, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
            else if (value.disaggregationName == "GENDER") {
                const result = yield callOrgKpiProcedure(8, value.indicatorId);
                data.data = result;
                section.INDICATOR_DATA.push(data);
            }
        }));
        return section;
    });
}
function callProjectActivityProcedure(option, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const raws = yield prisma.$queryRawUnsafe(`CALL GetProjectActivityFinanceDashboard(?,?)`, option, projectId);
        const cleaned = normalizeBigInts(raws);
        if (option == 1) {
            return cleaned.map((row) => ({
                ["totalProjects"]: Number(row.f0),
                ["underBudgetProjects"]: Number(row.f1),
                ["overBudgetProjects"]: Number(row.f2),
                ["onBudgetProjects"]: Number(row.f3),
                ["underBudgetPercentage"]: Number(row.f4),
                ["overBudgetPercentage"]: Number(row.f5),
                ["onBudgetPercentage"]: Number(row.f6),
            }));
        }
        else if (option == 2) {
            return cleaned.map((row) => ({
                ["projectId"]: String(row.f0),
                ["implementationTimeAnalysis"]: String(row.f1),
                ["totalActivities"]: Number(row.f2),
                ["percentage"]: Number(row.f3),
            }));
        }
        else if (option == 3) {
            return cleaned.map((row) => ({
                ["activityId"]: String(row.f0),
                ["outputId"]: String(row.f1),
                ["projectId"]: String(row.f2),
                ["activityStatement"]: String(row.f3),
                ["activityPlannedStartDate"]: row.f4,
                ["activityPlannedEndDate"]: row.f5,
                ["activityActualStartDate"]: row.f6,
                ["activityActualEndDate"]: row.f7,
                ["activityCompletionRate"]: Number(row.f8),
                ["budgetAtCompletion"]: Number(row.f9),
                ["actualCost"]: Number(row.f10),
                ["totalActivityPlannedDays"]: Number(row.f11),
                ["totalActivitySpentDays"]: Number(row.f12),
                ["daysVariance"]: Number(row.f13),
                ["percentageDaysSpent"]: Number(row.f14),
                ["earnedValue"]: Number(row.f15),
                ["plannedValue"]: Number(row.f16),
                ["costVariance"]: Number(row.f17),
                ["scheduleVariance"]: Number(row.f18),
                ["costPerformanceIndex"]: Number(row.f19),
                ["schedulePerformanceIndex"]: Number(row.f20),
                ["burnRate"]: String(row.f21),
                ["costPerformanceStatus"]: String(row.f22),
                ["schedulePerformanceStatus"]: String(row.f23),
                ["implementationTimeAnalysis"]: String(row.f24),
            }));
        }
        else {
            return [];
        }
    });
}
function getProjectActivityDashboardData(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = [
            'PROJECT_BUDGET_PERFORMANCE_SUMMARY',
            'IMPLEMENTATION_TIME_ANALYSIS',
            'ACTIVITY_FINANCIAL_DATA'
        ];
        const finalResult = {};
        for (let index = 0; index < keys.length; index++) {
            const result = yield callProjectActivityProcedure(index + 1, projectId);
            finalResult[keys[index]] = result;
        }
        return finalResult;
    });
}
