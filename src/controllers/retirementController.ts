import { IRetirement } from "../interface/retirementInterface";
import {
  createOrUpdateRetirement,
  deleteRetirement,
  getAllRetirements,
  getRetirementById,
  approveRetirement,
  getRetirementByProjectId,
} from "../service/retirementService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const createOrUpdateRetirementController = asyncHandler(async (req, res) => {
  const { isCreate, payload } = req.body as { isCreate: boolean; payload: IRetirement };
  if (!isCreate && !payload.retirementId) {
    return res.status(400).json(errorResponse("retirementId is required in payload when isCreate is false"));
  }
  if (payload.lineItems && payload.lineItems.length > 0 && !payload.requestId) {
    return res.status(400).json(errorResponse("requestId is required in payload when lineItems are provided"));
  }
  const result = await createOrUpdateRetirement(payload, isCreate);
  return res.status(200).json(successResponse(isCreate ? "Retirement created successfully" : "Retirement updated successfully", result));
});

export const getRetirements = asyncHandler(async (_req, res) => {
  const results = await getAllRetirements();
  return res.status(200).json(successResponse("Retirements fetched successfully", results));
});

export const getRetirement = asyncHandler(async (req, res) => {
  const { retirementId } = req.params;
  const result = await getRetirementById(retirementId);
  if (!result) {
    return res.status(404).json(notFoundResponse("Retirement not found", null));
  }
  return res.status(200).json(successResponse("Retirement fetched successfully", result));
});

export const removeRetirement = asyncHandler(async (req, res) => {
  const { retirementId } = req.body;
  if (!retirementId) {
    return res.status(400).json(errorResponse("retirementId is required"));
  }
  const result = await deleteRetirement(retirementId);
  if (!result) {
    return res.status(404).json(notFoundResponse("Retirement not found", null));
  }
  return res.status(200).json(successResponse("Retirement deleted successfully", result));
});

export const approveRetirementController = asyncHandler(async (req, res) => {
  const { retirementId, approvalStatus, approvedBy, comment } = req.body;
  if (!retirementId || approvalStatus === undefined || !approvedBy) {
    return res.status(400).json(errorResponse("retirementId, approvalStatus and approvedBy are required"));
  }
  if (![1, 2, 3].includes(Number(approvalStatus))) {
    return res.status(400).json(errorResponse("approvalStatus must be 1 (Approved), 2 (Rejected) or 3 (Review)"));
  }
  const result = await approveRetirement(retirementId, Number(approvalStatus), approvedBy, comment);
  return res.status(200).json(successResponse("Retirement approval processed successfully", result));
});

export const getRetirementByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const results = await getRetirementByProjectId(projectId);
  if (!results || results.length === 0) {
    return res.status(404).json(notFoundResponse("No retirements found for this project", null));
  }
  return res.status(200).json(successResponse("Retirements fetched successfully", results));
});
