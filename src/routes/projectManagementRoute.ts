import { Router } from "express";
import {
  createOrUpdateActivityController,
  createOrUpdateActivityReportController,
  createOrUpdateImpactController,
  createOrUpdateIndicatorController,
  createOrUpdateIndicatorReport,
  createOrUpdateLogicalFrameworkController,
  createOrUpdateOutputController,
  createOrUpdatePartnerController,
  createOrUpdateProject,
  createOrUpdateTeamMemberController,
  deleteActivityController,
  deleteActivityReportController,
  deleteImpactController,
  deleteLogicalFrameworkController,
  deleteOutcomeController,
  deleteOutputController,
  deletePartnerController,
  deleteTeamMemberController,
  fetchAllProjects,
  fetchProjectById,
  fetchProjectStatusStats,
  getActivityByIdController,
  getActivityReportByIdController,
  getAllActivitiesController,
  getAllActivityReportsController,
  getAllImpactsController,
  getAllIndicatorsByResult,
  getAllLogicalFrameworksController,
  getAllOutcomesController,
  getAllOutputsController,
  getAllPartnersController,
  getAllResultType,
  getAllTeamMemberController,
  getImpactIndicatorReportById,
  getIndicatorById,
  getIndicatorReportsByResult,
  getLogicalFrameworkByIdController,
  getOrgKpiDashboardDataController,
  getOutcomeByIdController,
  getOutputByIdController,
  getPartnerByEmailController,
  getProjectActivityDashboardDataController,
  getResultDashboardDataController,
  removeIndicatorReport,
  removeProject,
  saveOutcomeController,
} from "../controllers/projectManagementController";

const projectManagementRouter: Router = Router();

/**
 * @swagger
 * /api/projectManagement/project:
 *   post:
 *     summary: Create or update a project
 *     tags: [Project Management]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new ProjectManagement entry is created.
 *       - If `isCreate` is false, existing ProjectManagement (by `projectId`) are updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: Set to true to create a new project, false to update
 *               data:
 *                 type: object
 *                 properties:
 *                   projectId:
 *                     type: string
 *                   projectName:
 *                     type: string
 *                   budgetCurrency:
 *                     type: string
 *                   totalBudgetAmount:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   localGovernment:
 *                     type: string
 *                   community:
 *                     type: string
 *                   thematicAreasOrPillar:
 *                     type: string
 *                   status:
 *                     type: string
 *                   strategicObjectiveId:
 *                     type: string
 *     responses:
 *       201:
 *         description: Project created
 *       200:
 *         description: Project updated
 *       400:
 *         description: Validation error
 */
projectManagementRouter.post("/project", createOrUpdateProject);

/**
 * @swagger
 * /api/projectManagement/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Project Management]
 *     responses:
 *       200:
 *         description: A list of projects
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/projects", fetchAllProjects);

/**
 * @swagger
 * /api/projectManagement/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Project Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/projects/:id", fetchProjectById);

/**
 * @swagger
 * /api/projectManagement/delete:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete a project by ID
 *     tags: [Project Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *             properties:
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       400:
 *         description: Invalid ID or error
 */
projectManagementRouter.delete("/delete", removeProject);

/**
 * @swagger
 * /api/projectManagement/project-stats:
 *   get:
 *     summary: Get project summary by status
 *     tags: [Project Management]
 *     description: Returns total number of projects and count of projects by status (Active, Completed, On Hold)
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects:
 *                   type: integer
 *                 activeProjects:
 *                   type: integer
 *                 completedProjects:
 *                   type: integer
 *                 onHoldProjects:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/project-stats", fetchProjectStatusStats);

/**
 * @swagger
 * /api/projectManagement/team-member:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or update a Team Member
 *     description: Create a new team member if `isCreate` is true, otherwise update an existing one.
 *     tags: [TEAM MEMBER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   teamMemberId:
 *                     type: string
 *                     example: "uuid-1234"   # required if isCreate=false
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   roleId:
 *                     type: string
 *                     example: "role-uuid"
 *                   projectId:
 *                     type: string
 *                     example: "project-uuid"
 *     responses:
 *       200:
 *         description: Team member created or updated successfully
 *       500:
 *         description: Server error
 */
