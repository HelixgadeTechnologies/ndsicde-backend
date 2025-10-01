import { Request, Response } from "express";
import {
  deleteKpi,
  deleteStrategicObjective,
  getAllKpis,
  getAllStrategicObjectives,
  getKpiById,
  getKpiByStrategicObjectiveId,
  getStrategicObjectiveById,
  saveKpi,
  saveStrategicObjective,
} from "../service/strategicObjectiveAndKpiService";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandler";

export const createOrUpdateStrategicObjective = async (
  req: Request,
  res: Response
) => {
  const { isCreate, data } = req.body;
  const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
  try {
    const result = await saveStrategicObjective(data, isCreate);
    const message = isCreate
      ? "Strategic Objective created successfully"
      : "Strategic Objective updated successfully";
    res.status(isCreate ? 201 : 200).json(successResponse(message, result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const removeStrategicObjective = async (req: Request, res: Response) => {
  const { strategicObjectiveId } = req.body;

  try {
    const deleted = await deleteStrategicObjective(strategicObjectiveId);
    res
      .status(200)
      .json(
        successResponse("Strategic Objective deleted successfully", deleted)
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchAllStrategicObjectives = async (
  _req: Request,
  res: Response
) => {
  try {
    const data = await getAllStrategicObjectives();
    res.status(200).json(successResponse("List of Strategic Objectives", data));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchStrategicObjectiveById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const objective = await getStrategicObjectiveById(id);
    if (!objective) {
      return res
        .status(404)
        .json(notFoundResponse("Strategic Objective not found"));
    }
    res
      .status(200)
      .json(successResponse("Strategic Objective found", objective));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateKpi = async (req: Request, res: Response) => {
  const { isCreate, data } = req.body;
  const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
  try {
    const result = await saveKpi(data, isCreate);

    const message = isCreate
      ? "KPI created successfully"
      : "KPI updated successfully";
    res.status(isCreate ? 201 : 200).json(successResponse(message, result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const removeKpi = async (req: Request, res: Response) => {
  const { kpiId } = req.body;
  try {
    const result = await deleteKpi(kpiId);
    res.status(200).json(successResponse("KPI deleted successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchAllKpis = async (_req: Request, res: Response) => {
  try {
    const data = await getAllKpis();
    res.status(200).json(successResponse("List of KPIs", data));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchKpiById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await getKpiById(id);
    if (!result) {
      return res.status(404).json(notFoundResponse("KPI not found"));
    }
    res.status(200).json(successResponse("KPI found", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchKpiByStrategicObjectiveId = async (
  req: Request,
  res: Response
) => {
  const { strategicObjectiveId } = req.params;
  try {
    const result = await getKpiByStrategicObjectiveId(strategicObjectiveId);
    if (!result || result.length == 0) {
      return res.status(404).json(notFoundResponse("KPI not found"));
    }
    res.status(200).json(successResponse("KPI found", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};
