import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  removeUser,
  getUserById,
  getAllRole,
  changePassword,
  updateProfilePicture,
  deleteCloudFile,
  updateLoginUser,
  getAllUser,
  forgotPassword,
  getGeneralSettings,
  registerGeneralSettings,
  registerRole,
  saveUserSignature,
} from "../service/authService";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandler";
import { uploadFile } from "../utils/upload";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const register = asyncHandler(async (req, res) => {
  const { data, isCreate } = req.body;
  const user = await registerUser(data, isCreate);
  res.status(201).json(successResponse("User registered successfully", user));
});

export const fetchUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await getUserById(userId);
  if (user.length === 0) {
    return res.status(404).json(notFoundResponse("User not found", undefined));
  }
  res.status(200).json(successResponse("User found", user));
});

export const fetchAllUsers = asyncHandler(async (_req, res) => {
  const users = await getAllUser();
  res.status(200).json(successResponse("Users found", users));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json(notFoundResponse("User ID is required", userId));
  }
  const userRes = await getUserById(req.body.userId);
  if (userRes.length == 0) {
    return res.status(400).json(notFoundResponse("User not found", {}));
  }
  const user = await removeUser(req.body.userId);
  res.status(201).json(successResponse("User removed successfully", user));
});

export const updateLogInUser = asyncHandler(async (req, res) => {
  const admin = await updateLoginUser(req.body);
  res.status(201).json(successResponse("Update successfully", admin));
});

export const registerRoleController = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const role = await registerRole(data, isCreate);
  const message = isCreate ? "Role created successfully" : "Role updated successfully";
  res.status(201).json(successResponse(message, role));
});

export const getRoles = asyncHandler(async (_req, res) => {
  const roles = await getAllRole();
  res.status(201).json(successResponse("Roles", roles));
});

export const login = asyncHandler(async (req, res) => {
  const token = await loginUser(req.body);
  if (!token) {
    return res.status(400).json(errorResponse("Invalid credentials"));
  }
  res.status(200).json(successResponse("Login successfully", token));
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPassword(email);
  res.status(200).json(successResponse("Password reset to default", null));
});

export const updateUserProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { base64String, mimeType } = req.body;
  if (!userId) {
    return res.status(401).json(errorResponse("Unauthorized: User not authenticated."));
  }
  if (!base64String || !mimeType) {
    return res.status(400).json(errorResponse("Both base64String and mimeType are required."));
  }
  const result = await updateProfilePicture(userId, base64String, mimeType);
  res.status(200).json(successResponse(result.message, result.data));
});

export const upload = asyncHandler(async (req, res) => {
  const { base64String, mimeType } = req.body;
  if (!base64String || !mimeType) {
    return res.status(400).json(errorResponse("Both base64String and mimeType are required."));
  }
  const uploadUrl = await uploadFile(base64String, mimeType);
  res.status(200).json(successResponse("uploadUrl", uploadUrl));
});

export const destroyCloudFile = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json(errorResponse("File url required."));
  }
  await deleteCloudFile(url);
  res.status(200).json(successResponse("destroyed", null));
});

export const saveGeneralSettings = asyncHandler(async (req, res) => {
  const { isCreate, data } = req.body;
  const result = await registerGeneralSettings(data, isCreate);
  const message = isCreate
    ? "General settings created successfully"
    : "General settings updated successfully";
  res.status(isCreate ? 201 : 200).json(successResponse(message, result));
});

export const fetchGeneralSettings = asyncHandler(async (_req, res) => {
  const settings = await getGeneralSettings();
  res.status(200).json(successResponse("General Settings", settings));
});

export const test = async (req: Request, res: Response) => {
  res.send("NDSICDE API WORKING");
};

export const changePasswordController = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.userId as string;
  const result = await changePassword(userId, oldPassword, newPassword, confirmPassword);
  res.status(200).json(successResponse("Password changed successfully", result));
});

export const saveUserSignatureController = asyncHandler(async (req, res) => {
  const { userId, signature, signatureMimeType } = req.body;
  if (!userId || !signature || !signatureMimeType) {
    return res.status(400).json(errorResponse("userId, signature, and signatureMimeType are required"));
  }
  const user = await saveUserSignature(userId, signature, signatureMimeType);
  res.status(200).json(successResponse("Signature saved successfully", user));
});
