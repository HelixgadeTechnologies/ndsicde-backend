import { Router } from "express";
import { fetchGeneralSettings, getRoles, registerRoleController, saveGeneralSettings } from "../controllers/authController";

const settingsRouter: Router = Router();

/**
 * @swagger
 * /api/settings/general:
 *   post:
 *     summary: Create or update general settings
 *     tags: [GeneralSettings]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new settings entry is created.
 *       - If `isCreate` is false, existing settings (by `generalSettingsId`) are updated.
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
 *               data:
 *                 type: object
 *                 properties:
 *                   generalSettingsId:
 *                     type: string
 *                   organizationName:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *                   contactPhone:
 *                     type: string
 *                   website:
 *                     type: string
 *                   organizationLogo:
 *                     type: string
 *                   defaultCurrency:
 *                     type: string
 *                   defaultTimeZone:
 *                     type: string
 *                   dateRetentionPolicy:
 *                     type: string
 *                   auditLogRetention:
 *                     type: string
 *                   emailNotification:
 *                     type: boolean
 *                   maintenanceAlert:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: General settings created
 *       200:
 *         description: General settings updated
 *       400:
 *         description: Bad request or validation error
 */
settingsRouter.post("/general", saveGeneralSettings);

/**
 * @swagger
 * /api/settings/general:
 *   get:
 *     summary: Get general settings
 *     tags: [GeneralSettings]
 *     responses:
 *       200:
 *         description: General settings retrieved
 *       500:
 *         description: Server error
 */
settingsRouter.get("/general", fetchGeneralSettings);

/**
 * @swagger
 * /api/settings/register-role:
 *   post:
 *     summary: Create or update a role
 *     tags: [GeneralSettings]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new role is created.
 *       - If `isCreate` is false, an existing role is updated using the `roleId`.
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
 *               data:
 *                 type: object
 *                 required:
 *                   - roleName
 *                 properties:
 *                   roleId:
 *                     type: string
 *                     description: Required if updating an existing role
 *                   roleName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   permission:
 *                     type: string
 *     responses:
 *       201:
 *         description: Role created or updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
settingsRouter.post("/register-role", registerRoleController);

/**
 * @swagger
 * /api/settings/roles:
 *   get:
 *     summary: Retrieve all roles
 *     tags: [GeneralSettings]
 *     responses:
 *       201:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleId:
 *                         type: string
 *                       roleName:
 *                         type: string
 *                       description:
 *                         type: string
 *                       permission:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
settingsRouter.get("/roles",getRoles)

export default settingsRouter;