projectManagementRouter.post(
  "/team-member",
  createOrUpdateTeamMemberController
);

/**
 * @swagger
 * /api/projectManagement/team-members:
 *   get:
 *     summary: Get all Team Members
 *     description: Fetches all team members with their role and project info.
 *     tags: [TEAM MEMBER]
 *     responses:
 *       200:
 *         description: List of team members
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/team-members", getAllTeamMemberController);

/**
 * @swagger
 * /api/projectManagement/team-member/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete a Team Member
 *     description: Delete a team member by their ID.
 *     tags: [TEAM MEMBER]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team member
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete("/team-member/:id", deleteTeamMemberController);

/**
 * @swagger
 * /api/projectManagement/partner:
 *   post:
 *     summary: Create or Update a Partner
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: |
 *       Creates a new partner when `isCreate` is **true**.
 *       Updates an existing partner when `isCreate` is **false** (requires `data.partnerId`).
 *       Returns the created/updated partner record.
 *     tags: [PARTNERS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 required: [organizationName, email, roleId]
 *                 properties:
 *                   partnerId:
 *                     type: string
 *                     description: Required only when updating (`isCreate=false`)
 *                     example: "2b4b1e3a-1b2c-4b5d-8a9f-0c1d2e3f4a5b"
 *                   organizationName:
 *                     type: string
 *                     example: "GreenTech Ltd"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "info@greentech.com"
 *                   roleId:
 *                     type: string
 *                     example: "8d1f6c1e-3b2a-4e5d-9c8b-7a6f5e4d3c2b"
 *                   projectId:
 *                     type: string
 *                     nullable: true
 *                     example: "3f2e1d0c-9b8a-7d6c-5e4f-3a2b1c0d9e8f"
 *     responses:
 *       200:
 *         description: Partner created or updated successfully
 *       400:
 *         description: Bad request (e.g., missing partnerId on update)
 *       500:
 *         description: Server error
 */
projectManagementRouter.post("/partner", createOrUpdatePartnerController);

