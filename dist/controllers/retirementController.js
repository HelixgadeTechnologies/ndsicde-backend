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
exports.removeRetirement = exports.getRetirement = exports.getRetirements = exports.createOrUpdateRetirementController = void 0;
const retirementService_1 = require("../service/retirementService");
const responseHandler_1 = require("../utils/responseHandler");
const createOrUpdateRetirementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, retirementService_1.createOrUpdateRetirement)(payload, isCreate);
        return res.status(200).json((0, responseHandler_1.successResponse)(isCreate
            ? "Retirement created successfully"
            : "Retirement updated successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateRetirementController = createOrUpdateRetirementController;
const getRetirements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, retirementService_1.getAllRetirements)();
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Retirements fetched successfully", results));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getRetirements = getRetirements;
const getRetirement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retirementId } = req.params;
        const result = yield (0, retirementService_1.getRetirementById)(retirementId);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Retirement not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Retirement fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getRetirement = getRetirement;
const removeRetirement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retirementId } = req.params;
        const result = yield (0, retirementService_1.deleteRetirement)(retirementId);
        if (!result) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("Retirement not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Retirement deleted successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.removeRetirement = removeRetirement;
