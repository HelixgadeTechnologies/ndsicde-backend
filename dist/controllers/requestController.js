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
exports.getRequestsWithDateFilterController = exports.getDataValidationStatsController = exports.requestApprovalController = exports.deleteRequestController = exports.getRequestByIdController = exports.getAllRequestsController = exports.createOrUpdateRequestController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const requestService_1 = require("../service/requestService");
const createOrUpdateRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isCreate, payload } = req.body;
        const result = yield (0, requestService_1.createOrUpdateRequest)(payload, isCreate);
        return res.status(200).json((0, responseHandler_1.successResponse)(isCreate
            ? "Request created successfully"
            : "Request updated successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.createOrUpdateRequestController = createOrUpdateRequestController;
const getAllRequestsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, requestService_1.getAllRequests)();
        if (!result || result.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No Requests found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Requests fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getAllRequestsController = getAllRequestsController;
const getRequestByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, requestService_1.getRequestById)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Request not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Request fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getRequestByIdController = getRequestByIdController;
const deleteRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, requestService_1.deleteRequest)(id);
        if (!result) {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)("Request not found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Request deleted successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.deleteRequestController = deleteRequestController;
const requestApprovalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, approvalStatus, approvedBy, comment } = req.body;
        if (!requestId || !approvalStatus || !approvedBy) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("requestId, approvalStatus and approvedBy are required"));
        }
        if (approvalStatus !== 1 && approvalStatus !== 2) {
            return res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("approvalStatus must be 1 (Approved) or 2 (Rejected)"));
        }
        const result = yield (0, requestService_1.requestApproval)(requestId, approvalStatus, approvedBy, comment);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Request approval processed successfully", result));
    }
    catch (error) {
        if (error.message === "Request not found") {
            return res.status(404).json((0, responseHandler_1.notFoundResponse)(error.message, null));
        }
        return res.status(400).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.requestApprovalController = requestApprovalController;
const getDataValidationStatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const result = yield (0, requestService_1.getDataValidationStats)(startDate, endDate);
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Statistics fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getDataValidationStatsController = getDataValidationStatsController;
const getRequestsWithDateFilterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.body;
        const result = yield (0, requestService_1.getRequestsWithDateFilter)(startDate, endDate);
        if (!result || result.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("No requests found", null));
        }
        return res
            .status(200)
            .json((0, responseHandler_1.successResponse)("Requests fetched successfully", result));
    }
    catch (error) {
        return res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.getRequestsWithDateFilterController = getRequestsWithDateFilterController;
