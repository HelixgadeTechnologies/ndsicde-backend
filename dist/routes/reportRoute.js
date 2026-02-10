"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controller/reportController");
const reportRouter = express_1.default.Router();
reportRouter.post('/generate', reportController_1.generateReportController);
reportRouter.get('/all', reportController_1.getAllReportsController);
reportRouter.get('/getReportById/:reportId', reportController_1.getReportByIdController);
reportRouter.get('/downloadReportById/:reportId', reportController_1.downloadReportController);
reportRouter.delete('/deleteReportById/:reportId', reportController_1.deleteReportController);
exports.default = reportRouter;
