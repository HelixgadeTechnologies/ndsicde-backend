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
exports.getRequestsWithDateFilter = exports.getDataValidationStats = exports.requestApproval = exports.deleteRequest = exports.getRequestById = exports.getAllRequests = exports.createOrUpdateRequest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrUpdateRequest = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.request.create({
            data: {
                staff: payload.staff,
                outputId: payload.outputId,
                activityTitle: payload.activityTitle,
                activityBudgetCode: payload.activityBudgetCode,
                activityLocation: payload.activityLocation,
                activityPurposeDescription: payload.activityPurposeDescription,
                activityStartDate: payload.activityStartDate,
                activityEndDate: payload.activityEndDate,
                activityLineDescription: payload.activityLineDescription,
                quantity: payload.quantity,
                frequency: payload.frequency,
                unitCost: payload.unitCost,
                budgetCode: payload.budgetCode,
                total: payload.total,
                modeOfTransport: payload.modeOfTransport,
                driverName: payload.driverName,
                driversPhoneNumber: payload.driversPhoneNumber,
                vehiclePlateNumber: payload.vehiclePlateNumber,
                vehicleColor: payload.vehicleColor,
                departureTime: payload.departureTime,
                route: payload.route,
                recipientPhoneNumber: payload.recipientPhoneNumber,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
                projectId: payload.projectId,
                status: payload.status,
            },
        });
    }
    else {
        return yield prisma.request.update({
            where: { requestId: payload.requestId },
            data: {
                staff: payload.staff,
                outputId: payload.outputId,
                activityTitle: payload.activityTitle,
                activityBudgetCode: payload.activityBudgetCode,
                activityLocation: payload.activityLocation,
                activityPurposeDescription: payload.activityPurposeDescription,
                activityStartDate: payload.activityStartDate,
                activityEndDate: payload.activityEndDate,
                activityLineDescription: payload.activityLineDescription,
                quantity: payload.quantity,
                frequency: payload.frequency,
                unitCost: payload.unitCost,
                budgetCode: payload.budgetCode,
                total: payload.total,
                modeOfTransport: payload.modeOfTransport,
                driverName: payload.driverName,
                driversPhoneNumber: payload.driversPhoneNumber,
                vehiclePlateNumber: payload.vehiclePlateNumber,
                vehicleColor: payload.vehicleColor,
                departureTime: payload.departureTime,
                route: payload.route,
                recipientPhoneNumber: payload.recipientPhoneNumber,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
                projectId: payload.projectId,
                status: payload.status,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateRequest = createOrUpdateRequest;
const getAllRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM request_view
  `;
});
exports.getAllRequests = getAllRequests;
const getRequestById = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM request_view WHERE "requestId" = ${requestId}
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getRequestById = getRequestById;
const deleteRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.request.delete({
        where: { requestId },
    });
});
exports.deleteRequest = deleteRequest;
const requestApproval = (requestId, approvalStatus, approvedBy, comment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield prisma.request.findUnique({ where: { requestId } });
        if (!request) {
            throw new Error("Request not found");
        }
        const approvalLevels = ["A", "B", "C", "D", "E"];
        let currentLevel = null;
        for (const level of approvalLevels) {
            const approvalField = `approval_${level}`;
            if (request[approvalField] === null || request[approvalField] === undefined) {
                currentLevel = level;
                break;
            }
        }
        if (!currentLevel) {
            throw new Error("All approval levels have already been processed");
        }
        const levelIndex = approvalLevels.indexOf(currentLevel);
        if (levelIndex > 0) {
            const previousLevel = approvalLevels[levelIndex - 1];
            const previousApprovalField = `approval_${previousLevel}`;
            if (request[previousApprovalField] !== 1) {
                throw new Error(`Cannot approve at level ${currentLevel}. Previous level ${previousLevel} must be approved first.`);
            }
        }
        let newStatus = request.status;
        if (approvalStatus === 2) {
            newStatus = "Rejected";
        }
        else if (approvalStatus === 1 && currentLevel === "E") {
            newStatus = "Approved";
        }
        else if (approvalStatus === 1) {
            newStatus = "Pending";
        }
        const updateData = {
            [`approval_${currentLevel}`]: approvalStatus,
            [`approvedBy_${currentLevel}`]: approvedBy,
            [`comment_${currentLevel}`]: comment || null,
            status: newStatus,
            updateAt: new Date(),
        };
        const updatedRequest = yield prisma.request.update({
            where: { requestId },
            data: updateData,
        });
        return updatedRequest;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.requestApproval = requestApproval;
const getDataValidationStats = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createAt = {};
            if (startDate)
                dateFilter.createAt.gte = new Date(startDate);
            if (endDate)
                dateFilter.createAt.lte = new Date(endDate);
        }
        const totalSubmissions = yield prisma.request.count({
            where: dateFilter,
        });
        const pendingReview = yield prisma.request.count({
            where: Object.assign(Object.assign({}, dateFilter), { status: "Pending" }),
        });
        const approved = yield prisma.request.count({
            where: Object.assign(Object.assign({}, dateFilter), { status: "Approved" }),
        });
        const rejected = yield prisma.request.count({
            where: Object.assign(Object.assign({}, dateFilter), { status: "Rejected" }),
        });
        const approvedRetirements = yield prisma.retirement.count({
            where: Object.assign(Object.assign({}, (startDate || endDate ? {
                createAt: Object.assign(Object.assign({}, (startDate && { gte: new Date(startDate) })), (endDate && { lte: new Date(endDate) }))
            } : {})), { status: "Approved" }),
        });
        let percentageFromLastMonth = 0;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = end.getTime() - start.getTime();
            const previousStart = new Date(start.getTime() - duration);
            const previousEnd = start;
            const previousSubmissions = yield prisma.request.count({
                where: {
                    createAt: {
                        gte: previousStart,
                        lt: previousEnd,
                    },
                },
            });
            if (previousSubmissions > 0) {
                percentageFromLastMonth =
                    ((totalSubmissions - previousSubmissions) / previousSubmissions) * 100;
            }
        }
        const approvalRate = totalSubmissions > 0
            ? (approved / totalSubmissions) * 100
            : 0;
        const rejectionRate = totalSubmissions > 0
            ? (rejected / totalSubmissions) * 100
            : 0;
        return {
            totalSubmissions,
            pendingReview,
            approved,
            rejected,
            pendingFinancialRequests: pendingReview,
            approvedRetirements,
            percentageFromLastMonth: Number(percentageFromLastMonth.toFixed(2)),
            approvalRate: Number(approvalRate.toFixed(2)),
            rejectionRate: Number(rejectionRate.toFixed(2)),
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getDataValidationStats = getDataValidationStats;
const getRequestsWithDateFilter = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createAt = {};
            if (startDate)
                dateFilter.createAt.gte = new Date(startDate);
            if (endDate)
                dateFilter.createAt.lte = new Date(endDate);
        }
        const requests = yield prisma.request.findMany({
            where: dateFilter,
            include: {
                project: {
                    select: {
                        projectName: true,
                    },
                },
            },
            orderBy: {
                createAt: 'desc',
            },
        });
        return requests;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getRequestsWithDateFilter = getRequestsWithDateFilter;
