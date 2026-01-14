import { Request, Response } from "express";
import {
  createOrUpdateActivity,
  createOrUpdateActivityReport,
  createOrUpdateAgeDisaggregation,
  createOrUpdateDepartmentDisaggregation,
  createOrUpdateGenderAggregation,
  createOrUpdateImpact,
  createOrUpdateIndicator,
  createOrUpdateLGADisaggregation,
  createOrUpdateLogicalFramework,
  createOrUpdateOutput,
  createOrUpdatePartner,
  createOrUpdateProductDisaggregation,
  createOrUpdateStateDisaggregation,
  createOrUpdateTeamMember,
  createOrUpdateTenureDisaggregation,
  deleteActivity,
  deleteActivityReport,
  deleteImpact,
  deleteIndicatorReport,
  deleteLogicalFramework,
  deleteOutcome,
  deleteOutput,
  deletePartner,
  deleteProject,
  deleteTeamMember,
  getActivityById,
  getActivityReportById,
  getAgeDisaggregationByIndicatorId,
  getAllActivities,
  getAllActivityReports,
  getAllDisaggregation,
  getAllImpact,
  getAllImpactIndicatorsByResultIdView,
  getAllIndicatorReportByResultId,
  getAllLogicalFrameworks,
  getAllOutcomesView,
  getAllOutputs,
  getAllPartners,
  getAllProjects,
  getAllTeamMember,
  getDepartmentDisaggregationByIndicatorId,
  getGenderDisaggregationByIndicatorId,
  getIndicatorByIdView,
  getIndicatorReportById,
  getLGADisaggregationByIndicatorId,
  getLogicalFrameworkById,
  getOutcomeViewById,
  getOutputById,
  getProductDisaggregationByIndicatorId,
  getProjectById,
  getProjectsStatus,
  getResultType,
  getStateDisaggregationByIndicatorId,
  getTenureDisaggregationByIndicatorId,
  saveIndicatorReport,
  saveOutcome,
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
  IAgeDisaggregation,
  IDepartmentDisaggregation,
  IIndicator,
  IIndicatorReport,
  ILgaDisaggregation,
  ILogicalFramework,
  IOutcome,
  IOutput,
  IProductDisaggregation,
  IStateDisaggregation,
  ITeamMember,
  ITenureDisaggregation,
} from "../interface/projectManagementInterface";
import { getOrgKpiDashboardData, getProjectActivityDashboardData, getResultDashboardData } from "../service/kpiDashboardService";

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

