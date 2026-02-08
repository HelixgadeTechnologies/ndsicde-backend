import { Request, Response } from 'express';
import {
    generateReport,
    getAllReports,
    getReportById,
    deleteReport
} from '../service/reportService';
import fs from 'fs';
import path from 'path';

/**
 * Generate a new report
 */
export async function generateReportController(req: Request, res: Response) {
    try {
        const { reportType, reportName, projectId, startDate, endDate, selectedMetrics, generatedBy } = req.body;

        // Validate required fields
        if (!reportType) {
            return res.status(400).json({
                success: false,
                message: 'Report type is required'
            });
        }

        // Validate report type
        const validReportTypes = ['Activity Summary', 'Financial Overview', 'Request Analysis', 'Retirement Analysis'];
        if (!validReportTypes.includes(reportType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}`
            });
        }

        const result = await generateReport({
            reportType,
            reportName,
            projectId,
            startDate,
            endDate,
            selectedMetrics,
            generatedBy
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error in generateReportController:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate report'
        });
    }
}

/**
 * Get all reports with optional filtering
 */
export async function getAllReportsController(req: Request, res: Response) {
    try {
        const { projectId, reportType } = req.query;

        const result = await getAllReports({
            projectId: projectId as string,
            reportType: reportType as string
        });

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error in getAllReportsController:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve reports'
        });
    }
}

/**
 * Get report by ID
 */
export async function getReportByIdController(req: Request, res: Response) {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: 'Report ID is required'
            });
        }

        const result = await getReportById(reportId);

        res.status(200).json(result);
    } catch (error: any) {
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
}

/**
 * Download report PDF
 */
export async function downloadReportController(req: Request, res: Response) {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: 'Report ID is required'
            });
        }

        const result = await getReportById(reportId);
        const report = result.data;

        if (!report.fileUrl || !fs.existsSync(report.fileUrl)) {
            return res.status(404).json({
                success: false,
                message: 'Report file not found'
            });
        }

        // Set headers for file download
        const fileName = path.basename(report.fileUrl);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${report.reportName}.pdf"`);

        // Stream the file
        const fileStream = fs.createReadStream(report.fileUrl);
        fileStream.pipe(res);
    } catch (error: any) {
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
}

/**
 * Delete report
 */
export async function deleteReportController(req: Request, res: Response) {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: 'Report ID is required'
            });
        }

        const result = await deleteReport(reportId);

        res.status(200).json(result);
    } catch (error: any) {
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
}
