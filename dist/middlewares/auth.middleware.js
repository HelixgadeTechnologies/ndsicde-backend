"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const responseHandler_1 = require("../utils/responseHandler");
const authenticateToken = (req, res, next) => {
    if (req.method !== "POST") {
        return next();
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json((0, responseHandler_1.errorResponse)("Access denied", "Access denied, token missing!"));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET);
        if (typeof decoded === "object" && "exp" in decoded) {
            if (decoded.exp * 1000 < Date.now()) {
                res.status(403).json((0, responseHandler_1.errorResponse)("Token expired", "Token expired! Please log in again."));
                return;
            }
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json((0, responseHandler_1.errorResponse)("Invalid token!", err));
        return;
    }
};
exports.default = authenticateToken;
