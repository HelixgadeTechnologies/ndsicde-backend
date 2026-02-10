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
exports.getLGADisaggregationByIndicatorId = exports.createOrUpdateLGADisaggregation = exports.getStateDisaggregationByIndicatorId = exports.createOrUpdateStateDisaggregation = exports.getDepartmentDisaggregationByIndicatorId = exports.createOrUpdateDepartmentDisaggregation = exports.getProductDisaggregationByIndicatorId = exports.createOrUpdateProductDisaggregation = exports.getGenderDisaggregationByIndicatorId = exports.createOrUpdateGenderAggregation = exports.getAllDisaggregation = exports.getResultType = exports.deleteLogicalFramework = exports.getLogicalFrameworkById = exports.getAllLogicalFrameworks = exports.createOrUpdateLogicalFramework = exports.deleteActivityReport = exports.getActivityReportById = exports.getAllActivityReports = exports.createOrUpdateActivityReport = exports.deleteActivity = exports.getActivityById = exports.getAllActivities = exports.createOrUpdateActivity = exports.deleteOutput = exports.getOutputById = exports.getAllOutputs = exports.createOrUpdateOutput = exports.deleteOutcome = exports.getOutcomeViewById = exports.getAllOutcomesView = exports.saveOutcome = exports.deleteIndicator = exports.getIndicatorByIdView = exports.getAllImpactIndicatorsByResultIdView = exports.createOrUpdateIndicator = exports.deleteImpact = exports.getAllImpact = exports.createOrUpdateImpact = exports.deletePartner = exports.getAllPartners = exports.createOrUpdatePartner = exports.deleteTeamMember = exports.getAllTeamMember = exports.createOrUpdateTeamMember = exports.deleteProject = exports.getProjectById = exports.getProjectsStatus = exports.getAllProjects = exports.saveProject = void 0;
exports.getAgeDisaggregationByIndicatorId = exports.createOrUpdateAgeDisaggregation = exports.getTenureDisaggregationByIndicatorId = exports.createOrUpdateTenureDisaggregation = void 0;
exports.saveIndicatorReport = saveIndicatorReport;
exports.getAllIndicatorReportByResultId = getAllIndicatorReportByResultId;
exports.getIndicatorReportById = getIndicatorReportById;
exports.deleteIndicatorReport = deleteIndicatorReport;
const client_1 = require("@prisma/client");
const projectManagementInterface_1 = require("../interface/projectManagementInterface");
const prisma = new client_1.PrismaClient();
const saveProject = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    if (isCreate) {
        return yield prisma.project.create({
            data: {
                projectName: (_a = data.projectName) !== null && _a !== void 0 ? _a : null,
                budgetCurrency: (_b = data.budgetCurrency) !== null && _b !== void 0 ? _b : null,
                totalBudgetAmount: (_c = data.totalBudgetAmount) !== null && _c !== void 0 ? _c : null,
                startDate: (_d = data.startDate) !== null && _d !== void 0 ? _d : undefined,
                endDate: (_e = data.endDate) !== null && _e !== void 0 ? _e : undefined,
                country: (_f = data.country) !== null && _f !== void 0 ? _f : null,
                state: (_g = data.state) !== null && _g !== void 0 ? _g : null,
                localGovernment: (_h = data.localGovernment) !== null && _h !== void 0 ? _h : null,
                community: (_j = data.community) !== null && _j !== void 0 ? _j : null,
                thematicAreasOrPillar: (_k = data.thematicAreasOrPillar) !== null && _k !== void 0 ? _k : null,
                status: (_l = data.status) !== null && _l !== void 0 ? _l : null,
                strategicObjectiveId: (_m = data.strategicObjectiveId) !== null && _m !== void 0 ? _m : null,
            },
        });
    }
    return yield prisma.project.update({
        where: { projectId: data.projectId },
        data: {
            projectName: (_o = data.projectName) !== null && _o !== void 0 ? _o : null,
            budgetCurrency: (_p = data.budgetCurrency) !== null && _p !== void 0 ? _p : null,
            totalBudgetAmount: (_q = data.totalBudgetAmount) !== null && _q !== void 0 ? _q : null,
            startDate: (_r = data.startDate) !== null && _r !== void 0 ? _r : undefined,
            endDate: (_s = data.endDate) !== null && _s !== void 0 ? _s : undefined,
            country: (_t = data.country) !== null && _t !== void 0 ? _t : null,
            state: (_u = data.state) !== null && _u !== void 0 ? _u : null,
            localGovernment: (_v = data.localGovernment) !== null && _v !== void 0 ? _v : null,
            community: (_w = data.community) !== null && _w !== void 0 ? _w : null,
            thematicAreasOrPillar: (_x = data.thematicAreasOrPillar) !== null && _x !== void 0 ? _x : null,
            status: (_y = data.status) !== null && _y !== void 0 ? _y : null,
            strategicObjectiveId: (_z = data.strategicObjectiveId) !== null && _z !== void 0 ? _z : null,
            updateAt: new Date(),
        },
    });
});
exports.saveProject = saveProject;
const getAllProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield prisma.$queryRaw `
  SELECT * FROM project_view
`;
    return projects;
});
exports.getAllProjects = getAllProjects;
const getProjectsStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const outcomes = yield prisma.$queryRaw `
    SELECT * FROM project_status_summary_view
  `;
    const data = outcomes.map((v) => ({
        totalProjects: Number(v.totalProjects),
        activeProjects: Number(v.activeProjects),
        completedProjects: Number(v.completedProjects),
        onHoldProjects: Number(v.onHoldProjects),
    }));
    return data[0];
});
exports.getProjectsStatus = getProjectsStatus;
const getProjectById = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.project.findUnique({
        where: { projectId },
    });
});
exports.getProjectById = getProjectById;
const deleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.project.delete({
        where: { projectId },
    });
});
exports.deleteProject = deleteProject;
const createOrUpdateTeamMember = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma.user.findUnique({ where: { email: payload.email } });
    if (!existingUser) {
        throw new Error("No user found with this email");
    }
    if (isCreate) {
        return yield prisma.teamMember.create({
            data: {
                userId: existingUser.userId,
                fullName: String(existingUser.fullName),
                email: String(existingUser.email),
                roleId: payload.roleId,
                projectId: payload.projectId,
            },
        });
    }
    else {
        if (!payload.teamMemberId) {
            throw new Error("teamMemberId is required for update");
        }
        return yield prisma.teamMember.update({
            where: { teamMemberId: payload.teamMemberId },
            data: {
                userId: existingUser.userId,
                fullName: String(existingUser.fullName),
                email: String(existingUser.email),
                roleId: payload.roleId,
                projectId: payload.projectId,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateTeamMember = createOrUpdateTeamMember;
const getAllTeamMember = () => __awaiter(void 0, void 0, void 0, function* () {
    const teamMembers = yield prisma.$queryRaw `
  SELECT * FROM team_member_view
`;
    return teamMembers;
});
exports.getAllTeamMember = getAllTeamMember;
const deleteTeamMember = (teamMemberId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.teamMember.delete({
        where: { teamMemberId },
    });
});
exports.deleteTeamMember = deleteTeamMember;
const createOrUpdatePartner = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.partner.create({
            data: {
                organizationName: payload.organizationName,
                email: payload.email,
                roleId: payload.roleId,
                projectId: payload.projectId,
            },
        });
    }
    else {
        if (!payload.partnerId) {
            throw new Error("partnerId is required for update");
        }
        return yield prisma.partner.update({
            where: { partnerId: payload.partnerId },
            data: {
                organizationName: payload.organizationName,
                email: payload.email,
                roleId: payload.roleId,
                projectId: payload.projectId,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdatePartner = createOrUpdatePartner;
const getAllPartners = () => __awaiter(void 0, void 0, void 0, function* () {
    const partners = yield prisma.$queryRaw `
    SELECT * FROM partner_view
  `;
    return partners;
});
exports.getAllPartners = getAllPartners;
const deletePartner = (partnerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.partner.delete({
        where: { partnerId },
    });
});
exports.deletePartner = deletePartner;
const createOrUpdateImpact = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.impact.create({
            data: {
                statement: payload.statement,
                thematicArea: payload.thematicArea,
                responsiblePerson: payload.responsiblePerson,
                projectId: payload.projectId,
                resultTypeId: payload.resultTypeId
            },
        });
    }
    else {
        if (!payload.impactId) {
            throw new Error("impactId is required for update");
        }
        return yield prisma.impact.update({
            where: { impactId: payload.impactId },
            data: {
                statement: payload.statement,
                thematicArea: payload.thematicArea,
                responsiblePerson: payload.responsiblePerson,
                projectId: payload.projectId,
                resultTypeId: payload.resultTypeId,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateImpact = createOrUpdateImpact;
const getAllImpact = () => __awaiter(void 0, void 0, void 0, function* () {
    const impacts = yield prisma.$queryRaw `
    SELECT * FROM impact_view
  `;
    return impacts;
});
exports.getAllImpact = getAllImpact;
const deleteImpact = (impactId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.impact.delete({
        where: { impactId },
    });
});
exports.deleteImpact = deleteImpact;
const createOrUpdateIndicator = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.indicator.create({
            data: {
                indicatorSource: payload.indicatorSource,
                thematicAreasOrPillar: payload.thematicAreasOrPillar,
                statement: payload.statement,
                linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
                definition: payload.definition,
                specificArea: payload.specificArea,
                unitOfMeasure: payload.unitOfMeasure,
                itemInMeasure: payload.itemInMeasure,
                disaggregationId: payload.disaggregationId,
                baseLineDate: payload.baseLineDate,
                cumulativeValue: payload.cumulativeValue,
                baselineNarrative: payload.baselineNarrative,
                targetDate: payload.targetDate,
                cumulativeTarget: payload.cumulativeTarget,
                targetNarrative: payload.targetNarrative,
                targetType: payload.targetType,
                responsiblePersons: payload.responsiblePersons,
                result: payload.result,
                resultTypeId: payload.resultTypeId
            },
        });
    }
    return yield prisma.indicator.update({
        where: { indicatorId: payload.indicatorId },
        data: {
            indicatorSource: payload.indicatorSource,
            thematicAreasOrPillar: payload.thematicAreasOrPillar,
            statement: payload.statement,
            linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
            definition: payload.definition,
            specificArea: payload.specificArea,
            unitOfMeasure: payload.unitOfMeasure,
            itemInMeasure: payload.itemInMeasure,
            disaggregationId: payload.disaggregationId,
            baseLineDate: payload.baseLineDate,
            cumulativeValue: payload.cumulativeValue,
            baselineNarrative: payload.baselineNarrative,
            targetDate: payload.targetDate,
            cumulativeTarget: payload.cumulativeTarget,
            targetNarrative: payload.targetNarrative,
            targetType: payload.targetType,
            responsiblePersons: payload.responsiblePersons,
            result: payload.result,
            resultTypeId: payload.resultTypeId,
            updateAt: new Date(),
        },
    });
});
exports.createOrUpdateIndicator = createOrUpdateIndicator;
const getAllImpactIndicatorsByResultIdView = (resultId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM indicator_view WHERE result = ${resultId};
  `;
});
exports.getAllImpactIndicatorsByResultIdView = getAllImpactIndicatorsByResultIdView;
const getIndicatorByIdView = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM indicator_view WHERE indicatorId = ${id};
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getIndicatorByIdView = getIndicatorByIdView;
const deleteIndicator = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.indicatorReport.deleteMany({ where: { indicatorId } });
    return yield prisma.indicator.delete({
        where: { indicatorId },
    });
});
exports.deleteIndicator = deleteIndicator;
function saveIndicatorReport(payload, isCreate) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isCreate) {
            return yield prisma.indicatorReport.create({
                data: {
                    indicatorSource: payload.indicatorSource,
                    thematicAreasOrPillar: payload.thematicAreasOrPillar,
                    indicatorStatement: payload.indicatorStatement,
                    responsiblePersons: payload.responsiblePersons,
                    disaggregationId: payload.disaggregationId,
                    actualDate: payload.actualDate,
                    cumulativeActual: payload.cumulativeActual,
                    actualNarrative: payload.actualNarrative,
                    attachmentUrl: payload.attachmentUrl,
                    status: projectManagementInterface_1.IReportStatus.pending,
                    resultTypeId: payload.resultTypeId,
                    indicatorId: payload.indicatorId,
                },
            });
        }
        else {
            if (!payload.indicatorReportId) {
                throw new Error("indicatorReportId is required for update");
            }
            return yield prisma.indicatorReport.update({
                where: {
                    indicatorReportId: payload.indicatorReportId,
                },
                data: {
                    indicatorSource: payload.indicatorSource,
                    thematicAreasOrPillar: payload.thematicAreasOrPillar,
                    indicatorStatement: payload.indicatorStatement,
                    responsiblePersons: payload.responsiblePersons,
                    disaggregationId: payload.disaggregationId,
                    actualDate: payload.actualDate,
                    cumulativeActual: payload.cumulativeActual,
                    actualNarrative: payload.actualNarrative,
                    attachmentUrl: payload.attachmentUrl,
                    status: payload.status,
                    resultTypeId: payload.resultTypeId,
                    indicatorId: payload.indicatorId,
                    updateAt: new Date(),
                },
            });
        }
    });
}
function getAllIndicatorReportByResultId(resultId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.$queryRaw `
    SELECT * FROM indicator_report_view WHERE result = ${resultId};
  `;
    });
}
function getIndicatorReportById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.$queryRaw `
    SELECT * FROM indicator_report_view
    WHERE indicatorReportId = ${id}
  `;
        return result.length > 0 ? result[0] : null;
    });
}
function deleteIndicatorReport(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.indicatorReport.delete({
            where: { indicatorReportId: id },
        });
    });
}
const saveOutcome = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (isCreate) {
            return yield prisma.outcome.create({
                data: {
                    outcomeStatement: payload.outcomeStatement,
                    outcomeType: payload.outcomeType,
                    impactId: payload.impactId,
                    thematicAreas: payload.thematicAreas,
                    responsiblePerson: payload.responsiblePerson,
                    projectId: payload.projectId,
                    resultTypeId: payload.resultTypeId,
                },
            });
        }
        else {
            if (!payload.outcomeId) {
                throw new Error("Outcome ID is required for update.");
            }
            return yield prisma.outcome.update({
                where: { outcomeId: payload.outcomeId },
                data: {
                    outcomeStatement: payload.outcomeStatement,
                    outcomeType: payload.outcomeType,
                    impactId: payload.impactId,
                    thematicAreas: payload.thematicAreas,
                    responsiblePerson: payload.responsiblePerson,
                    projectId: payload.projectId,
                    resultTypeId: payload.resultTypeId,
                    updateAt: new Date(),
                },
            });
        }
    }
    catch (error) {
        throw error;
    }
});
exports.saveOutcome = saveOutcome;
const getAllOutcomesView = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM outcome_view
  `;
});
exports.getAllOutcomesView = getAllOutcomesView;
const getOutcomeViewById = (outcomeId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield prisma.$queryRaw `
    SELECT * FROM outcome_view WHERE outcomeId = ${outcomeId}
  `;
    return results.length > 0 ? results[0] : null;
});
exports.getOutcomeViewById = getOutcomeViewById;
const deleteOutcome = (outcomeId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.outcome.delete({
        where: { outcomeId },
    });
});
exports.deleteOutcome = deleteOutcome;
const createOrUpdateOutput = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.output.create({
            data: {
                outputStatement: payload.outputStatement,
                outcomeId: payload.outcomeId,
                thematicAreas: payload.thematicAreas,
                responsiblePerson: payload.responsiblePerson,
                projectId: payload.projectId,
                resultTypeId: payload.resultTypeId,
            },
        });
    }
    else {
        if (!payload.outputId) {
            throw new Error("outputId is required for update");
        }
        return yield prisma.output.update({
            where: { outputId: payload.outputId },
            data: {
                outputStatement: payload.outputStatement,
                outcomeId: payload.outcomeId,
                thematicAreas: payload.thematicAreas,
                responsiblePerson: payload.responsiblePerson,
                projectId: payload.projectId,
                resultTypeId: payload.resultTypeId,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateOutput = createOrUpdateOutput;
const getAllOutputs = () => __awaiter(void 0, void 0, void 0, function* () {
    const outputs = yield prisma.$queryRaw `
    SELECT * FROM output_view
  `;
    return outputs;
});
exports.getAllOutputs = getAllOutputs;
const getOutputById = (outputId) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield prisma.$queryRaw `
    SELECT * FROM output_view WHERE "outputId" = ${outputId}
  `;
    return rows.length > 0 ? rows[0] : null;
});
exports.getOutputById = getOutputById;
const deleteOutput = (outputId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.output.delete({
        where: { outputId },
    });
});
exports.deleteOutput = deleteOutput;
const createOrUpdateActivity = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.activity.create({
            data: {
                activityStatement: payload.activityStatement,
                outputId: payload.outputId,
                activityTotalBudget: payload.activityTotalBudget,
                responsiblePerson: payload.responsiblePerson,
                startDate: payload.startDate,
                endDate: payload.endDate,
                activityFrequency: payload.activityFrequency,
                subActivity: payload.subActivity,
                descriptionAction: payload.descriptionAction,
                deliveryDate: payload.deliveryDate,
                projectId: payload.projectId,
            },
        });
    }
    else {
        if (!payload.activityId) {
            throw new Error("activityId is required for update");
        }
        return yield prisma.activity.update({
            where: { activityId: payload.activityId },
            data: {
                activityStatement: payload.activityStatement,
                outputId: payload.outputId,
                activityTotalBudget: payload.activityTotalBudget,
                responsiblePerson: payload.responsiblePerson,
                startDate: payload.startDate,
                endDate: payload.endDate,
                activityFrequency: payload.activityFrequency,
                subActivity: payload.subActivity,
                descriptionAction: payload.descriptionAction,
                deliveryDate: payload.deliveryDate,
                projectId: payload.projectId,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateActivity = createOrUpdateActivity;
const getAllActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM activity_view
  `;
});
exports.getAllActivities = getAllActivities;
const getActivityById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM activity_view WHERE activityId = ${id}
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getActivityById = getActivityById;
const deleteActivity = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.activity.delete({
        where: { activityId: id },
    });
});
exports.deleteActivity = deleteActivity;
const createOrUpdateActivityReport = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.activityReport.create({
            data: {
                activityId: payload.activityId,
                percentageCompletion: payload.percentageCompletion,
                actualStartDate: payload.actualStartDate,
                actualEndDate: payload.actualEndDate,
                actualCost: payload.actualCost,
                actualNarrative: payload.actualNarrative,
            },
        });
    }
    else {
        if (!payload.activityReportId) {
            throw new Error("activityReportId is required for update");
        }
        return yield prisma.activityReport.update({
            where: { activityReportId: payload.activityReportId },
            data: {
                activityId: payload.activityId,
                percentageCompletion: payload.percentageCompletion,
                actualStartDate: payload.actualStartDate,
                actualEndDate: payload.actualEndDate,
                actualCost: payload.actualCost,
                actualNarrative: payload.actualNarrative,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateActivityReport = createOrUpdateActivityReport;
const getAllActivityReports = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM activity_report_view
  `;
});
exports.getAllActivityReports = getAllActivityReports;
const getActivityReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM activity_report_view WHERE activityReportId = ${id}
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getActivityReportById = getActivityReportById;
const deleteActivityReport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.activityReport.delete({
        where: { activityReportId: id },
    });
});
exports.deleteActivityReport = deleteActivityReport;
const createOrUpdateLogicalFramework = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.logicalFramework.create({
            data: {
                projectId: payload.projectId,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
            },
        });
    }
    else {
        if (!payload.logicalFrameworkId) {
            throw new Error("logicalFrameworkId is required for update");
        }
        return yield prisma.logicalFramework.update({
            where: { logicalFrameworkId: payload.logicalFrameworkId },
            data: {
                projectId: payload.projectId,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateLogicalFramework = createOrUpdateLogicalFramework;
const getAllLogicalFrameworks = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM logical_framework_view
  `;
});
exports.getAllLogicalFrameworks = getAllLogicalFrameworks;
const getLogicalFrameworkById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM logical_framework_view WHERE logicalFrameworkId = ${id}
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getLogicalFrameworkById = getLogicalFrameworkById;
const deleteLogicalFramework = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.logicalFramework.delete({
        where: { logicalFrameworkId: id },
    });
});
exports.deleteLogicalFramework = deleteLogicalFramework;
const getResultType = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.resultType.findMany();
});
exports.getResultType = getResultType;
const getAllDisaggregation = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.disaggregation.findMany();
});
exports.getAllDisaggregation = getAllDisaggregation;
const createOrUpdateGenderAggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.genderDisaggregation.create({
            data: {
                targetMale: Number(payload.targetMale),
                targetFemale: Number(payload.targetFemale),
                actualMale: Number(payload.actualMale),
                actualFemale: Number(payload.actualFemale),
                disaggregationId: payload.disaggregationId,
                indicatorId: payload.indicatorId,
            },
        });
    }
    else {
        if (!payload.genderDisaggregationId) {
            throw new Error("gender disaggregation Id is required for update");
        }
        return yield prisma.genderDisaggregation.update({
            where: { genderDisaggregationId: payload.genderDisaggregationId },
            data: {
                targetMale: Number(payload.targetMale),
                targetFemale: Number(payload.targetFemale),
                actualMale: Number(payload.actualMale),
                actualFemale: Number(payload.actualFemale),
                disaggregationId: payload.disaggregationId,
                indicatorId: payload.indicatorId,
            },
        });
    }
});
exports.createOrUpdateGenderAggregation = createOrUpdateGenderAggregation;
const getGenderDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.genderDisaggregation.findMany({ where: { indicatorId } });
});
exports.getGenderDisaggregationByIndicatorId = getGenderDisaggregationByIndicatorId;
const createOrUpdateProductDisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.productDisaggregation.createMany({
            data: payload.map(item => ({
                ProductName: item.productName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.productDisaggregation.update({
            where: { productDisaggregationId: item.productDisaggregationId },
            data: {
                productName: item.productName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateProductDisaggregation = createOrUpdateProductDisaggregation;
const getProductDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.productDisaggregation.findMany({ where: { indicatorId } });
});
exports.getProductDisaggregationByIndicatorId = getProductDisaggregationByIndicatorId;
const createOrUpdateDepartmentDisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.departmentDisaggregation.createMany({
            data: payload.map(item => ({
                departmentName: item.departmentName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.departmentDisaggregation.update({
            where: { departmentDisaggregationId: item.departmentDisaggregationId },
            data: {
                departmentName: item.departmentName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateDepartmentDisaggregation = createOrUpdateDepartmentDisaggregation;
const getDepartmentDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.departmentDisaggregation.findMany({ where: { indicatorId } });
});
exports.getDepartmentDisaggregationByIndicatorId = getDepartmentDisaggregationByIndicatorId;
const createOrUpdateStateDisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.stateDisaggregation.createMany({
            data: payload.map(item => ({
                stateName: item.stateName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.stateDisaggregation.update({
            where: { stateDisaggregationId: item.stateDisaggregationId },
            data: {
                stateName: item.stateName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateStateDisaggregation = createOrUpdateStateDisaggregation;
const getStateDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.stateDisaggregation.findMany({ where: { indicatorId } });
});
exports.getStateDisaggregationByIndicatorId = getStateDisaggregationByIndicatorId;
const createOrUpdateLGADisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.lgaDisaggregation.createMany({
            data: payload.map(item => ({
                lgaName: item.lgaName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.lgaDisaggregation.update({
            where: { lgaDisaggregationId: item.lgaDisaggregationId },
            data: {
                lgaName: item.lgaName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateLGADisaggregation = createOrUpdateLGADisaggregation;
const getLGADisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.lgaDisaggregation.findMany({ where: { indicatorId } });
});
exports.getLGADisaggregationByIndicatorId = getLGADisaggregationByIndicatorId;
const createOrUpdateTenureDisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.tenureDisaggregation.createMany({
            data: payload.map(item => ({
                tenureName: item.tenureName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.tenureDisaggregation.update({
            where: { tenureDisaggregationId: item.tenureDisaggregationId },
            data: {
                tenureName: item.tenureName,
                targetCount: Number(item.targetCount),
                actualCount: Number(item.actualCount),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateTenureDisaggregation = createOrUpdateTenureDisaggregation;
const getTenureDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tenureDisaggregation.findMany({ where: { indicatorId } });
});
exports.getTenureDisaggregationByIndicatorId = getTenureDisaggregationByIndicatorId;
const createOrUpdateAgeDisaggregation = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.ageDisaggregation.createMany({
            data: payload.map(item => ({
                targetFrom: Number(item.targetFrom),
                targetTo: Number(item.targetTo),
                actualFrom: Number(item.targetFrom),
                actualTo: Number(item.targetTo),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            })),
        });
    }
    else {
        const updateOperations = payload.map((item) => prisma.ageDisaggregation.update({
            where: { ageDisaggregationId: item.ageDisaggregationId },
            data: {
                targetFrom: Number(item.targetFrom),
                targetTo: Number(item.targetTo),
                actualFrom: Number(item.targetFrom),
                actualTo: Number(item.targetTo),
                disaggregationId: item.disaggregationId,
                indicatorId: item.indicatorId,
            },
        }));
        return yield prisma.$transaction(updateOperations);
    }
});
exports.createOrUpdateAgeDisaggregation = createOrUpdateAgeDisaggregation;
const getAgeDisaggregationByIndicatorId = (indicatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.ageDisaggregation.findMany({ where: { indicatorId } });
});
exports.getAgeDisaggregationByIndicatorId = getAgeDisaggregationByIndicatorId;