// ✅ Create OR Update Indicator
export const createOrUpdateIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const { isCreate, data }: { isCreate: boolean; data: IIndicator } =
      req.body;

    const result = await createOrUpdateIndicator(data, isCreate);

    return res
      .status(isCreate ? 201 : 200)
      .json(
        successResponse(
          isCreate
            ? "Indicator created successfully"
            : "Indicator updated successfully",
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
export const getAllIndicatorsByResult = async (req: Request, res: Response) => {
  try {
    const { resultId } = req.params;
    const indicators = await getAllImpactIndicatorsByResultIdView(resultId);
    if (!indicators || indicators.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("Indicators not found", null));
    }
    return res
      .status(200)
      .json(successResponse("Indicators retrieved", indicators));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// ✅ Get single Impact Indicator by ID (View)
export const getIndicatorById = async (req: Request, res: Response) => {
  try {
    const indicatorId = req.params.indicatorId;
    const indicator = await getIndicatorByIdView(indicatorId);

    if (!indicator) {
      return res
        .status(404)
        .json(notFoundResponse("Indicator not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Indicator retrieved", indicator));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};
// ✅ Get single Impact Indicator by ID (View)
export const getAllResultType = async (req: Request, res: Response) => {
  try {
    const results = await getResultType();

    if (results.length < 1) {
      return res
        .status(404)
        .json(notFoundResponse("Result type not found", null));
    }

    return res
      .status(200)
      .json(successResponse("Result type retrieved", results));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
};

// Delete Impact
export const deleteIndicatorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteImpact(id);
    res.status(200).json(successResponse("Indicator deleted successfully", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update
export const createOrUpdateIndicatorReport = async (
  req: Request,
  res: Response
) => {
  try {
    const payload: IIndicatorReport = req.body.payload;
    const isCreate: boolean = req.body.isCreate;

    const result = await saveIndicatorReport(payload, isCreate);

    res
      .status(200)
      .json(
        successResponse(
          isCreate
            ? "Indicator created successfully"
            : "Indicator updated successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get All
export const getIndicatorReportsByResult = async (
  req: Request,
  res: Response
) => {
  try {
    const resultId = req.params.resultId;
    const results = await getAllIndicatorReportByResultId(resultId);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json(
          notFoundResponse("indicator report not found", null)
        );
    }

    res
      .status(200)
      .json(
        successResponse(
          "indicator report fetched successfully",
          results
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Get By ID
export const getImpactIndicatorReportById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.indicatorId;
    const result = await getIndicatorReportById(id);

    if (!result) {
      return res
        .status(404)
        .json(
          notFoundResponse("indicator report not found", null)
        );
    }

    res
      .status(200)
      .json(
        successResponse(
          "indicator report fetched successfully",
          result
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Delete
export const removeIndicatorReport = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    await deleteIndicatorReport(id);

    res
      .status(200)
      .json(
        successResponse(
          "indicator report deleted successfully",
          null
        )
      );
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Create or Update
export const saveOutcomeController = async (req: Request, res: Response) => {
  const { isCreate, data }: { isCreate: boolean; data: IOutcome } = req.body;
  try {
    const result = await saveOutcome(data, isCreate);

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

export const getDisaggregation = async (req: Request, res: Response) => {
  try {

    const disaggregation = await getAllDisaggregation();

    if (!disaggregation || disaggregation.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No disaggregation found", null));
    }

    return res
      .status(200)
      .json(successResponse("Disaggregation retrieved", disaggregation));
  } catch (error: any) {
    // console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateGenderDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body

    const result = await createOrUpdateGenderAggregation(
      payload,
      isCreate === "true"
    );

    return res
      .status(200)
      .json(successResponse("Gender disaggregation saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getGenderDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregation = await getGenderDisaggregationByIndicatorId(indicatorId);

    if (!disaggregation || disaggregation.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No gender disaggregation found", null));
    }

    return res
      .status(200)
      .json(successResponse("Gender disaggregation retrieved", disaggregation));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateProductDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate that each item has an ID for update
      const missingId = payload.some((item: IProductDisaggregation) => !item.productDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include productDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateProductDisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("Product disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getProductDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getProductDisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No product disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("Product disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateDepartmentDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate that each item has an ID for update
      const missingId = payload.some((item: IDepartmentDisaggregation) => !item.departmentDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include departmentDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateDepartmentDisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("Department disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getDepartmentDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getDepartmentDisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No department disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("Department disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateStateDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate that each item has an ID for update
      const missingId = payload.some((item: IStateDisaggregation) => !item.stateDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include stateDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateStateDisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("State disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getStateDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getStateDisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No state disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("State disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateLGADisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate that each item has an ID for update
      const missingId = payload.some((item: ILgaDisaggregation) => !item.lgaDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include lgaDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateLGADisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("LGA disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getLGADisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getLGADisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No LGA disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("LGA disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateTenureDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate IDs for update
      const missingId = payload.some((item: ITenureDisaggregation) => !item.tenureDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include tenureDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateTenureDisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("Tenure disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getTenureDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getTenureDisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No tenure disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("Tenure disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createOrUpdateAgeDisaggregationController = async (req: Request, res: Response) => {
  try {
    const { isCreate, payload } = req.body;

    if (!isCreate) {
      // Validate IDs for update
      const missingId = payload.some((item: IAgeDisaggregation) => !item.ageDisaggregationId);
      if (missingId) {
        return res
          .status(400)
          .json(errorResponse("Each item must include ageDisaggregationId for update"));
      }
    }

    const result = await createOrUpdateAgeDisaggregation(payload, isCreate);

    return res
      .status(200)
      .json(successResponse("Age disaggregations saved", result));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getAgeDisaggregationByIndicatorController = async (req: Request, res: Response) => {
  try {
    const { indicatorId } = req.params;
    const disaggregations = await getAgeDisaggregationByIndicatorId(indicatorId);

    if (!disaggregations || disaggregations.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("No age disaggregations found", null));
    }

    return res
      .status(200)
      .json(successResponse("Age disaggregations retrieved", disaggregations));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};
export const getResultDashboardDataController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const dashboardData = await getResultDashboardData(projectId);

    return res
      .status(200)
      .json(successResponse("Data", dashboardData));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};
export const getOrgKpiDashboardDataController = async (req: Request, res: Response) => {
  try {
    
    const dashboardData = await getOrgKpiDashboardData();

    return res
      .status(200)
      .json(successResponse("Data", dashboardData));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};
export const getProjectActivityDashboardDataController = async (req: Request, res: Response) => {
  try {

     const { projectId } = req.params;
    const dashboardData = await getProjectActivityDashboardData(projectId);


    return res
      .status(200)
      .json(successResponse("Data", dashboardData));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(errorResponse(error.message));
  }
};