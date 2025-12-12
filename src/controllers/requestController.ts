import { Request, Response } from "express";

import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../utils/responseHandler";
import { IRequest } from "../interface/requestInterface";
import { createOrUpdateRequest, deleteRequest, getAllRequests, getRequestById } from "../service/requestService";

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
