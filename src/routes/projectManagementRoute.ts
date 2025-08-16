import { Router } from "express";
import { createOrUpdateProject, fetchAllProjects, fetchProjectById, fetchProjectStatusStats, removeProject } from "../controllers/projectManagementController";

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

export default projectManagementRouter;
