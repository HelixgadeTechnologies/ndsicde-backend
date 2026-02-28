import { Request, Response } from "express";

import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../utils/responseHandler";
import { IRequest } from "../interface/requestInterface";
import {
  createOrUpdateRequest,
  deleteRequest,
  getAllRequests,
  getRequestById,
  requestApproval,
  getDataValidationStats,
  getRequestsWithDateFilter
} from "../service/requestService";

// ✅ Create or Update Request
export const createOrUpdateRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body as {
      isCreate: boolean;
      payload: IRequest;
    };

    const result = await createOrUpdateRequest(payload, isCreate);

    return res.status(200).json(
      successResponse(
        isCreate
          ? "Request created successfully"
          : "Request updated successfully",
        result
      )
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get all Requests
export const getAllRequestsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllRequests();

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No Requests found", null));
    }

    return res
      .status(200)
      .json(successResponse("Requests fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Request by ID
export const getRequestByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await getRequestById(id);

    if (!result) {
      return res.status(404).json(notFoundResponse("Request not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Request fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete Request
export const deleteRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await deleteRequest(id);

    if (!result) {
      return res.status(404).json(notFoundResponse("Request not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Request deleted successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Request Approval
export const requestApprovalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { requestId, approvalStatus, approvedBy, comment } = req.body;

    // Validate required fields
    if (!requestId || !approvalStatus || !approvedBy) {
      return res
        .status(400)
        .json(errorResponse("requestId, approvalStatus and approvedBy are required"));
    }

    // Validate approvalStatus value
    if (approvalStatus !== 1 && approvalStatus !== 2) {
      return res
        .status(400)
        .json(errorResponse("approvalStatus must be 1 (Approved) or 2 (Rejected)"));
    }

    const result = await requestApproval(requestId, approvalStatus, approvedBy, comment);

    return res
      .status(200)
      .json(successResponse("Request approval processed successfully", result));
  } catch (error: any) {
    if (error.message === "Request not found") {
      return res.status(404).json(notFoundResponse(error.message, null));
    }
    return res.status(400).json(errorResponse(error.message));
  }
};

// ✅ Get Data Validation Statistics
export const getDataValidationStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate, projectId } = req.query;

    const result = await getDataValidationStats(
      startDate as string,
      endDate as string,
      projectId as string
    );

    return res
      .status(200)
      .json(successResponse("Statistics fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Requests with Date Filter
export const getRequestsWithDateFilterController = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.body;

    const result = await getRequestsWithDateFilter(startDate, endDate);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No requests found", null));
    }

    return res
      .status(200)
      .json(successResponse("Requests fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};


