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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.deleteCloudFile = exports.updateProfilePicture = exports.changePassword = exports.loginUser = exports.getAllRole = exports.registerRole = exports.getGeneralSettings = exports.registerGeneralSettings = exports.updateLoginUser = exports.removeUser = exports.getAllUser = exports.getUserById = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const upload_1 = require("../utils/upload");
const prisma = new client_1.PrismaClient();
const registerUser = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (isCreate) {
        const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new Error("User with this email already exists");
        const hashedPassword = yield bcryptjs_1.default.hash("12345", 10);
        return prisma.user.create({
            data: {
                fullName: (_a = data.fullName) !== null && _a !== void 0 ? _a : null,
                email: (_b = data.email) !== null && _b !== void 0 ? _b : null,
                roleId: (_c = data.roleId) !== null && _c !== void 0 ? _c : null,
                department: (_d = data.department) !== null && _d !== void 0 ? _d : null,
                phoneNumber: (_e = data.phoneNumber) !== null && _e !== void 0 ? _e : null,
                status: (_g = (_f = data.status) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : null,
                assignedProjectId: (_h = data.assignedProjectId) !== null && _h !== void 0 ? _h : null,
                password: hashedPassword
            }
        });
    }
    else {
        return prisma.user.update({
            where: { userId: data.userId },
            data: {
                fullName: (_j = data.fullName) !== null && _j !== void 0 ? _j : null,
                email: (_k = data.email) !== null && _k !== void 0 ? _k : null,
                roleId: (_l = data.roleId) !== null && _l !== void 0 ? _l : null,
                department: (_m = data.department) !== null && _m !== void 0 ? _m : null,
                phoneNumber: (_o = data.phoneNumber) !== null && _o !== void 0 ? _o : null,
                status: (_q = (_p = data.status) === null || _p === void 0 ? void 0 : _p.toUpperCase()) !== null && _q !== void 0 ? _q : null,
                assignedProjectId: (_r = data.assignedProjectId) !== null && _r !== void 0 ? _r : null,
                updateAt: new Date(),
            },
        });
    }
});
exports.registerUser = registerUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.$queryRaw `
    SELECT * FROM user_view WHERE userId = ${userId}
  `;
    return users;
});
exports.getUserById = getUserById;
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.$queryRaw `
    SELECT * FROM user_view
  `;
    return users;
});
exports.getAllUser = getAllUser;
const removeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield prisma.user.delete({ where: { userId } });
    return user;
});
exports.removeUser = removeUser;
const updateLoginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (data.password) {
        data.password = yield bcryptjs_1.default.hash(data.password, 10);
        yield prisma.user.update({
            where: { userId: data.userId },
            data: {
                fullName: (_a = data.fullName) !== null && _a !== void 0 ? _a : null,
                email: (_b = data.email) !== null && _b !== void 0 ? _b : null,
                phoneNumber: (_c = data.phoneNumber) !== null && _c !== void 0 ? _c : null,
                roleId: (_d = data.roleId) !== null && _d !== void 0 ? _d : null,
                password: (_e = data.password) !== null && _e !== void 0 ? _e : null,
                updateAt: new Date(),
            },
        });
    }
    else {
        yield prisma.user.update({
            where: { userId: data.userId },
            data: {
                fullName: (_f = data.fullName) !== null && _f !== void 0 ? _f : null,
                email: (_g = data.email) !== null && _g !== void 0 ? _g : null,
                phoneNumber: (_h = data.phoneNumber) !== null && _h !== void 0 ? _h : null,
                roleId: (_j = data.roleId) !== null && _j !== void 0 ? _j : null,
                updateAt: new Date(),
            },
        });
    }
});
exports.updateLoginUser = updateLoginUser;
const registerGeneralSettings = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    try {
        if (isCreate) {
            return prisma.generalSettings.create({
                data: {
                    organizationName: (_a = data.organizationName) !== null && _a !== void 0 ? _a : null,
                    contactEmail: (_b = data.contactEmail) !== null && _b !== void 0 ? _b : null,
                    contactPhone: (_c = data.contactPhone) !== null && _c !== void 0 ? _c : null,
                    website: (_d = data.website) !== null && _d !== void 0 ? _d : null,
                    organizationLogo: (_e = data.organizationLogo) !== null && _e !== void 0 ? _e : null,
                    defaultCurrency: (_f = data.defaultCurrency) !== null && _f !== void 0 ? _f : null,
                    defaultTimeZone: (_g = data.defaultTimeZone) !== null && _g !== void 0 ? _g : null,
                    dateRetentionPolicy: (_h = data.dateRetentionPolicy) !== null && _h !== void 0 ? _h : null,
                    auditLogRetention: (_j = data.auditLogRetention) !== null && _j !== void 0 ? _j : null,
                    emailNotification: (_k = data.emailNotification) !== null && _k !== void 0 ? _k : null,
                    maintenanceAlert: (_l = data.maintenanceAlert) !== null && _l !== void 0 ? _l : null,
                }
            });
        }
        else {
            return prisma.generalSettings.update({
                where: { generalSettingsId: data.generalSettingsId },
                data: {
                    organizationName: (_m = data.organizationName) !== null && _m !== void 0 ? _m : null,
                    contactEmail: (_o = data.contactEmail) !== null && _o !== void 0 ? _o : null,
                    contactPhone: (_p = data.contactPhone) !== null && _p !== void 0 ? _p : null,
                    website: (_q = data.website) !== null && _q !== void 0 ? _q : null,
                    organizationLogo: (_r = data.organizationLogo) !== null && _r !== void 0 ? _r : null,
                    defaultCurrency: (_s = data.defaultCurrency) !== null && _s !== void 0 ? _s : null,
                    defaultTimeZone: (_t = data.defaultTimeZone) !== null && _t !== void 0 ? _t : null,
                    dateRetentionPolicy: (_u = data.dateRetentionPolicy) !== null && _u !== void 0 ? _u : null,
                    auditLogRetention: (_v = data.auditLogRetention) !== null && _v !== void 0 ? _v : null,
                    emailNotification: (_w = data.emailNotification) !== null && _w !== void 0 ? _w : null,
                    maintenanceAlert: (_x = data.maintenanceAlert) !== null && _x !== void 0 ? _x : null,
                }
            });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.registerGeneralSettings = registerGeneralSettings;
const getGeneralSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const generalSettings = yield prisma.$queryRaw `
    SELECT * FROM generalsettings
  `;
    return generalSettings[0];
});
exports.getGeneralSettings = getGeneralSettings;
const registerRole = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const roleData = {
        roleName: (_a = data.roleName) !== null && _a !== void 0 ? _a : null,
        description: (_b = data.description) !== null && _b !== void 0 ? _b : null,
        permission: (_c = data.permission) !== null && _c !== void 0 ? _c : null
    };
    if (isCreate) {
        return prisma.role.create({ data: roleData });
    }
    return prisma.role.update({
        where: { roleId: data.roleId },
        data: roleData,
    });
});
exports.registerRole = registerRole;
const getAllRole = () => __awaiter(void 0, void 0, void 0, function* () {
    const rawRoles = yield prisma.$queryRaw `
  SELECT * FROM role_view
`;
    const roles = rawRoles.map(r => (Object.assign(Object.assign({}, r), { users: Number(r.users) })));
    return roles;
});
exports.getAllRole = getAllRole;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.$queryRaw `
    SELECT * FROM user_view WHERE email = ${data.email}
  `;
        if (user.length < 1)
            throw new Error("Invalid credentials");
        const isPasswordValid = yield bcryptjs_1.default.compare(data.password, user[0].password);
        if (!isPasswordValid)
            throw new Error("Invalid credentials");
        if (user[0].status === "INACTIVE") {
            yield prisma.user.update({
                where: { userId: user[0].userId },
                data: {
                    loginLast: new Date(),
                    status: "ACTIVE",
                    updateAt: new Date()
                },
            });
        }
        return jsonwebtoken_1.default.sign(user[0], secrets_1.JWT_SECRET, { expiresIn: "2h" });
    }
    catch (error) {
        console.log(error, "Login Error");
    }
});
exports.loginUser = loginUser;
const changePassword = (userId, oldPassword, newPassword, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { userId } });
    if (!user) {
        throw new Error("User not found.");
    }
    const passwordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!passwordMatch) {
        throw new Error("Old password is incorrect.");
    }
    if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    yield prisma.user.update({
        where: { userId },
        data: { password: hashedPassword },
    });
    return { message: "Password changed successfully." };
});
exports.changePassword = changePassword;
const updateProfilePicture = (userId, base64String, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    if (!base64String || !mimeType) {
        throw new Error("Profile picture and MIME type are required.");
    }
    const user = yield prisma.user.findUnique({ where: { userId } });
    if (user === null || user === void 0 ? void 0 : user.profilePic) {
        const filePath = (0, upload_1.getFileName)(user.profilePic);
        yield (0, upload_1.deleteFile)(filePath);
    }
    let uploadUrl = yield (0, upload_1.uploadFile)(base64String, mimeType);
    const updatedUser = yield prisma.user.update({
        where: { userId },
        data: {
            profilePic: uploadUrl,
            profilePicMimeType: mimeType,
        },
        select: { userId: true, profilePicMimeType: true, profilePic: true },
    });
    return { message: "Profile picture updated successfully.", data: updatedUser };
});
exports.updateProfilePicture = updateProfilePicture;
const deleteCloudFile = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (url) {
            const filePath = (0, upload_1.getFileName)(url);
            yield (0, upload_1.deleteFile)(filePath);
        }
    }
    catch (error) {
        throw new Error("Error deleting file");
    }
});
exports.deleteCloudFile = deleteCloudFile;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User with this email does not exist");
    }
    const defaultPassword = yield bcryptjs_1.default.hash("12345", 10);
    yield prisma.user.update({
        where: { email },
        data: {
            password: defaultPassword,
            updateAt: new Date(),
        },
    });
});
exports.forgotPassword = forgotPassword;
