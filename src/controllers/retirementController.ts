import { Request, Response } from "express";
import { IRetirement } from "../interface/retirementInterface";
import { createOrUpdateRetirement, deleteRetirement, getAllRetirements, getRetirementById } from "../service/retirementService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";


// ✅ Create or Update Retirement
export const createOrUpdateRetirementController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body as {
      isCreate: boolean;
      payload: IRetirement;
    };

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
