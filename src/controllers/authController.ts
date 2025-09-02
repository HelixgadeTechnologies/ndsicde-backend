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
} from "../service/authService";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responseHandler";
import { uploadFile } from "../utils/upload";

export const register = async (req: Request, res: Response) => {
  try {
    const { data, isCreate } = req.body;
    const user = await registerUser(data, isCreate);
    res.status(201).json(successResponse("User registered successfully", user));
  } catch (error: any) {
    res.status(500).json(errorResponse("Internal server error", error));
  }
};
export const fetchUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    if (user.length === 0) {
      return res
        .status(404)
        .json(notFoundResponse("User not found", undefined));
    }
    res.status(200).json(successResponse("User found", user));
  } catch (err: any) {
    res.status(500).json(errorResponse("Internal server error", err));
  }
};

export const fetchAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUser();
    res.status(200).json(successResponse("Users found", users));
  } catch (err: any) {
    res.status(500).json(errorResponse("Internal server error", err));
  }
};

// export const getUser = async (req: Request, res: Response) => {
//     try {

//         const { userId } = req.params;
//         if (!userId) {
//             res.status(400).json(notFoundResponse("User ID is required", userId));
//         }

//         const user = await getUserById(userId);

//         if (user.length == 0) {
//             res.status(400).json(notFoundResponse("User not found", {}));
//         }

//         res.status(201).json(successResponse("User registered successfully", user[0]));
//     } catch (error: any) {
//         res.status(500).json(errorResponse("Internal server error", error));
//     }

// };
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json(notFoundResponse("User ID is required", userId));
    }

    const userRes = await getUserById(req.body.userId);
    if (userRes.length == 0) {
      res.status(400).json(notFoundResponse("User not found", {}));
    }

    const user = await removeUser(req.body.userId);
    res.status(201).json(successResponse("User removed successfully", user));
  } catch (error: any) {
    res.status(500).json(errorResponse("Internal server error", error));
  }
};

export const updateLogInUser = async (req: Request, res: Response) => {
  try {
    const admin = await updateLoginUser(req.body);
    res.status(201).json(successResponse(`Update successfully`, admin));
  } catch (error: any) {
    res.status(400).json(errorResponse("Internal server error", error));
  }
};

export const registerRoleController = async (req: Request, res: Response) => {
  const { isCreate, data } = req.body;

  try {
    const role = await registerRole(data, isCreate);
    const message = isCreate
      ? "Role created successfully"
      : "Role updated successfully";
    res.status(201).json(successResponse(message, role));
  } catch (error: any) {
    res.status(400).json(errorResponse("Internal server error", error));
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRole();
    res.status(201).json(successResponse("Roles", roles));
  } catch (error: any) {
    res.status(500).json(errorResponse("Internal server error", error));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await loginUser(req.body);
    console.log(token, "token");
    if (!token) {
      return res.status(400).json(errorResponse("Invalid credentials"));
    }
    res.status(200).json(successResponse("Login successfully", token));
  } catch (error: any) {
    res.status(400).json(errorResponse("Internal server error", error));
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await forgotPassword(email);
    res.status(200).json(successResponse("Password reset to default", null));
  } catch (err: any) {
    res.status(400).json(errorResponse("Internal server error", err));
  }
};

export const updateUserProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Assuming user ID is available from authentication middleware
    const { base64String, mimeType } = req.body;

    if (!userId) {
      res
        .status(401)
        .json(errorResponse("Unauthorized: User not authenticated."));
    }

    if (!base64String || !mimeType) {
      res
        .status(400)
        .json(errorResponse("Both base64String and mimeType are required."));
    }

    const result = await updateProfilePicture(userId, base64String, mimeType);
    res.status(200).json(successResponse(result.message, result.data));
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const upload = async (req: Request, res: Response) => {
  try {
    const { base64String, mimeType } = req.body;

    if (!base64String || !mimeType) {
      res
        .status(400)
        .json(errorResponse("Both base64String and mimeType are required."));
    }
    let uploadUrl = await uploadFile(base64String, mimeType);

    res.status(200).json(successResponse("uploadUrl", uploadUrl));
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
export const destroyCloudFile = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json(errorResponse("File url required."));
    }
    // Assuming the URL is the public ID of the file in Cloudinary
    await deleteCloudFile(url);
    // If the deletion is successful, return a success response

    res.status(200).json(successResponse("destroyed", null));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const saveGeneralSettings = async (req: Request, res: Response) => {
  const { isCreate, data } = req.body;

  try {
    const result = await registerGeneralSettings(data, isCreate);
    const message = isCreate
      ? "General settings created successfully"
      : "General settings updated successfully";
    res.status(isCreate ? 201 : 200).json(successResponse(message, result));
  } catch (err: any) {
    res.status(500).json(errorResponse(err.message));
  }
};

export const fetchGeneralSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getGeneralSettings();
    res.status(200).json(successResponse("General Settings", settings));
  } catch (err: any) {
    res.status(500).json(errorResponse(err.message));
  }
};

export const test = async (req: Request, res: Response) => {
  res.send("NDSICDE API WORKING");
};
