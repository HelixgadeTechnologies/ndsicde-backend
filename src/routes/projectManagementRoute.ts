import { Router } from "express";
import {
    createOrUpdateActivityController,
  createOrUpdateActivityReportController,
  createOrUpdateImpactController,
  createOrUpdateImpactIndicatorController,
  createOrUpdateImpactIndicatorReportFormat,
  createOrUpdateLogicalFrameworkController,
  createOrUpdateOutcomeIndicator,
  createOrUpdateOutcomeIndicatorReportFormat,
  createOrUpdateOutputController,
  createOrUpdateOutputIndicatorController,
  createOrUpdatePartnerController,
  createOrUpdateProject,
  createOrUpdateTeamMemberController,
  createOutputIndicatorReportFormat,
  deleteActivityController,
  deleteActivityReportController,
  deleteImpactController,
  deleteLogicalFrameworkController,
  deleteOutcomeController,
  deleteOutputController,
  deleteOutputIndicatorController,
  deleteOutputIndicatorReportFormatController,
  deletePartnerController,
  deleteTeamMemberController,
  fetchAllProjects,
  fetchProjectById,
  fetchProjectStatusStats,
  getActivityByIdController,
  getActivityReportByIdController,
  getAllActivitiesController,
  getAllActivityReportsController,
  getAllImpactIndicators,
  getAllImpactsController,
  getAllLogicalFrameworksController,
  getAllOutcomesController,
  getAllOutputIndicatorReportFormatController,
  getAllOutputIndicatorsController,
  getAllOutputsController,
  getAllPartnersController,
  getAllTeamMemberController,
  getImpactIndicatorById,
  getImpactIndicatorReportFormat,
  getImpactIndicatorReportFormats,
  getImpactIndicatorsByProjectId,
  getLogicalFrameworkByIdController,
  getOutcomeByIdController,
  getOutcomeIndicatorById,
  getOutcomeIndicatorReportFormatByIdController,
  getOutcomeIndicatorReportFormats,
  getOutcomeIndicators,
  getOutputByIdController,
  getOutputIndicatorByIdController,
  getOutputIndicatorReportFormatByIdController,
  removeImpactIndicatorReportFormat,
  removeOutcomeIndicator,
  removeOutcomeIndicatorReportFormat,
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
projectManagementRouter.get("/impact", getAllImpactsController);

/**
 * @swagger
 * /api/projectManagement/impact/{id}:
 *   delete:
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
 * /api/projectManagement/impact-indicator:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or Update an Impact Indicator
 *     description: >
 *       Create a new Impact Indicator (if `isCreate` is `true`) or update an existing one (if `isCreate` is `false`).
 *       When updating, you must provide the `impactIndicatorId`.
 *     tags: [IMPACT INDICATOR]
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
 *                 $ref: '#/components/schemas/IImpactIndicator'
 *     responses:
 *       201:
 *         description: Impact Indicator created successfully
 *       200:
 *         description: Impact Indicator updated successfully
 *       404:
 *         description: Impact Indicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.post(
  "/impact-indicator",
  createOrUpdateImpactIndicatorController
);

/**
 * @swagger
 * /api/projectManagement/impact-indicators:
 *   get:
 *     summary: Get all Impact Indicators
 *     description: Retrieve a list of all impact indicators with their details.
 *     tags: [IMPACT INDICATOR]
 *     responses:
 *       200:
 *         description: List of impact indicators
 *       404:
 *         description: No impact indicators found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/impact-indicators", getAllImpactIndicators);

/**
 * @swagger
 * /api/projectManagement/impact-indicator/{id}:
 *   get:
 *     summary: Get an Impact Indicator by ID
 *     description: Retrieve details of a specific impact indicator using its unique ID.
 *     tags: [IMPACT INDICATOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the impact indicator
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Impact Indicator retrieved successfully
 *       404:
 *         description: Impact Indicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/impact-indicator/:id", getImpactIndicatorById);

/**
 * @swagger
 * /api/projectManagement/impact-indicators/project/{projectId}:
 *   get:
 *     summary: Get Impact Indicators by Project ID
 *     description: Retrieve all impact indicators linked to a specific project.
 *     tags: [IMPACT INDICATOR]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The unique ID of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of impact indicators for the given project
 *       404:
 *         description: No impact indicators found for the project
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/impact-indicators/project/:projectId",
  getImpactIndicatorsByProjectId
);

/**
 * @swagger
 * /api/projectManagement/impact-indicator-report-format:
 *   post:
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     summary: Create or update an Impact Indicator Report Format
 *     description: >
 *       Creates a new Impact Indicator Report Format if `isCreate` is true.
 *       Otherwise, updates an existing record if `impactIndicatorReportFormatId` is provided.
 *     tags: [IMPACT INDICATOR REPORT FORMAT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payload:
 *                 $ref: '#/components/schemas/IImpactIndicatorReportFormat'
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Impact Indicator Report Format created/updated successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post(
  "/impact-indicator-report-format",
  createOrUpdateImpactIndicatorReportFormat
);

/**
 * @swagger
 * /api/projectManagement/impact-indicator-report-formats:
 *   get:
 *     summary: Get all Impact Indicator Report Formats
 *     description: Fetches all Impact Indicator Report Formats from the database.
 *     tags: [IMPACT INDICATOR REPORT FORMAT]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of Impact Indicator Report Formats
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/impact-indicator-report-formats",
  getImpactIndicatorReportFormats
);

/**
 * @swagger
 * /api/projectManagement/impact-indicator-report-format/{id}:
 *   get:
 *     summary: Get a single Impact Indicator Report Format by ID
 *     description: Fetches a single Impact Indicator Report Format by its ID.
 *     tags: [IMPACT INDICATOR REPORT FORMAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Impact Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Successfully retrieved Impact Indicator Report Format
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get(
  "/impact-indicator-report-format/:id",
  getImpactIndicatorReportFormat
);

/**
 * @swagger
 * /api/projectManagement/impact-indicator-report-format/{id}:
 *   delete:
 *     summary: Delete an Impact Indicator Report Format
 *     description: Deletes an Impact Indicator Report Format by its ID.
 *     tags: [IMPACT INDICATOR REPORT FORMAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Impact Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete(
  "/impact-indicator-report-format/:id",
  removeImpactIndicatorReportFormat
);

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
 * /api/projectManagement/outcomeIndicator:
 *   post:
 *     summary: Create or update an OutcomeIndicator
 *     tags: [OUTCOME_INDICATOR]
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
 *                 description: Pass `true` to create, `false` to update
 *               payload:
 *                 $ref: '#/components/schemas/OutcomeIndicator'
 *     responses:
 *       200:
 *         description: OutcomeIndicator created/updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
projectManagementRouter.post(
  "/outcomeIndicator",
  createOrUpdateOutcomeIndicator
);

/**
 * @swagger
 * /api/projectManagement/outcomeIndicators:
 *   get:
 *     summary: Get all OutcomeIndicators
 *     tags: [OUTCOME_INDICATOR]
 *     responses:
 *       200:
 *         description: List of OutcomeIndicators
 *       404:
 *         description: No OutcomeIndicators found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/outcomeIndicators", getOutcomeIndicators);

/**
 * @swagger
 * /api/projectManagement/outcomeIndicator/{outcomeIndicatorId}:
 *   get:
 *     summary: Get an OutcomeIndicator by ID
 *     tags: [OUTCOME_INDICATOR]
 *     parameters:
 *       - in: path
 *         name: outcomeIndicatorId
 *         schema:
 *           type: string
 *         required: true
 *         description: OutcomeIndicator ID
 *     responses:
 *       200:
 *         description: OutcomeIndicator fetched successfully
 *       404:
 *         description: OutcomeIndicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/outcomeIndicator/:outcomeIndicatorId",
  getOutcomeIndicatorById
);

/**
 * @swagger
 * /api/projectManagement/outcomeIndicator/{outcomeIndicatorId}:
 *   delete:
 *     summary: Delete an OutcomeIndicator by ID
 *     tags: [OUTCOME_INDICATOR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: outcomeIndicatorId
 *         schema:
 *           type: string
 *         required: true
 *         description: OutcomeIndicator ID
 *     responses:
 *       200:
 *         description: OutcomeIndicator deleted successfully
 *       404:
 *         description: OutcomeIndicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete(
  "/outcomeIndicator/:outcomeIndicatorId",
  removeOutcomeIndicator
);

/**
 * @swagger
 * /api/projectManagement/outcome-indicator-report-formats:
 *   get:
 *     summary: Get all OutcomeIndicatorReportFormats
 *     tags: [OUTCOME INDICATOR REPORT FORMAT]
 *     responses:
 *       200:
 *         description: List of all OutcomeIndicatorReportFormats
 *       404:
 *         description: No OutcomeIndicatorReportFormats found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/outcome-indicator-report-formats",
  getOutcomeIndicatorReportFormats
);

/**
 * @swagger
 * /api/projectManagement/outcome-indicator-report-format/{id}:
 *   get:
 *     summary: Get OutcomeIndicatorReportFormat by ID
 *     tags: [OUTCOME INDICATOR REPORT FORMAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the OutcomeIndicatorReportFormat
 *     responses:
 *       200:
 *         description: OutcomeIndicatorReportFormat fetched successfully
 *       404:
 *         description: OutcomeIndicatorReportFormat not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get(
  "/outcome-indicator-report-format/:outcomeIndicatorReportFormatId",
  getOutcomeIndicatorReportFormatByIdController
);

/**
 * @swagger
 * /api/projectManagement/outcome-indicator-report-format:
 *   post:
 *     summary: Create or Update an OutcomeIndicatorReportFormat
 *     description: |
 *       This endpoint is used to either create a new OutcomeIndicatorReportFormat or update an existing one.
 *
 *       - When **isCreate = true**, a new OutcomeIndicatorReportFormat record will be created.
 *       - When **isCreate = false**, the existing OutcomeIndicatorReportFormat will be updated with the provided payload.
 *     tags: [OUTCOME INDICATOR REPORT FORMAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - payload
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *                 description: Flag to determine whether to create (true) or update (false).
 *               payload:
 *                 type: object
 *                 description: OutcomeIndicatorReportFormat payload
 *                 properties:
 *                   indicatorSource:
 *                     type: string
 *                   thematicAreasOrPillar:
 *                     type: string
 *                   indicatorStatement:
 *                     type: string
 *                   responsiblePersons:
 *                     type: string
 *                   disaggregationType:
 *                     type: string
 *                   linkKpiToSdnOrgKpi:
 *                     type: string
 *                   definition:
 *                     type: string
 *                   specificArea:
 *                     type: string
 *                   unitOfMeasure:
 *                     type: string
 *                   itemInMeasure:
 *                     type: string
 *                   actualDate:
 *                     type: string
 *                     format: date-time
 *                   cumulativeActual:
 *                     type: string
 *                   actualNarrative:
 *                     type: string
 *                   attachmentUrl:
 *                     type: string
 *                   outcomeIndicatorId:
 *                     type: string
 *     responses:
 *       200:
 *         description: OutcomeIndicatorReportFormat created or updated successfully
 *       404:
 *         description: OutcomeIndicatorReportFormat not found (when updating)
 *       500:
 *         description: Server error
 */
projectManagementRouter.post(
  "/outcome-indicator-report-format",
  createOrUpdateOutcomeIndicatorReportFormat
);

/**
 * @swagger
 * /api/projectManagement/outcome-indicator-report-format/{id}:
 *   delete:
 *     summary: Delete an OutcomeIndicatorReportFormat
 *     tags: [OUTCOME INDICATOR REPORT FORMAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the OutcomeIndicatorReportFormat
 *     responses:
 *       200:
 *         description: OutcomeIndicatorReportFormat deleted successfully
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete(
  "/outcome-indicator-report-format/:outcomeIndicatorReportFormatId",
  removeOutcomeIndicatorReportFormat
);

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
 * /api/projectManagement/output-indicator:
 *   post:
 *     summary: Create or Update an OutputIndicator
 *     description: |
 *       This endpoint handles both **create** and **update** operations for output indicators.  
 *       - If `isCreate` is **true**, a new OutputIndicator is created.  
 *       - If `isCreate` is **false**, the existing OutputIndicator is updated.  
 *       The `payload` object contains the OutputIndicator details.
 *     security:
 *       - bearerAuth: []
 *     tags: [OUTPUT INDICATOR]
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
 *                 $ref: '#/components/schemas/OutputIndicator'
 *     responses:
 *       200:
 *         description: OutputIndicator created or updated successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
projectManagementRouter.post("/output-indicator", createOrUpdateOutputIndicatorController);

/**
 * @swagger
 * /api/projectManagement/output-indicators:
 *   get:
 *     summary: Get all OutputIndicators
 *     description: Retrieve all output indicators from the view.
 *     tags: [OUTPUT INDICATOR]
 *     responses:
 *       200:
 *         description: A list of OutputIndicators
 *       404:
 *         description: No OutputIndicators found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/output-indicators", getAllOutputIndicatorsController);

/**
 * @swagger
 * /api/projectManagement/output-indicator/{id}:
 *   get:
 *     summary: Get OutputIndicator by ID
 *     description: Retrieve a specific OutputIndicator by its ID.
 *     tags: [OUTPUT INDICATOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The OutputIndicator ID
 *     responses:
 *       200:
 *         description: OutputIndicator fetched successfully
 *       404:
 *         description: OutputIndicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.get("/output-indicator/:id", getOutputIndicatorByIdController);

/**
 * @swagger
 * /api/projectManagement/output-indicator/{id}:
 *   delete:
 *     summary: Delete OutputIndicator
 *     description: Delete an OutputIndicator by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [OUTPUT INDICATOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The OutputIndicator ID
 *     responses:
 *       200:
 *         description: OutputIndicator deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: OutputIndicator not found
 *       500:
 *         description: Server error
 */
projectManagementRouter.delete("/output-indicator/:id", deleteOutputIndicatorController);


/**
 * @swagger
 * /api/projectManagement/output-indicator-report-format:
 *   post:
 *     summary: Create or Update an Output Indicator Report Format
 *     description: |
 *       Create a new Output Indicator Report Format when `isCreate` is true.
 *       Update an existing Output Indicator Report Format when `isCreate` is false.
 *     tags: [OUTPUT INDICATOR REPORT FORMAT]
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
 *                 $ref: '#/components/schemas/OutputIndicatorReportFormat'
 *     responses:
 *       200:
 *         description: Output Indicator Report Format created/updated successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.post("/output-indicator-report-format", createOutputIndicatorReportFormat);

/**
 * @swagger
 * /api/projectManagement/output-indicator-report-formats:
 *   get:
 *     summary: Get all Output Indicator Report Formats
 *     tags: [OUTPUT INDICATOR REPORT FORMAT]
 *     responses:
 *       200:
 *         description: List of Output Indicator Report Formats
 *       404:
 *         description: No Output Indicator Report Formats found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/output-indicator-report-formats", getAllOutputIndicatorReportFormatController);

/**
 * @swagger
 * /api/projectManagement/output-indicator-report-format/{id}:
 *   get:
 *     summary: Get Output Indicator Report Format by ID
 *     tags: [OUTPUT INDICATOR REPORT FORMAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Output Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Output Indicator Report Format details
 *       404:
 *         description: Output Indicator Report Format not found
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.get("/output-indicator-report-format/:id", getOutputIndicatorReportFormatByIdController);

/**
 * @swagger
 * /api/projectManagement/output-indicator-report-format/{id}:
 *   delete:
 *     summary: Delete an Output Indicator Report Format
 *     tags: [OUTPUT INDICATOR REPORT FORMAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Output Indicator Report Format ID
 *     responses:
 *       200:
 *         description: Output Indicator Report Format deleted successfully
 *       500:
 *         description: Internal server error
 */
projectManagementRouter.delete("/output-indicator-report-format/:id", deleteOutputIndicatorReportFormatController);


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
projectManagementRouter.post("/activity-report", createOrUpdateActivityReportController);

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
projectManagementRouter.get("/activity-reports", getAllActivityReportsController);

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
projectManagementRouter.get("/activity-report/:id", getActivityReportByIdController);

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
projectManagementRouter.delete("/activity-report/:id", deleteActivityReportController);


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
projectManagementRouter.post("/logical_framework", createOrUpdateLogicalFrameworkController);

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
projectManagementRouter.get("/logical_frameworks", getAllLogicalFrameworksController);

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
projectManagementRouter.get("/logical_framework/:id", getLogicalFrameworkByIdController);

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
projectManagementRouter.delete("/logical_framework/:id", deleteLogicalFrameworkController);



export default projectManagementRouter;
