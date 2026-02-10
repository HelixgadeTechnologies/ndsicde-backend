"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.fetchGeneralSettings = exports.saveGeneralSettings = exports.destroyCloudFile = exports.upload = exports.updateUserProfilePicture = exports.forgotPasswordController = exports.login = exports.getRoles = exports.registerRoleController = exports.updateLogInUser = exports.deleteUser = exports.fetchAllUsers = exports.fetchUserById = exports.register = void 0;
const authService_1 = require("../service/authService");
const responseHandler_1 = require("../utils/responseHandler");
const upload_1 = require("../utils/upload");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, isCreate } = req.body;
        const user = yield (0, authService_1.registerUser)(data, isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("User registered successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.register = register;
const fetchUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield (0, authService_1.getUserById)(userId);
        if (user.length === 0) {
            return res
                .status(404)
                .json((0, responseHandler_1.notFoundResponse)("User not found", undefined));
        }
        res.status(200).json((0, responseHandler_1.successResponse)("User found", user));
    }
    catch (err) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", err));
    }
});
exports.fetchUserById = fetchUserById;
const fetchAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, authService_1.getAllUser)();
        res.status(200).json((0, responseHandler_1.successResponse)("Users found", users));
    }
    catch (err) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", err));
    }
});
exports.fetchAllUsers = fetchAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json((0, responseHandler_1.notFoundResponse)("User ID is required", userId));
        }
        const userRes = yield (0, authService_1.getUserById)(req.body.userId);
        if (userRes.length == 0) {
            res.status(400).json((0, responseHandler_1.notFoundResponse)("User not found", {}));
        }
        const user = yield (0, authService_1.removeUser)(req.body.userId);
        res.status(201).json((0, responseHandler_1.successResponse)("User removed successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.deleteUser = deleteUser;
const updateLogInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield (0, authService_1.updateLoginUser)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)(`Update successfully`, admin));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.updateLogInUser = updateLogInUser;
const registerRoleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isCreate, data } = req.body;
    try {
        const role = yield (0, authService_1.registerRole)(data, isCreate);
        const message = isCreate
            ? "Role created successfully"
            : "Role updated successfully";
        res.status(201).json((0, responseHandler_1.successResponse)(message, role));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.registerRoleController = registerRoleController;
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield (0, authService_1.getAllRole)();
        res.status(201).json((0, responseHandler_1.successResponse)("Roles", roles));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.getRoles = getRoles;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, authService_1.loginUser)(req.body);
        console.log(token, "token");
        if (!token) {
            return res.status(400).json((0, responseHandler_1.errorResponse)("Invalid credentials"));
        }
        res.status(200).json((0, responseHandler_1.successResponse)("Login successfully", token));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.login = login;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, authService_1.forgotPassword)(email);
        res.status(200).json((0, responseHandler_1.successResponse)("Password reset to default", null));
    }
    catch (err) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", err));
    }
});
exports.forgotPasswordController = forgotPasswordController;
const updateUserProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { base64String, mimeType } = req.body;
        if (!userId) {
            res
                .status(401)
                .json((0, responseHandler_1.errorResponse)("Unauthorized: User not authenticated."));
        }
        if (!base64String || !mimeType) {
            res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Both base64String and mimeType are required."));
        }
        const result = yield (0, authService_1.updateProfilePicture)(userId, base64String, mimeType);
        res.status(200).json((0, responseHandler_1.successResponse)(result.message, result.data));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.updateUserProfilePicture = updateUserProfilePicture;
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { base64String, mimeType } = req.body;
        if (!base64String || !mimeType) {
            res
                .status(400)
                .json((0, responseHandler_1.errorResponse)("Both base64String and mimeType are required."));
        }
        let uploadUrl = yield (0, upload_1.uploadFile)(base64String, mimeType);
        res.status(200).json((0, responseHandler_1.successResponse)("uploadUrl", uploadUrl));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.upload = upload;
const destroyCloudFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(400).json((0, responseHandler_1.errorResponse)("File url required."));
        }
        yield (0, authService_1.deleteCloudFile)(url);
        res.status(200).json((0, responseHandler_1.successResponse)("destroyed", null));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)(error.message));
    }
});
exports.destroyCloudFile = destroyCloudFile;
const saveGeneralSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isCreate, data } = req.body;
    try {
        const result = yield (0, authService_1.registerGeneralSettings)(data, isCreate);
        const message = isCreate
            ? "General settings created successfully"
            : "General settings updated successfully";
        res.status(isCreate ? 201 : 200).json((0, responseHandler_1.successResponse)(message, result));
    }
    catch (err) {
        res.status(500).json((0, responseHandler_1.errorResponse)(err.message));
    }
});
exports.saveGeneralSettings = saveGeneralSettings;
const fetchGeneralSettings = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield (0, authService_1.getGeneralSettings)();
        res.status(200).json((0, responseHandler_1.successResponse)("General Settings", settings));
    }
    catch (err) {
        res.status(500).json((0, responseHandler_1.errorResponse)(err.message));
    }
});
exports.fetchGeneralSettings = fetchGeneralSettings;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NDSICDE API WORKING");
});
exports.test = test;
