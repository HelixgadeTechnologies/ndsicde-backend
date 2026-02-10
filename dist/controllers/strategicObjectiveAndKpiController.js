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
exports.fetchKpiByStrategicObjectiveId = exports.fetchKpiById = exports.fetchAllKpis = exports.removeKpi = exports.createOrUpdateKpi = exports.fetchStrategicObjectiveById = exports.fetchAllStrategicObjectives = exports.removeStrategicObjective = exports.createOrUpdateStrategicObjective = void 0;
const strategicObjectiveAndKpiService_1 = require("../service/strategicObjectiveAndKpiService");
const responseHandler_1 = require("../utils/responseHandler");
const createOrUpdateStrategicObjective = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { isCreate, data } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const result = yield (0, strategicObjectiveAndKpiService_1.saveStrategicObjective)(data, isCreate);
        const message = isCreate
            ? "Strategic Objective created successfully"
            : "Strategic Objective updated successfully";
        res.status(isCreate ? 201 : 200).json((0, responseHandler_1.successResponse)(message, result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateStrategicObjective = createOrUpdateStrategicObjective;
const removeStrategicObjective = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { strategicObjectiveId } = req.body;
    try {
        const deleted = yield (0, strategicObjectiveAndKpiService_1.deleteStrategicObjective)(strategicObjectiveId);
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Strategic Objective deleted successfully", deleted));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.removeStrategicObjective = removeStrategicObjective;
const fetchAllStrategicObjectives = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, strategicObjectiveAndKpiService_1.getAllStrategicObjectives)();
        res.status(200).json((0, responseHandler_1.successResponse)("List of Strategic Objectives", data));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchAllStrategicObjectives = fetchAllStrategicObjectives;
const fetchStrategicObjectiveById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const objective = yield (0, strategicObjectiveAndKpiService_1.getStrategicObjectiveById)(id);
        if (!objective) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Strategic Objective not found"));
        }
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Strategic Objective found", objective));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchStrategicObjectiveById = fetchStrategicObjectiveById;
const createOrUpdateKpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { isCreate, data } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const result = yield (0, strategicObjectiveAndKpiService_1.saveKpi)(data, isCreate);
        const message = isCreate
            ? "KPI created successfully"
            : "KPI updated successfully";
        res.status(isCreate ? 201 : 200).json((0, responseHandler_1.successResponse)(message, result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateKpi = createOrUpdateKpi;
const removeKpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { kpiId } = req.body;
    try {
        const result = yield (0, strategicObjectiveAndKpiService_1.deleteKpi)(kpiId);
        res.status(200).json((0, responseHandler_1.successResponse)("KPI deleted successfully", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.removeKpi = removeKpi;
const fetchAllKpis = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, strategicObjectiveAndKpiService_1.getAllKpis)();
        res.status(200).json((0, responseHandler_1.successResponse)("List of KPIs", data));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchAllKpis = fetchAllKpis;
const fetchKpiById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, strategicObjectiveAndKpiService_1.getKpiById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("KPI not found"));
        }
        res.status(200).json((0, responseHandler_1.successResponse)("KPI found", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchKpiById = fetchKpiById;
const fetchKpiByStrategicObjectiveId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { strategicObjectiveId } = req.params;
    try {
        const result = yield (0, strategicObjectiveAndKpiService_1.getKpiByStrategicObjectiveId)(strategicObjectiveId);
        if (!result || result.length == 0) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("KPI not found"));
        }
        res.status(200).json((0, responseHandler_1.successResponse)("KPI found", result));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.fetchKpiByStrategicObjectiveId = fetchKpiByStrategicObjectiveId;
