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