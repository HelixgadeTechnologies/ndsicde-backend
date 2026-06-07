import { successResponse, errorResponse, notFoundResponse } from "../utils/responseHandler";
import { IRequest } from "../interface/requestInterface";
import {
  createOrUpdateRequest,
  deleteRequest,
  getAllRequests,
  getRequestById,
  requestApproval,
  getDataValidationStats,
  getRequestsWithDateFilter,
  getRequestsByProjectId,
} from "../service/requestService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const createOrUpdateRequestController = asyncHandler(async (req, res) => {
  const { isCreate, payload } = req.body as { isCreate: boolean; payload: IRequest };
  if (!isCreate && !payload.requestId) {
    return res.status(400).json(errorResponse("requestId is required in payload when isCreate is false"));
  }
  const result = await createOrUpdateRequest(payload, isCreate);
  return res.status(200).json(successResponse(isCreate ? "Request created successfully" : "Request updated successfully", result));
});

export const getAllRequestsController = asyncHandler(async (_req, res) => {
  const result = await getAllRequests();
  if (!result || result.length === 0) {
    return res.status(404).json(notFoundResponse("No Requests found", null));
  }
  return res.status(200).json(successResponse("Requests fetched successfully", result));
});

export const getRequestByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getRequestById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("Request not found", null));
  }
  return res.status(200).json(successResponse("Request fetched successfully", result));
});

export const deleteRequestController = asyncHandler(async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).json(errorResponse("requestId is required"));
  }
  const result = await deleteRequest(requestId);
  if (!result) {
    return res.status(404).json(notFoundResponse("Request not found", null));
  }
  return res.status(200).json(successResponse("Request deleted successfully", result));
});

export const requestApprovalController = asyncHandler(async (req, res) => {
  const { requestId, approvalStatus, approvedBy, comment } = req.body;
  if (!requestId || !approvalStatus || !approvedBy) {
    return res.status(400).json(errorResponse("requestId, approvalStatus and approvedBy are required"));
  }
  if (![1, 2, 3].includes(Number(approvalStatus))) {
    return res.status(400).json(errorResponse("approvalStatus must be 1 (Approved), 2 (Rejected) or 3 (Review)"));
  }
  const result = await requestApproval(requestId, approvalStatus, approvedBy, comment);
  return res.status(200).json(successResponse("Request approval processed successfully", result));
});

export const getDataValidationStatsController = asyncHandler(async (req, res) => {
  const { startDate, endDate, projectId } = req.query;
  const result = await getDataValidationStats(startDate as string, endDate as string, projectId as string);
  return res.status(200).json(successResponse("Statistics fetched successfully", result));
});

export const getRequestsWithDateFilterController = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const result = await getRequestsWithDateFilter(startDate, endDate);
  if (!result || result.length === 0) {
    return res.status(404).json(notFoundResponse("No requests found", null));
  }
  return res.status(200).json(successResponse("Requests fetched successfully", result));
});

export const getRequestsByProjectIdController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json(errorResponse("projectId is required"));
  }
  const result = await getRequestsByProjectId(projectId);
  if (!result || result.length === 0) {
    return res.status(404).json(notFoundResponse("No requests found for this project", null));
  }
  return res.status(200).json(successResponse("Requests fetched successfully", result));
});
