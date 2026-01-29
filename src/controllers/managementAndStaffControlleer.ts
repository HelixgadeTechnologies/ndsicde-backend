import { Request, Response } from "express";
import { createIndicatorReportCommentService, getAllIndicatorReportCommentsService, getAllIndicatorReportsService, getBudgetUtilizationService, getCommentsByIndicatorReportIdService, getDashboardSummaryService, getKpiPerformanceService, getProjectsService, getProjectStatusDistributionService } from "../service/managementAndStaffService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { changePassword } from "../service/authService";


export const getDashboardSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getDashboardSummaryService();

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("Dashboard summary not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Dashboard summary fetched successfully", result));

  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};

export const getKpiPerformance = async (
  req: Request,
  res: Response
) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const result = await getKpiPerformanceService(year);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("KPI performance data not found", null));
    }

    return res
      .status(200)
      .json(successResponse("KPI performance fetched successfully", result));

  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};

export const getProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getProjectsService({
      search: req.query.search as string,
      status: req.query.status as string,
      category: req.query.category as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    });

    if (!result.data.length) {
      return res
        .status(404)
        .json(notFoundResponse("Projects not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Projects fetched successfully", result));

  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};


export const getProjectStatusDistribution = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getProjectStatusDistributionService();

    if (!result.length) {
      return res
        .status(404)
        .json(notFoundResponse("Project status data not found", null));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Project status distribution fetched successfully",
          result
        )
      );

  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};

export const getBudgetUtilization = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getBudgetUtilizationService();

    if (!result.length) {
      return res
        .status(404)
        .json(notFoundResponse("Budget utilization data not found", null));
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Budget utilization fetched successfully",
          result
        )
      );

  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};

export const getAllIndicatorReports = async (req: Request, res: Response) => {
  try {
    const reports = await getAllIndicatorReportsService();
    
    // Check if no reports found
    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No indicator reports found", []));
    }
    
    return res
      .status(200)
      .json(successResponse("Indicator reports fetched successfully", reports));
  } catch (error: any) {
    console.error('Controller error:', error);
    return res
      .status(500)
      .json(errorResponse(error.message || "Failed to fetch indicator reports"));
  }
};

export const createIndicatorReportCommentController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createIndicatorReportCommentService(req.body);
    return res
      .status(201)
      .json(successResponse("Comment created successfully", result));
    } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
}
};


export const getCommentsByIndicatorReportIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { indicatorReportId } = req.params;
    const comments = await getCommentsByIndicatorReportIdService(indicatorReportId);

    if (!comments.length) {
      return res
        .status(404)
        .json(notFoundResponse("No comments found", null));
    }

    return res
      .status(200)
      .json(successResponse("Comments fetched successfully", comments));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getAllIndicatorReportCommentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const comments = await getAllIndicatorReportCommentsService();

    if (!comments.length) {
      return res
        .status(404)
        .json(notFoundResponse("No comments found", null));
    }

    return res
      .status(200)
      .json(successResponse("Comments fetched successfully", comments));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};


export const changePasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res
        .status(404)
        .json(notFoundResponse("User not found", null));
    }

    const result = await changePassword(
      userId,
      oldPassword,
      newPassword,
      confirmPassword
    );

    return res
      .status(200)
      .json(successResponse(result.message, null));
  } catch (error: any) {
    return res
      .status(500)
      .json(errorResponse(error.message));
  }
};
