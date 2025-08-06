import { Request, Response } from "express";
import { deleteProject, getAllProjects, getProjectById, getProjectsStatus, saveProject } from "../service/projectManagementService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createOrUpdateProject = async (req: Request, res: Response) => {
  const { isCreate, data } = req.body;

  try {
    const project = await saveProject(data, isCreate);
    const message = isCreate ? "Project created successfully" : "Project updated successfully";
    res.status(isCreate ? 201 : 200).json(successResponse(message, project));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(successResponse("Projects retrieved", projects));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(successResponse("Project found", project));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const removeProject = async (req: Request, res: Response) => {
  const { projectId } = req.body;

  try {
    const deleted = await deleteProject(projectId);
    res.status(200).json(successResponse("Project deleted successfully", deleted));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const fetchProjectStatusStats = async (req: Request, res: Response) => {
  try {
    const stats = await getProjectsStatus();
    res.status(200).json(successResponse("Project status summary", stats));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