/**
 * @swagger
 * /api/projectManagement/partners:
 *   get:
 *     summary: Get all partners
 *     description: Fetch all partners (from partner_view) including role and project names.
 *     tags: [PARTNERS]
 *     responses:
 *       200:
 *         description: List of partners
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/partners", getAllPartnersController);

/**
 * @swagger
 * /api/projectManagement/partners/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete a partner
 *     description: Delete a partner by ID.
 *     tags: [PARTNERS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner ID
 *     responses:
 *       200:
 *         description: Partner deleted successfully
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete("/partners/:id", deletePartnerController);

/**
 * @swagger
 * /api/projectManagement/partners/email/{email}:
 *   get:
 *     summary: Get a partner by email
 *     description: Retrieve a single partner record by their email address.
 *     tags: [PARTNERS]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The email address of the partner
 *         example: "info@greentech.com"
 *     responses:
 *       200:
 *         description: Partner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Partner retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     partnerId:
 *                       type: string
 *                       example: "2b4b1e3a-1b2c-4b5d-8a9f-0c1d2e3f4a5b"
 *                     organizationName:
 *                       type: string
 *                       example: "GreenTech Ltd"
 *                     email:
 *                       type: string
 *                       example: "info@greentech.com"
 *                     roleId:
 *                       type: string
 *                       example: "8d1f6c1e-3b2a-4e5d-9c8b-7a6f5e4d3c2b"
 *                     projectId:
 *                       type: string
 *                       nullable: true
 *                       example: "3f2e1d0c-9b8a-7d6c-5e4f-3a2b1c0d9e8f"
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/partners/email/:email", getPartnerByEmailController);


/**
 * @swagger
 * /api/projectManagement/result_types:
 *   get:
 *     summary: Get all result type
 *     description: Fetch all result type.
 *     tags: [RESULT]
 *     responses:
 *       200:
 *         description: List of result type
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/result_types", getAllResultType);


/**
 * @swagger
 * /api/projectManagement/impact:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or update an Impact
 *     description: Use this endpoint to either create a new impact (when `isCreate` is true) or update an existing impact (when `isCreate` is false and `impactId` is provided).
 *     tags: [IMPACT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   impactId:
 *                     type: string
 *                     example: "b12345c6-d78f-90ab-cdef-1234567890ab"
 *                   statement:
 *                     type: string
 *                     example: "Improve access to clean water"
 *                   thematicArea:
 *                     type: string
 *                     example: "Health & Sanitation"
 *                   responsiblePerson:
 *                     type: string
 *                     example: "John Doe"
 *                   projectId:
 *                     type: string
 *                     example: "p09876d5-c43b-21fe-dcba-0987654321fe"
 *                   resultTypeId:
 *                     type: string
 *                     example: "p09876d5-c43b-21fe-dcba-0987654321fe"
 *     responses:
 *       200:
 *         description: Impact created or updated successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post("/impact", createOrUpdateImpactController);

/**
 * @swagger
 * /api/projectManagement/impacts:
 *   get:
 *     summary: Get all Impacts
 *     tags: [IMPACT]
 *     responses:
 *       200:
 *         description: List of impacts retrieved successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/impacts", getAllImpactsController);

/**
 * @swagger
 * /api/projectManagement/impact/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete an Impact
 *     tags: [IMPACT]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Impact to delete
 *     responses:
 *       200:
 *         description: Impact deleted successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete("/impact/:id", deleteImpactController);

/**
 * @swagger
 * /api/projectManagement/indicator:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or Update an Indicator
 *     description: >
 *       Create a new Indicator (if `isCreate` is `true`) or update an existing one (if `isCreate` is `false`).
 *       When updating, you must provide the `indicatorId`.
 *     tags: [INDICATOR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 $ref: '#/components/schemas/IIndicator'
 *     responses:
 *       201:
 *         description: Indicator created successfully
 *       200:
 *         description: Indicator updated successfully
 *       404:
 *         description: Indicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.post("/indicator", createOrUpdateIndicatorController);

/**
 * @swagger
 * /api/projectManagement/indicators/{resultId}:
 *   get:
 *     summary: Get all Indicators by it's result
 *     description: Retrieve a list of all indicators with their details.
 *     tags: [INDICATOR]
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         description: The unique Result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of indicators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IIndicator'
 *       404:
 *         description: No indicators found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/indicators/:resultId", getAllIndicatorsByResult);

/**
 * @swagger
 * /api/projectManagement/indicator/{indicatorId}:
 *   get:
 *     summary: Get an Indicator by it's ID
 *     description: Retrieve details of a specific indicator using its unique ID.
 *     tags: [INDICATOR]
 *     parameters:
 *       - in: path
 *         name: indicatorId
 *         required: true
 *         description: The unique ID of the indicator
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Indicator retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IIndicator'
 *       404:
 *         description: Indicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/indicator/:indicatorId", getIndicatorById);

/**
 * @swagger
 * /api/projectManagement/indicator/{indicatorId}:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete an Indicator
 *     tags: [INDICATOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Indicator to delete
 *     responses:
 *       200:
 *         description: Indicator deleted successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete(
  "/indicator/:indicatorId",
  deleteImpactController
);

/**
 * @swagger
 * /api/projectManagement/indicator_report:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or update an Indicator Report Format
 *     description: >
 *       Creates a new Indicator Report Format if `isCreate` is true.
 *       Otherwise, updates an existing record if `IndicatorReportId` is provided.
 *     tags: [INDICATOR REPORT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payload:
 *                 $ref: '#/components/schemas/IIndicatorReport'
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Indicator Report Format created/updated successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post(
  "/indicator_report",
  createOrUpdateIndicatorReport
);

/**
 * @swagger
 * /api/projectManagement/indicator-report/{resultId}:
 *   get:
 *     summary: Get all Indicator Report Formats
 *     description: Fetches all Indicator Report Formats from the database.
 *     tags: [INDICATOR REPORT]
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         description: The unique Result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved list of Impact Indicator Report Formats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IIndicatorReport'
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/indicator-reports/:resultId",
  getIndicatorReportsByResult
);

/**
 * @swagger
 * /api/projectManagement/indicator-report/{id}:
 *   get:
 *     summary: Get a single Indicator Report Format by ID
 *     description: Fetches a single Indicator Report Format by its ID.
 *     tags: [INDICATOR REPORT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Successfully retrieved Indicator Report Format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IIndicatorReport'
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/indicator-report/:id",
  getImpactIndicatorReportById
);

/**
 * @swagger
 * /api/projectManagement/indicator-report/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Delete an Indicator Report Format
 *     description: Deletes an Indicator Report Format by its ID.
 *     tags: [INDICATOR REPORT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete("/indicator-report/:id", removeIndicatorReport);

/**
 * @swagger
 * /api/projectManagement/outcomes:
 *   get:
 *     summary: Get all outcomes
 *     tags: [OUTCOME]
 *     responses:
 *       200:
 *         description: List of outcomes
 *       404:
 *         description: No outcomes found
 */
