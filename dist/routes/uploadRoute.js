"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const uploadRoutes = (0, express_1.Router)();
uploadRoutes.post("/file-upload", authController_1.upload);
uploadRoutes.post("/file-destroy", authController_1.destroyCloudFile);
exports.default = uploadRoutes;
