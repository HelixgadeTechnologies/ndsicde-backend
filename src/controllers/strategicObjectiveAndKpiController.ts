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
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const createOrUpdateStrategicObjective = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await saveStrategicObjective(data, isCreate);
  const message = isCreate ? "Strategic Objective created successfully" : "Strategic Objective updated successfully";
  res.status(isCreate ? 201 : 200).json(successResponse(message, result));
});

export const removeStrategicObjective = asyncHandler(async (req, res) => {
  const { strategicObjectiveId } = req.body;
  const deleted = await deleteStrategicObjective(strategicObjectiveId);
  res.status(200).json(successResponse("Strategic Objective deleted successfully", deleted));
});

export const fetchAllStrategicObjectives = asyncHandler(async (_req, res) => {
  const data = await getAllStrategicObjectives();
  res.status(200).json(successResponse("List of Strategic Objectives", data));
});

export const fetchStrategicObjectiveById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const objective = await getStrategicObjectiveById(id);
  if (!objective) {
    return res.status(404).json(notFoundResponse("Strategic Objective not found"));
  }
  res.status(200).json(successResponse("Strategic Objective found", objective));
});

export const createOrUpdateKpi = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await saveKpi(data, isCreate);
  const message = isCreate ? "KPI created successfully" : "KPI updated successfully";
  res.status(isCreate ? 201 : 200).json(successResponse(message, result));
});

export const removeKpi = asyncHandler(async (req, res) => {
  const { kpiId } = req.body;
  const result = await deleteKpi(kpiId);
  res.status(200).json(successResponse("KPI deleted successfully", result));
});

export const fetchAllKpis = asyncHandler(async (_req, res) => {
  const data = await getAllKpis();
  res.status(200).json(successResponse("List of KPIs", data));
});

export const fetchKpiById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getKpiById(id);
  if (!result) {
    return res.status(404).json(notFoundResponse("KPI not found"));
  }
  res.status(200).json(successResponse("KPI found", result));
});

export const fetchKpiByStrategicObjectiveId = asyncHandler(async (req, res) => {
  const { strategicObjectiveId } = req.params;
  const result = await getKpiByStrategicObjectiveId(strategicObjectiveId);
  if (!result || result.length === 0) {
    return res.status(200).json(successResponse("KPI not found", []));
  }
  res.status(200).json(successResponse("KPI found", result));
});