projectManagementRouter.get("/outcomes", getAllOutcomesController);

/**
 * @swagger
 * /api/projectManagement/outcome/{id}:
 *   get:
 *     summary: Get outcome by ID
 *     tags: [OUTCOME]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Outcome ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Outcome found
 *       404:
 *         description: Outcome not found
 */
projectManagementRouter.get("/outcome/:id", getOutcomeByIdController);

/**
 * @swagger
 * /api/projectManagement/outcome:
 *   post:
 *     summary: Create or update an outcome
 *     tags: [OUTCOME]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: Pass `true` for create, `false` for update
 *               data:
 *                 type: object
 *                 properties:
 *                   outcomeId:
 *                     type: string
 *                     description: Required if updating
 *                   outcomeStatement:
 *                     type: string
 *                   outcomeType:
 *                     type: string
 *                   impactId:
 *                     type: string
 *                   thematicAreas:
 *                     type: string
 *                   responsiblePerson:
 *                     type: string
 *                   projectId:
 *                     type: string
 *                   resultTypeId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Outcome created/updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Outcome not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.post("/outcome", saveOutcomeController);

/**
 * @swagger
 * /api/projectManagement/outcome/{id}:
 *   delete:
 *     summary: Delete an outcome
 *     tags: [OUTCOME]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Outcome ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Outcome deleted successfully
 *       404:
 *         description: Outcome not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete("/outcome/:id", deleteOutcomeController);

/**
 * @swagger
 * /api/projectManagement/output:
 *   post:
 *     summary: Create or Update an Output
 *     description: |
 *       This endpoint handles both **create** and **update** operations for outputs.
 *       - If `isCreate` is **true**, a new output is created.
 *       - If `isCreate` is **false**, the existing output is updated.
 *       The `payload` object contains the output details.
 *     security:
 *       - bearerAuth: []
 *     tags: [OUTPUT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               payload:
 *                 $ref: '#/components/schemas/Output'
 *     responses:
 *       200:
 *         description: Output created or updated successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
projectManagementRouter.post("/output", createOrUpdateOutputController);

/**
 * @swagger
 * /api/projectManagement/outputs:
 *   get:
 *     summary: Get all Outputs
 *     description: Retrieve all outputs from the output view.
 *     tags: [OUTPUT]
 *     responses:
 *       200:
 *         description: List of outputs retrieved successfully
 *       404:
 *         description: Outputs not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/outputs", getAllOutputsController);

/**
 * @swagger
 * /api/projectManagement/output/{id}:
 *   get:
 *     summary: Get Output by ID
 *     description: Retrieve a single output by its ID from the output view.
 *     tags: [OUTPUT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the output
 *     responses:
 *       200:
 *         description: Output retrieved successfully
 *       404:
 *         description: Output not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/output/:id", getOutputByIdController);

/**
 * @swagger
 * /api/projectManagement/output/{id}:
 *   delete:
 *     summary: Delete an Output
 *     description: Permanently delete an output by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [OUTPUT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the output
 *     responses:
 *       200:
 *         description: Output deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Output not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete("/output/:id", deleteOutputController);

/**
 * @swagger
 * /api/projectManagement/activity:
 *   post:
 *     summary: Create or Update an Activity
 *     description: |
 *       Create a new Activity when `isCreate` is true.
 *       Update an existing Activity when `isCreate` is false.
 *     tags: [ACTIVITIES]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: true to create, false to update
 *               payload:
 *                 $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: Activity created/updated successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post("/activity", createOrUpdateActivityController);

/**
 * @swagger
 * /api/projectManagement/activities:
 *   get:
 *     summary: Get all Activities
 *     tags: [ACTIVITIES]
 *     responses:
 *       200:
 *         description: List of Activities
 *       404:
 *         description: No Activities found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/activities", getAllActivitiesController);

/**
 * @swagger
 * /api/projectManagement/activity/{id}:
 *   get:
 *     summary: Get Activity by ID
 *     tags: [ACTIVITIES]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity details
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/activity/:id", getActivityByIdController);

/**
 * @swagger
 * /api/projectManagement/activity/{id}:
 *   delete:
 *     summary: Delete an Activity
 *     tags: [ACTIVITIES]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete("/activity/:id", deleteActivityController);

/**
 * @swagger
 * /api/projectManagement/activity-report:
 *   post:
 *     summary: Create or Update an ActivityReport
 *     description: >
 *       This endpoint allows you to **create or update an ActivityReport**.
 *       - If `isCreate` is set to `true`, a new ActivityReport will be created.
 *       - If `isCreate` is set to `false`, the existing ActivityReport will be updated (requires `activityReportId`).
 *     tags: [ACTIVITY REPORTS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               payload:
 *                 $ref: '#/components/schemas/ActivityReport'
 *     responses:
 *       200:
 *         description: ActivityReport created or updated successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post(
  "/activity-report",
  createOrUpdateActivityReportController
);

/**
 * @swagger
 * /api/projectManagement/activity-reports:
 *   get:
 *     summary: Get all ActivityReports
 *     tags: [ACTIVITY REPORTS]
 *     responses:
 *       200:
 *         description: List of ActivityReports
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/activity-reports",
  getAllActivityReportsController
);

/**
 * @swagger
 * /api/projectManagement/activity-report/{id}:
 *   get:
 *     summary: Get ActivityReport by ID
 *     tags: [ACTIVITY REPORTS]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ActivityReport ID
 *     responses:
 *       200:
 *         description: ActivityReport found
 *       404:
 *         description: ActivityReport not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/activity-report/:id",
  getActivityReportByIdController
);

/**
 * @swagger
 * /api/projectManagement/activity-report/{id}:
 *   delete:
 *     summary: Delete an ActivityReport
 *     tags: [ACTIVITY REPORTS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ActivityReport ID
 *     responses:
 *       200:
 *         description: ActivityReport deleted successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete(
  "/activity-report/:id",
  deleteActivityReportController
);

/**
 * @swagger
 * /api/projectManagement/logical_framework:
 *   post:
 *     summary: Create or Update a LogicalFramework
 *     description: Use `isCreate = true` to create a new LogicalFramework, and `isCreate = false` to update an existing one.
 *     tags: [LogicalFramework]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               payload:
 *                 $ref: '#/components/schemas/LogicalFramework'
 *     responses:
 *       200:
 *         description: LogicalFramework created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogicalFramework'
 *       500:
 *         description: Server error
 */
