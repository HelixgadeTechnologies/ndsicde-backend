// controllers/projectValidation.controller.ts
import { Request, Response } from "express";
import { ProjectValidationService } from "../service/dataValidationService";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandler";
import { AuditLogService } from "../service/auditlogService";

export class ProjectValidationController {
  // Assuming you have a service to handle project validation logic
  private projectValidationService: ProjectValidationService; // Replace with actual service type
  private auditLogService: AuditLogService;
  constructor() {
    this.projectValidationService = new ProjectValidationService();
    this.auditLogService = new AuditLogService();
  }

  async getAll(req: Request, res: Response) {
    try {
      const data = await this.projectValidationService.getAllValidations();
      res.status(200).json(successResponse("data validation", data));
    } catch (error: any) {
      res.status(500).json(errorResponse("Internal server error", error));
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.projectValidationService.getSummary();
      res
        .status(200)
        .json(successResponse("Validation summary retrieved", summary));
    } catch (error: any) {
      res.status(500).json(errorResponse("Internal server error", error));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await this.projectValidationService.getValidationById(id);
      if (!data) {
        return res
          .status(404)
          .json(notFoundResponse("Project Validation not found", null));
      }
      res.status(200).json(successResponse("data", data));
    } catch (error: any) {
      res.status(500).json(errorResponse("Internal server error", error));
    }
  }

  async createOrUpdate(req: Request, res: Response) {
    try {
      const { isCreate, ...payload } = req.body;
      const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
      const result =
        await this.projectValidationService.createOrUpdateValidation(
          payload,
          isCreate
        );
      await this.auditLogService.createAuditLog(
        isCreate ? "Project Validation Created" : "Project Validation Updated",
        userId,
        `Project Validation ${isCreate ? "created" : "updated"} with Name: ${
          result?.submissionName
        }`
      );
      const message = isCreate
        ? "Project Validation created successfully"
        : "Project Validation updated successfully";
      res.status(isCreate ? 201 : 200).json(successResponse(message, result));
    } catch (error: any) {
      res.status(500).json(errorResponse("Internal server error", error));
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { projectValidationId } = req.body;
      if (!projectValidationId) {
        return res
          .status(400)
          .json(notFoundResponse("Project Validation ID is required", null));
      }
      const deleted = await this.projectValidationService.deleteValidation(
        projectValidationId
      );
      res
        .status(200)
        .json(
          successResponse("Project Validation deleted successfully", deleted)
        );
    } catch (error: any) {
      res.status(500).json(errorResponse("Internal server error", error));
    }
  }
}
