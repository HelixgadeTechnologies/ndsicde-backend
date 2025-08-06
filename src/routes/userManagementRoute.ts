import { Router } from "express";
import { deleteUser, fetchAllUsers, fetchUserById, register } from "../controllers/authController";

const userManagementRoutes: Router = Router();

/**
 * @swagger
 * /api/userManagement/register:
 *   post:
 *     summary: Register a new user or update an existing one
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new user is created with default password "12345".
 *       - If `isCreate` is false, the existing user is updated (requires `userId` inside `data`).
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
 *                 description: Indicates whether to create or update a user
 *               data:
 *                 type: object
 *                 required:
 *                   - email
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: Required if isCreate is false (for updates)
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   roleId:
 *                     type: string
 *                   department:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   status:
 *                     type: string
 *                   assignedProjectId:
 *                     type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation failed or user already exists
 */
userManagementRoutes.post("/register", register);

/**
 * @swagger
 * /api/userManagement/users:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: A list of all users
 *       500:
 *         description: Server error
 */
userManagementRoutes.get("/users", fetchAllUsers);
/**
 * @swagger
 * /api/userManagement/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userManagementRoutes.get("/users/:userId", fetchUserById);

/**
 * @swagger
 * /api/userManagement/delete:
 *   delete:
 *     summary: Delete a user by userId
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to delete
 *     responses:
 *       201:
 *         description: User removed successfully
 *       400:
 *         description: User not found or userId not provided
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.delete("/delete", deleteUser);

export default userManagementRoutes