projectManagementRouter.post(
  "/logical_framework",
  createOrUpdateLogicalFrameworkController
);

/**
 * @swagger
 * /api/projectManagement/logical_frameworks:
 *   get:
 *     summary: Get all LogicalFrameworks
 *     tags: [LogicalFramework]
 *     responses:
 *       200:
 *         description: List of LogicalFrameworks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogicalFramework'
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/logical_frameworks",
  getAllLogicalFrameworksController
);

/**
 * @swagger
 * /api/projectManagement/logical_framework/{id}:
 *   get:
 *     summary: Get LogicalFramework by ID
 *     tags: [LogicalFramework]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: LogicalFramework ID
 *     responses:
 *       200:
 *         description: LogicalFramework details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogicalFramework'
 *       404:
 *         description: LogicalFramework not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/logical_framework/:id",
  getLogicalFrameworkByIdController
);

/**
 * @swagger
 * /api/projectManagement/logical_framework/{id}:
 *   delete:
 *     summary: Delete LogicalFramework by ID
 *     tags: [LogicalFramework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: LogicalFramework ID
 *     responses:
 *       200:
 *         description: LogicalFramework deleted successfully
 *       404:
 *         description: LogicalFramework not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete(
  "/logical_framework/:id",
  deleteLogicalFrameworkController
);

/**
 * @swagger
 * /api/projectManagement/result_dashboard/{projectId}:
 *   get:
 *     summary: Get result dashboard data by PROJECT ID
 *     tags: [RESULT DASHBOARD]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: PROJECT ID
 *     responses:
 *       200:
 *         description: data
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/result_dashboard/:projectId",
  getResultDashboardDataController
);


/**
 * @swagger
 * /api/projectManagement/org_kpi_dashboard:
 *   get:
 *     summary: Get Org Kpi dashboard
 *     tags: [ORG KPI DASHBOARD]
 *     parameters:
 *       - in: query
 *         name: thematicArea
 *         schema:
 *           type: string
 *         description: Filter by thematic area (e.g., Governance)
 *       - in: query
 *         name: strategicObjectiveId
 *         schema:
 *           type: string
 *         description: Filter by strategic objective ID
 *       - in: query
 *         name: resultLevel
 *         schema:
 *           type: string
 *         description: Filter by result level (e.g., Impact, Outcome, Output)
 *       - in: query
 *         name: kpiId
 *         schema:
 *           type: string
 *         description: Filter by a specific KPI ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reports from this actual date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reports up to this actual date
 *       - in: query
 *         name: disaggregationType
 *         schema:
 *           type: string
 *         description: Filter by disaggregation type (e.g., GENDER, STATE)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter chart data by year (e.g., 2024)
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 message: "Data"
 *                 data:
 *                   THEMATIC_AREA_SUMMARY:
 *                     - thematicArea: "Economic Diversification"
 *                       totalSOs: 1
 *                       totalKPIs: 1
 *                       overallKPIPerformance: 85.5
 *                   KPI_OVERVIEW_CHART:
 *                     monthly:
 *                       - period: "Jan"
 *                         year: 2024
 *                         actual: 150
 *                         target: 5000
 *                     quarterly:
 *                       - period: "Q1"
 *                         year: 2024
 *                         actual: 450
 *                         target: 5000
 *                     baseline: 200
 *                     annualTarget: 5000
 *                   KPI_TABLE_DATA:
 *                     - kpiId: "a0ea2153-0c14-40da-8447-9328bde20f32"
 *                       code: "ECO-1"
 *                       statement: "IMP Indicator 1.1: Change in employment rate of women/PwDs/Youth in the Niger Delta"
 *                       thematicArea: "Economic Diversification"
 *                       strategicObjective: "1.1. Foster Sustainable Livelihoods"
 *                       resultLevel: "Impact"
 *                       baseline: 200
 *                       target: 5000
 *                       actual: 450
 *                       performance: 9.0
 *                       status: "Not Met"
 *                   PROJECT_INDICATOR_PERFORMANCE:
 *                     kpis:
 *                       - kpiId: "a0ea2153-0c14-40da-8447-9328bde20f32"
 *                         code: "ECO-1"
 *                         statement: "IMP Indicator 1.1: Change in employment rate of women/PwDs/Youth in the Niger Delta"
 *                         actual: 450
 *                         target: 5000
 *                         performance: 9.0
 *                     averagePerformance: 9.0
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/org_kpi_dashboard",
  getOrgKpiDashboardDataController
);


/**
 * @swagger
 * /api/projectManagement/project_activity_dashboard/{projectId}:
 *   get:
 *     summary: Get project activity dashboard data by PROJECT ID
 *     tags: [PROJECT ACTIVITY DASHBOARD]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: PROJECT ID
 *     responses:
 *       200:
 *         description: data
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/project_activity_dashboard/:projectId",
  getProjectActivityDashboardDataController
);

export default projectManagementRouter;
