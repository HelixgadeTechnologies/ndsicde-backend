// routes/projectValidation.routes.ts
import { Router } from "express";
import { ProjectValidationController } from "../controllers/dataValidationController";

const dataValidationRouter: Router = Router();
const projectValidationController = new ProjectValidationController();

/**
 * @swagger
 * /api/dataValidation/project-validations:
 *   get:
 *     summary: Get all project validations
 *     tags: [DataValidation]
 *     responses:
 *       200:
 *         description: List of project validations
 */
dataValidationRouter.get(
  "/project-validations",
  projectValidationController.getAll.bind(projectValidationController)
);

/**
 * @swagger
 * /api/dataValidation/project-validations/{id}:
 *   get:
 *     summary: Get a project validation by ID
 *     tags: [DataValidation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project validation ID
 *     responses:
 *       200:
 *         description: Project validation found
 *       404:
 *         description: Project validation not found
 */
dataValidationRouter.get(
  "/project-validations/:id",
  projectValidationController.getById.bind(projectValidationController)
);

/**
 * @swagger
 * /api/dataValidation/project-validation:
 *   post:
 *     summary: Create or update a project validation
 *     tags: [DataValidation]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new Project Validation entry is created.
 *       - If `isCreate` is false, existing Project Validation (by `projectValidationId`) are updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: Set to true to create a new project validation, false to update
 *               data:
 *                 type: object
 *                 properties:
 *                   projectValidationId:
 *                     type: string
 *                   submissionName:
 *                     type: string
 *                   projectId:
 *                     type: string
 *                   submittedBy:
 *                     type: string
 *                   status:
 *                     type: string
 *                   type:
 *                     type: string
 *                 example:
 *                   isCreate: true
 *                   submissionName: "Sample Project"
 *                   submissionType: "TypeA"
 *     responses:
 *       201:
 *         description: Project validation created successfully
 *       200:
 *         description: Project validation updated successfully
 */
dataValidationRouter.post(
  "/project-validation",
  projectValidationController.createOrUpdate.bind(projectValidationController)
);

/**
 * @swagger
 * /api/dataValidation/project-validation:
 *   delete:
 *     summary: Delete a project validation
 *     tags: [DataValidation]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectValidationId:
 *                 type: string
 *             example:
 *               projectValidationId: "12345"
 *     responses:
 *       200:
 *         description: Project validation deleted successfully
 */
dataValidationRouter.delete(
  "/project-validation",
  projectValidationController.delete.bind(projectValidationController)
);


/**
 * @swagger
 * /api/dataValidation/project-validation-summary:
 *   get:
 *     summary: Get submission validation summary
 *     tags: [DataValidation]
 *     responses:
 *       200:
 *         description: Summary of validation submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Validation summary retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSubmissions:
 *                       type: integer
 *                       example: 120
 *                     pendingReview:
 *                       type: integer
 *                       example: 20
 *                     approved:
 *                       type: integer
 *                       example: 80
 *                     rejected:
 *                       type: integer
 *                       example: 20
 *       500:
 *         description: Internal server error
 */
dataValidationRouter.get("/project-validation-summary", projectValidationController.getSummary.bind(projectValidationController));

export default dataValidationRouter;
