import { Request, Response } from "express";
import {
  createOrUpdateActivity,
  createOrUpdateActivityReport,
  createOrUpdateImpact,
  createOrUpdateImpactIndicator,
  createOrUpdateLogicalFramework,
  createOrUpdateOutput,
  createOrUpdateOutputIndicator,
  createOrUpdateOutputIndicatorReportFormat,
  createOrUpdatePartner,
  createOrUpdateTeamMember,
  deleteActivity,
  deleteActivityReport,
  deleteImpact,
  deleteImpactIndicatorReportFormat,
  deleteLogicalFramework,
  deleteOutcome,
  deleteOutcomeIndicator,
  deleteOutcomeIndicatorReportFormat,
  deleteOutput,
  deleteOutputIndicator,
  deleteOutputIndicatorReportFormat,
  deletePartner,
  deleteProject,
  deleteTeamMember,
  getActivityById,
  getActivityReportById,
  getAllActivities,
  getAllActivityReports,
  getAllImpact,
  getAllImpactIndicatorReportFormats,
  getAllImpactIndicatorsView,
  getAllLogicalFrameworks,
  getAllOutcomeIndicatorReportFormats,
  getAllOutcomeIndicatorsView,
  getAllOutcomesView,
  getAllOutputIndicatorReportFormats,
  getAllOutputIndicators,
  getAllOutputs,
  getAllPartners,
  getAllProjects,
  getAllTeamMember,
  getImpactIndicatorByIdView,
  getImpactIndicatorReportFormatById,
  getImpactIndicatorsByProjectIdView,
  getLogicalFrameworkById,
  getOutcomeIndicatorReportFormatById,
  getOutcomeIndicatorViewById,
  getOutcomeViewById,
  getOutputById,
  getOutputIndicatorById,
  getOutputIndicatorReportFormatById,
  getProjectById,
  getProjectsStatus,
  saveImpactIndicatorReportFormat,
  saveOutcome,
  saveOutcomeIndicator,
  saveOutcomeIndicatorReportFormat,
  saveProject,
} from "../service/projectManagementService";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandler";
import {
  IActivity,
  IActivityReport,
  IImpactIndicator,
  IImpactIndicatorReportFormat,
  ILogicalFramework,
  IOutcome,
  IOutcomeIndicator,
  IOutcomeIndicatorReportFormat,
  IOutput,
  IOutputIndicatorReportFormat,
  ITeamMember,
} from "../interface/projectManagementInterface";

