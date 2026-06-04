import { generateReport, getAllReports, getReportById, deleteReport } from "../service/reportService";
import fs from "fs";
import path from "path";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const generateReportController = asyncHandler(async (req, res) => {
  const { reportType, reportName, projectId, startDate, endDate, selectedMetrics, generatedBy } = req.body;
  if (!reportType) {
    return res.status(400).json({ success: false, message: "Report type is required" });
  }
  const validReportTypes = ["Activity Summary", "Financial Overview", "Request Analysis", "Retirement Analysis"];
  if (!validReportTypes.includes(reportType)) {
    return res.status(400).json({ success: false, message: `Invalid report type. Must be one of: ${validReportTypes.join(", ")}` });
  }
  const result = await generateReport({ reportType, reportName, projectId, startDate, endDate, selectedMetrics, generatedBy });
  res.status(201).json(result);
});

export const getAllReportsController = asyncHandler(async (req, res) => {
  const { projectId, reportType } = req.query;
  const result = await getAllReports({ projectId: projectId as string, reportType: reportType as string });
  res.status(200).json(result);
});

export const getReportByIdController = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) {
    return res.status(400).json({ success: false, message: "Report ID is required" });
  }
  const result = await getReportById(reportId);
  res.status(200).json(result);
});

export const downloadReportController = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) {
    return res.status(400).json({ success: false, message: "Report ID is required" });
  }
  const result = await getReportById(reportId);
  const report = result.data;
  if (!report.fileUrl || !fs.existsSync(report.fileUrl)) {
    return res.status(404).json({ success: false, message: "Report file not found" });
  }
  const fileName = path.basename(report.fileUrl);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${report.reportName}.pdf"`);
  fs.createReadStream(report.fileUrl).pipe(res);
});

export const deleteReportController = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) {
    return res.status(400).json({ success: false, message: "Report ID is required" });
  }
  const result = await deleteReport(reportId);
  res.status(200).json(result);
});
