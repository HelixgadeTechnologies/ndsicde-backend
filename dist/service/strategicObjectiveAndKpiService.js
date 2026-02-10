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
exports.getKpiByStrategicObjectiveId = exports.getKpiById = exports.getAllKpis = exports.deleteKpi = exports.saveKpi = exports.getStrategicObjectiveById = exports.getAllStrategicObjectives = exports.deleteStrategicObjective = exports.saveStrategicObjective = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saveStrategicObjective = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        if (isCreate) {
            return yield prisma.strategicObjective.create({
                data: {
                    statement: (_a = data.statement) !== null && _a !== void 0 ? _a : null,
                    thematicAreas: (_b = data.thematicAreas) !== null && _b !== void 0 ? _b : null,
                    pillarLead: (_c = data.pillarLead) !== null && _c !== void 0 ? _c : null,
                    status: (_d = data.status) !== null && _d !== void 0 ? _d : null,
                },
            });
        }
        return yield prisma.strategicObjective.update({
            where: { strategicObjectiveId: data.strategicObjectiveId },
            data: {
                statement: (_e = data.statement) !== null && _e !== void 0 ? _e : null,
                thematicAreas: (_f = data.thematicAreas) !== null && _f !== void 0 ? _f : null,
                pillarLead: (_g = data.pillarLead) !== null && _g !== void 0 ? _g : null,
                status: (_h = data.status) !== null && _h !== void 0 ? _h : null,
                updateAt: new Date(),
            },
        });
    }
    catch (error) {
        throw error;
    }
});
exports.saveStrategicObjective = saveStrategicObjective;
const deleteStrategicObjective = (strategicObjectiveId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.kpi.deleteMany({
            where: { strategicObjectiveId },
        });
        return yield tx.strategicObjective.delete({
            where: { strategicObjectiveId },
        });
    }));
});
exports.deleteStrategicObjective = deleteStrategicObjective;
const getAllStrategicObjectives = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const strategicObjectivesWithCount = yield prisma.$queryRaw `
    SELECT * FROM strategic_objective_view
  `;
        const result = strategicObjectivesWithCount.map((obj) => (Object.assign(Object.assign({}, obj), { linkedKpi: obj.linkedKpi ? Number(obj.linkedKpi) : 0 })));
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllStrategicObjectives = getAllStrategicObjectives;
const getStrategicObjectiveById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.strategicObjective.findUnique({
        where: { strategicObjectiveId: id },
    });
});
exports.getStrategicObjectiveById = getStrategicObjectiveById;
const saveKpi = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    if (isCreate) {
        return prisma.kpi.create({
            data: {
                statement: (_a = data.statement) !== null && _a !== void 0 ? _a : null,
                definition: (_b = data.definition) !== null && _b !== void 0 ? _b : null,
                type: (_c = data.type) !== null && _c !== void 0 ? _c : null,
                specificAreas: (_d = data.specificAreas) !== null && _d !== void 0 ? _d : null,
                unitOfMeasure: (_e = data.unitOfMeasure) !== null && _e !== void 0 ? _e : null,
                itemInMeasure: (_f = data.itemInMeasure) !== null && _f !== void 0 ? _f : null,
                disaggregation: (_g = data.disaggregation) !== null && _g !== void 0 ? _g : null,
                baseLine: (_h = data.baseLine) !== null && _h !== void 0 ? _h : null,
                target: (_j = data.target) !== null && _j !== void 0 ? _j : null,
                strategicObjectiveId: (_k = data.strategicObjectiveId) !== null && _k !== void 0 ? _k : null,
            },
        });
    }
    return prisma.kpi.update({
        where: { kpiId: data.kpiId },
        data: {
            statement: (_l = data.statement) !== null && _l !== void 0 ? _l : null,
            definition: (_m = data.definition) !== null && _m !== void 0 ? _m : null,
            type: (_o = data.type) !== null && _o !== void 0 ? _o : null,
            specificAreas: (_p = data.specificAreas) !== null && _p !== void 0 ? _p : null,
            unitOfMeasure: (_q = data.unitOfMeasure) !== null && _q !== void 0 ? _q : null,
            itemInMeasure: (_r = data.itemInMeasure) !== null && _r !== void 0 ? _r : null,
            disaggregation: (_s = data.disaggregation) !== null && _s !== void 0 ? _s : null,
            baseLine: (_t = data.baseLine) !== null && _t !== void 0 ? _t : null,
            target: (_u = data.target) !== null && _u !== void 0 ? _u : null,
            strategicObjectiveId: (_v = data.strategicObjectiveId) !== null && _v !== void 0 ? _v : null,
            updateAt: new Date(),
        },
    });
});
exports.saveKpi = saveKpi;
const deleteKpi = (kpiId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.kpi.delete({ where: { kpiId } });
});
exports.deleteKpi = deleteKpi;
const getAllKpis = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.kpi.findMany();
});
exports.getAllKpis = getAllKpis;
const getKpiById = (kpiId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.kpi.findUnique({ where: { kpiId } });
});
exports.getKpiById = getKpiById;
const getKpiByStrategicObjectiveId = (strategicObjectiveId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.kpi.findMany({ where: { strategicObjectiveId } });
});
exports.getKpiByStrategicObjectiveId = getKpiByStrategicObjectiveId;
