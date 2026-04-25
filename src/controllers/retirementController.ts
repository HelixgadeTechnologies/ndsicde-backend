import { Request, Response } from "express";
import { IRetirement } from "../interface/retirementInterface";
import { createOrUpdateRetirement, deleteRetirement, getAllRetirements, getRetirementById, approveRetirement, getRetirementByProjectId } from "../service/retirementService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";


// ✅ Create or Update Retirement (with LineItems)
export const createOrUpdateRetirementController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body as {
      isCreate: boolean;
      payload: IRetirement;
    };

    // Validate retirementId is present when updating
    if (!isCreate && !payload.retirementId) {
      return res
        .status(400)
        .json(errorResponse("retirementId is required in payload when isCreate is false"));
    }

    // Validate requestId is present when lineItems are provided
    if (payload.lineItems && payload.lineItems.length > 0 && !payload.requestId) {
      return res
        .status(400)
        .json(errorResponse("requestId is required in payload when lineItems are provided"));
    }

    const result = await createOrUpdateRetirement(payload, isCreate);

    return res.status(200).json(
      successResponse(
        isCreate
          ? "Retirement created successfully"
          : "Retirement updated successfully",
        result
      )
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get All Retirements
export const getRetirements = async (req: Request, res: Response) => {
  try {
    const results = await getAllRetirements();
    return res
      .status(200)
      .json(successResponse("Retirements fetched successfully", results));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Retirement by ID
export const getRetirement = async (req: Request, res: Response) => {
  try {
    const { retirementId } = req.params;
    const result = await getRetirementById(retirementId);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("Retirement not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Retirement fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete Retirement
export const removeRetirement = async (req: Request, res: Response) => {
  try {
    const { retirementId } = req.params;
    const result = await deleteRetirement(retirementId);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("Retirement not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Retirement deleted successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Approve / Reject / Review Retirement
export const approveRetirementController = async (
  req: Request,
  res: Response
) => {
  try {
    const { retirementId, approvalStatus, approvedBy, comment } = req.body;

    if (!retirementId || approvalStatus === undefined || !approvedBy) {
      return res
        .status(400)
        .json(errorResponse("retirementId, approvalStatus and approvedBy are required"));
    }

    if (![1, 2, 3].includes(Number(approvalStatus))) {
      return res
        .status(400)
        .json(errorResponse("approvalStatus must be 1 (Approved), 2 (Rejected) or 3 (Review)"));
    }

    const result = await approveRetirement(
      retirementId,
      Number(approvalStatus),
      approvedBy,
      comment
    );

    return res
      .status(200)
      .json(successResponse("Retirement approval processed successfully", result));
  } catch (error: any) {
    if (error.message === "Retirement not found") {
      return res.status(404).json(notFoundResponse(error.message, null));
    }
    return res.status(400).json(errorResponse(error.message));
  }
};

// ✅ Get Retirement by Project ID
export const getRetirementByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const results = await getRetirementByProjectId(projectId);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No retirements found for this project", null));
    }

    return res
      .status(200)
      .json(successResponse("Retirements fetched successfully", results));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

