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
exports.generateReportController = generateReportController;
exports.getAllReportsController = getAllReportsController;
exports.getReportByIdController = getReportByIdController;
exports.downloadReportController = downloadReportController;
exports.deleteReportController = deleteReportController;
const reportService_1 = require("../service/reportService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function generateReportController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { reportType, reportName, projectId, startDate, endDate, selectedMetrics, generatedBy } = req.body;
            if (!reportType) {
                return res.status(400).json({
                    success: false,
                    message: 'Report type is required'
                });
            }
            const validReportTypes = ['Activity Summary', 'Financial Overview', 'Request Analysis', 'Retirement Analysis'];
            if (!validReportTypes.includes(reportType)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}`
                });
            }
            const result = yield (0, reportService_1.generateReport)({
                reportType,
                reportName,
                projectId,
                startDate,
                endDate,
                selectedMetrics,
                generatedBy
            });
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Error in generateReportController:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to generate report'
            });
        }
    });
}
function getAllReportsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { projectId, reportType } = req.query;
            const result = yield (0, reportService_1.getAllReports)({
                projectId: projectId,
                reportType: reportType
            });
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in getAllReportsController:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve reports'
            });
        }
    });
}
function getReportByIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { reportId } = req.params;
            if (!reportId) {
                return res.status(400).json({
                    success: false,
                    message: 'Report ID is required'
                });
            }
            const result = yield (0, reportService_1.getReportById)(reportId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in getReportByIdController:', error);
            if (error.message === 'Report not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve report'
            });
        }
    });
}
function downloadReportController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { reportId } = req.params;
            if (!reportId) {
                return res.status(400).json({
                    success: false,
                    message: 'Report ID is required'
                });
            }
            const result = yield (0, reportService_1.getReportById)(reportId);
            const report = result.data;
            if (!report.fileUrl || !fs_1.default.existsSync(report.fileUrl)) {
                return res.status(404).json({
                    success: false,
                    message: 'Report file not found'
                });
            }
            const fileName = path_1.default.basename(report.fileUrl);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${report.reportName}.pdf"`);
            const fileStream = fs_1.default.createReadStream(report.fileUrl);
            fileStream.pipe(res);
        }
        catch (error) {
            console.error('Error in downloadReportController:', error);
            if (error.message === 'Report not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to download report'
            });
        }
    });
}
function deleteReportController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { reportId } = req.params;
            if (!reportId) {
                return res.status(400).json({
                    success: false,
                    message: 'Report ID is required'
                });
            }
            const result = yield (0, reportService_1.deleteReport)(reportId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in deleteReportController:', error);
            if (error.message === 'Report not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete report'
            });
        }
    });
}
