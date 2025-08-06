import { Router } from "express";
import { deleteUser, fetchAllUsers, fetchUserById, forgotPasswordController, login, register, test, updateLogInUser, updateUserProfilePicture } from "../controllers/authController";

const authRoutes: Router = Router();
/**
 * @swagger
 * /api/auth/signIn:
 *   post:
 *     summary: Sign In a user
 *     tags: [Auth] 
 *     description: Fetches a user from the database for login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: A user record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User signed in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     token:
 *                       type: string
 *                       example: "jwt-token-string"
 *       400:
 *         description: Bad request (missing parameters)
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/signIn", login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Reset a user's password to the default value "12345"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset successfully to "12345"
 *       400:
 *         description: User not found or error
 */
authRoutes.post("/forgot-password", forgotPasswordController);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user or update an existing one
 *     tags: [Auth]
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
authRoutes.post("/register", register);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: A list of all users
 *       500:
 *         description: Server error
 */
authRoutes.get("/users", fetchAllUsers);
/**
 * @swagger
 * /api/auth/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
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
authRoutes.get("/users/:userId", fetchUserById);

/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     summary: Delete a user by userId
 *     tags: [Auth]
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
authRoutes.delete("/delete", deleteUser);


/**
 * @swagger
 * /api/auth/update-login-user:
 *   put:
 *     summary: Update login user's information (including password if provided)
 *     tags: [Auth]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               roleId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Validation or update error
 *       500:
 *         description: Internal server error
 */
authRoutes.put("/update-login-user", updateLogInUser);

/**
 * @swagger
 * /api/auth/profile-picture:
 *   put:
 *     summary: Update user's profile picture
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # assuming JWT auth middleware is used
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - base64String
 *               - mimeType
 *             properties:
 *               base64String:
 *                 type: string
 *                 description: Base64-encoded image string
 *               mimeType:
 *                 type: string
 *                 description: MIME type of the image (e.g., image/png)
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Invalid input or failure to update
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
authRoutes.put("/profile-picture", updateUserProfilePicture);


/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Entry Point
 *     tags: [Auth]
 *     description: This is just a test route
 *     responses:
 *       200:
 *         description: Settlor.
 */
authRoutes.get("/test", test);

export default authRoutes