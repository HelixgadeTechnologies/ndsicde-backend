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
exports.deleteRetirement = exports.getRetirementById = exports.getAllRetirements = exports.createOrUpdateRetirement = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrUpdateRetirement = (payload, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        return yield prisma.retirement.create({
            data: {
                activityLineDescription: payload.activityLineDescription,
                quantity: payload.quantity,
                frequency: payload.frequency,
                unitCost: payload.unitCost,
                actualCost: payload.actualCost,
                totalBudget: payload.totalBudget,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
                requestId: payload.requestId,
                status: payload.status,
            },
        });
    }
    else {
        if (!payload.retirementId) {
            throw new Error("retirementId is required for update");
        }
        return yield prisma.retirement.update({
            where: { retirementId: payload.retirementId },
            data: {
                activityLineDescription: payload.activityLineDescription,
                quantity: payload.quantity,
                frequency: payload.frequency,
                unitCost: payload.unitCost,
                actualCost: payload.actualCost,
                totalBudget: payload.totalBudget,
                documentName: payload.documentName,
                documentURL: payload.documentURL,
                requestId: payload.requestId,
                status: payload.status,
                updateAt: new Date(),
            },
        });
    }
});
exports.createOrUpdateRetirement = createOrUpdateRetirement;
const getAllRetirements = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.$queryRaw `
    SELECT * FROM retirement_view
  `;
});
exports.getAllRetirements = getAllRetirements;
const getRetirementById = (retirementId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$queryRaw `
    SELECT * FROM retirement_view WHERE "retirementId" = ${retirementId}
  `;
    return result.length > 0 ? result[0] : null;
});
exports.getRetirementById = getRetirementById;
const deleteRetirement = (retirementId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.retirement.delete({
        where: { retirementId },
    });
});
exports.deleteRetirement = deleteRetirement;