export const createOrUpdateProject = async (req: Request, res: Response) => {
  const { isCreate, data } = req.body;
  //  const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
  try {
    const project = await saveProject(data, isCreate);
    const message = isCreate
      ? "Project created successfully"
      : "Project updated successfully";
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

    res
      .status(200)
      .json(successResponse("Project deleted successfully", deleted));
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

// Create or Update TeamMember
export const createOrUpdateTeamMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, data } = req.body;
    const result = await createOrUpdateTeamMember(data, isCreate);
    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Team member created successfully"
            : "Team member updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get all TeamMembers
export const getAllTeamMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllTeamMember();
    res.status(200).json(successResponse("Team Members", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete TeamMember
export const deleteTeamMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await deleteTeamMember(id);
    res
      .status(200)
      .json(successResponse("Team member deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update Partner
export const createOrUpdatePartnerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, data } = req.body;
    const result = await createOrUpdatePartner(data, isCreate);
    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Partner created successfully"
            : "Partner updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get all Partners
export const getAllPartnersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllPartners();
    res.status(200).json(successResponse("Partners", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete Partner
export const deletePartnerController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePartner(id);
    res.status(200).json(successResponse("Partner deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update Impact
export const createOrUpdateImpactController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, data } = req.body;
    const result = await createOrUpdateImpact(data, isCreate);
    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Impact created successfully"
            : "Impact updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get all Impacts
export const getAllImpactsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllImpact();
    res
      .status(200)
      .json(successResponse("Impacts retrieved successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete Impact
export const deleteImpactController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteImpact(id);
    res.status(200).json(successResponse("Impact deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Impact indicator controllers will go here (create/update, get all, delete)

// ✅ Create OR Update Impact Indicator
export const createOrUpdateImpactIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, data }: { isCreate: boolean; data: IImpactIndicator } =
      req.body;

    // If update, attach ID from params (optional: fallback from body)
    if (!isCreate && req.params.id) {
      data.impactIndicatorId = req.params.id;
    }

    const result = await createOrUpdateImpactIndicator(data, isCreate);

    return res
      .status(isCreate ? 201 : 200)
      .json(
        successResponse(
          isCreate
            ? "Impact Indicator created successfully"
            : "Impact Indicator updated successfully",
          result
        )
      );
  } catch (error: any) {
    return res
      .status(500)
      .json(
        errorResponse(error.message || "Error processing impact indicator")
      );
  }
};

// ✅ Get all Impact Indicators (View)
export const getAllImpactIndicators = async (_req: Request, res: Response) => {
  try {
    const indicators = await getAllImpactIndicatorsView();
    if (!indicators || indicators.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("Impact Indicators not found", null));
    }
    return res
      .status(200)
      .json(successResponse("Impact Indicators retrieved", indicators));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get single Impact Indicator by ID (View)
export const getImpactIndicatorById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const indicator = await getImpactIndicatorByIdView(id);

    if (!indicator) {
      return res
        .status(404)
        .json(notFoundResponse("Impact Indicator not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Impact Indicator retrieved", indicator));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Impact Indicators by Project ID (View)
export const getImpactIndicatorsByProjectId = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.projectId;
    const indicators = await getImpactIndicatorsByProjectIdView(projectId);

    if (!indicators || indicators.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("Impact Indicators not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Impact Indicators retrieved", indicators));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update
export const createOrUpdateImpactIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const payload: IImpactIndicatorReportFormat = req.body.payload;
    const isCreate: boolean = req.body.isCreate;

    const result = await saveImpactIndicatorReportFormat(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Impact created successfully"
            : "Impact updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get All
export const getImpactIndicatorReportFormats = async (
  req: Request,
  res: Response
) => {
  try {
    const results = await getAllImpactIndicatorReportFormats();

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json(
          notFoundResponse("Impacts indicator report formats not found", null)
        );
    }

    res
      .status(200)
      .json(
        successResponse(
          "Impacts indicator report formats fetched successfully",
          results
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get By ID
export const getImpactIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const result = await getImpactIndicatorReportFormatById(id);

    if (!result) {
      return res
        .status(404)
        .json(
          notFoundResponse("Impact indicator report formats not found", null)
        );
    }

    res
      .status(200)
      .json(
        successResponse(
          "Impact indicator report formats fetched successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete
export const removeImpactIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    await deleteImpactIndicatorReportFormat(id);

    res
      .status(200)
      .json(
        successResponse(
          "Impact indicator report formats deleted successfully",
          null
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update
export const saveOutcomeController = async (req: Request, res: Response) => {
  // const { isCreate } = req.body; // expects ?isCreate=true/false
  // const payload: IOutcome = req.body;
  const { isCreate, payload }: { isCreate: boolean; payload: IOutcome } =
    req.body;

  try {
    const result = await saveOutcome(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate === true
            ? "Outcome created successfully"
            : "Outcome updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get All
export const getAllOutcomesController = async (req: Request, res: Response) => {
  try {
    const results = await getAllOutcomesView();

    if (!results || results.length === 0) {
      return res.status(404).json(notFoundResponse("Outcomes not found", null));
    }

    res
      .status(200)
      .json(successResponse("Outcomes fetched successfully", results));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get By ID
export const getOutcomeByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getOutcomeViewById(id);

    if (!result) {
      return res.status(404).json(notFoundResponse("Outcome not found", null));
    }

    res
      .status(200)
      .json(successResponse("Outcome fetched successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete
export const deleteOutcomeController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteOutcome(id);

    res.status(200).json(successResponse("Outcome deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update OutcomeIndicator
export const createOrUpdateOutcomeIndicator = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      isCreate,
      payload,
    }: { isCreate: boolean; payload: IOutcomeIndicator } = req.body;

    const result = await saveOutcomeIndicator(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate === true
            ? "OutcomeIndicator created successfully"
            : "OutcomeIndicator updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get All OutcomeIndicators (View)
export const getOutcomeIndicators = async (req: Request, res: Response) => {
  try {
    const results = await getAllOutcomeIndicatorsView();

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("OutcomeIndicators not found", null));
    }

    res
      .status(200)
      .json(successResponse("OutcomeIndicators fetched successfully", results));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get OutcomeIndicator By ID (View)
export const getOutcomeIndicatorById = async (req: Request, res: Response) => {
  try {
    const { outcomeIndicatorId } = req.params;
    const result = await getOutcomeIndicatorViewById(outcomeIndicatorId);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("OutcomeIndicator not found", null));
    }

    res
      .status(200)
      .json(successResponse("OutcomeIndicator fetched successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete OutcomeIndicator
export const removeOutcomeIndicator = async (req: Request, res: Response) => {
  try {
    const { outcomeIndicatorId } = req.params;

    await deleteOutcomeIndicator(outcomeIndicatorId);

    res
      .status(200)
      .json(successResponse("OutcomeIndicator deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update OutcomeIndicatorReportFormat
export const createOrUpdateOutcomeIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      isCreate,
      payload,
    }: { isCreate: boolean; payload: IOutcomeIndicatorReportFormat } = req.body;

    const result = await saveOutcomeIndicatorReportFormat(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "OutcomeIndicatorReportFormat created successfully"
            : "OutcomeIndicatorReportFormat updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get All OutcomeIndicatorReportFormats (View)
export const getOutcomeIndicatorReportFormats = async (
  req: Request,
  res: Response
) => {
  try {
    const results = await getAllOutcomeIndicatorReportFormats();

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json(
          notFoundResponse("OutcomeIndicatorReportFormats not found", null)
        );
    }

    res
      .status(200)
      .json(
        successResponse(
          "OutcomeIndicatorReportFormats fetched successfully",
          results
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get OutcomeIndicatorReportFormat By ID (View)
export const getOutcomeIndicatorReportFormatByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { outcomeIndicatorReportFormatId } = req.params;
    const result = await getOutcomeIndicatorReportFormatById(
      outcomeIndicatorReportFormatId
    );

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("OutcomeIndicatorReportFormat not found", null));
    }

    res
      .status(200)
      .json(
        successResponse(
          "OutcomeIndicatorReportFormat fetched successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete OutcomeIndicatorReportFormat
export const removeOutcomeIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const { outcomeIndicatorReportFormatId } = req.params;

    await deleteOutcomeIndicatorReportFormat(outcomeIndicatorReportFormatId);

    res
      .status(200)
      .json(
        successResponse(
          "OutcomeIndicatorReportFormat deleted successfully",
          null
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Create or Update Output
export const createOrUpdateOutputController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload }: { isCreate: boolean; payload: IOutput } =
      req.body;

    const result = await createOrUpdateOutput(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Output created successfully"
            : "Output updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get all Outputs (from view)
export const getAllOutputsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllOutputs();

    if (!result || result.length === 0) {
      return res.status(404).json(notFoundResponse("Outputs not found", null));
    }

    res
      .status(200)
      .json(successResponse("Outputs retrieved successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Output by Id (from view)
export const getOutputByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getOutputById(id);

    if (!result) {
      return res.status(404).json(notFoundResponse("Output not found", null));
    }

    res
      .status(200)
      .json(successResponse("Output retrieved successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete Output
export const deleteOutputController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteOutput(id);

    res.status(200).json(successResponse("Output deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Create or Update OutputIndicator
export const createOrUpdateOutputIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body;

    const result = await createOrUpdateOutputIndicator(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "OutputIndicator created successfully"
            : "OutputIndicator updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get all OutputIndicators
export const getAllOutputIndicatorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllOutputIndicators();

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("OutputIndicators not found", null));
    }

    res
      .status(200)
      .json(successResponse("OutputIndicators fetched successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get OutputIndicator by Id
export const getOutputIndicatorByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await getOutputIndicatorById(id);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("OutputIndicator not found", null));
    }

    res
      .status(200)
      .json(successResponse("OutputIndicator fetched successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete OutputIndicator
export const deleteOutputIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await deleteOutputIndicator(id);

    res
      .status(200)
      .json(successResponse("OutputIndicator deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Create OutputIndicatorReportFormat
export const createOutputIndicatorReportFormat = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body;
    const result = await createOrUpdateOutputIndicatorReportFormat(
      payload,
      isCreate
    );
    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Output Indicator Report Format created successfully"
            : "Output Indicator Report Format updated successfully",
          result
        )
      );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};


// ✅ Get All OutputIndicatorReportFormats
export const getAllOutputIndicatorReportFormatController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllOutputIndicatorReportFormats();

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json(
          notFoundResponse("No Output Indicator Report Formats found", null)
        );
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Output Indicator Report Formats fetched successfully",
          result
        )
      );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get OutputIndicatorReportFormat by Id
export const getOutputIndicatorReportFormatByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const result = await getOutputIndicatorReportFormatById(id);

    if (!result) {
      return res
        .status(404)
        .json(
          notFoundResponse("Output Indicator Report Format not found", null)
        );
    }

    return res
      .status(200)
      .json(
        successResponse(
          "Output Indicator Report Format fetched successfully",
          result
        )
      );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete OutputIndicatorReportFormat
export const deleteOutputIndicatorReportFormatController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    await deleteOutputIndicatorReportFormat(id);

    return res
      .status(200)
      .json(
        successResponse(
          "Output Indicator Report Format deleted successfully",
          null
        )
      );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};


// ✅ Create or Update Activity
export const createOrUpdateActivityController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body as { isCreate: boolean; payload: IActivity };
    const result = await createOrUpdateActivity(payload, isCreate);

    return res.status(200).json(
      successResponse(
        isCreate
          ? "Activity created successfully"
          : "Activity updated successfully",
        result
      )
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get All Activities
export const getAllActivitiesController = async (req: Request, res: Response) => {
  try {
    const result = await getAllActivities();
    if (!result || result.length === 0) {
      return res.status(404).json(notFoundResponse("No activities found", null));
    }
    return res.status(200).json(
      successResponse("Activities fetched successfully", result)
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get Activity by Id
export const getActivityByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await getActivityById(id);
    if (!result) {
      return res.status(404).json(notFoundResponse("Activity not found", null));
    }
    return res.status(200).json(
      successResponse("Activity fetched successfully", result)
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete Activity
export const deleteActivityController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await deleteActivity(id);
    return res.status(200).json(
      successResponse("Activity deleted successfully", null)
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Create or Update ActivityReport
export const createOrUpdateActivityReportController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body as { isCreate: boolean; payload: IActivityReport };
    const result = await createOrUpdateActivityReport(payload, isCreate);

    return res.status(200).json(
      successResponse(
        isCreate
          ? "ActivityReport created successfully"
          : "ActivityReport updated successfully",
        result
      )
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get All ActivityReports (from view)
export const getAllActivityReportsController = async (_req: Request, res: Response) => {
  try {
    const result = await getAllActivityReports();
    return res.status(200).json(successResponse("ActivityReports fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get ActivityReport by Id (from view)
export const getActivityReportByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getActivityReportById(id);

    if (!result) {
      return res.status(404).json(notFoundResponse("ActivityReport not found", null));
    }

    return res.status(200).json(successResponse("ActivityReport fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete ActivityReport
export const deleteActivityReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteActivityReport(id);
    return res.status(200).json(successResponse("ActivityReport deleted successfully", null));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};


// ✅ Create or Update LogicalFramework
export const createOrUpdateLogicalFrameworkController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, payload } = req.body as {
      isCreate: boolean;
      payload: ILogicalFramework;
    };

    const result = await createOrUpdateLogicalFramework(payload, isCreate);

    return res.status(200).json(
      successResponse(
        isCreate
          ? "LogicalFramework created successfully"
          : "LogicalFramework updated successfully",
        result
      )
    );
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get all LogicalFrameworks
export const getAllLogicalFrameworksController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllLogicalFrameworks();
    return res
      .status(200)
      .json(successResponse("LogicalFrameworks fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get LogicalFramework by ID
export const getLogicalFrameworkByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await getLogicalFrameworkById(id);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("LogicalFramework not found", null));
    }

    return res
      .status(200)
      .json(successResponse("LogicalFramework fetched successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Delete LogicalFramework
export const deleteLogicalFrameworkController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await deleteLogicalFramework(id);

    if (!result) {
      return res
        .status(404)
        .json(notFoundResponse("LogicalFramework not found", null));
    }

    return res
      .status(200)
      .json(successResponse("LogicalFramework deleted successfully", result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};
