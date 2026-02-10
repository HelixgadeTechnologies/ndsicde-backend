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
exports.generatePDFReport = generatePDFReport;
exports.getFileSize = getFileSize;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chartGenerator_1 = require("./chartGenerator");
function generatePDFReport(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { reportData, outputPath, includeCharts = true, includeTables = true, pageSize = 'A4', orientation = 'portrait' } = options;
        const outputDir = path_1.default.dirname(outputPath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        const doc = new pdfkit_1.default({
            size: pageSize,
            layout: orientation,
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });
        const stream = fs_1.default.createWriteStream(outputPath);
        doc.pipe(stream);
        addHeader(doc, reportData.metadata.reportName, reportData.metadata.reportType);
        addMetadataSection(doc, reportData.metadata);
        addSummarySection(doc, reportData.summary);
        if (includeCharts && reportData.charts.length > 0) {
            yield addChartsSection(doc, reportData.charts);
        }
        if (includeTables && reportData.tables.length > 0) {
            addTablesSection(doc, reportData.tables);
        }
        addFooter(doc, reportData.metadata.generatedAt);
        doc.end();
        yield new Promise((resolve, reject) => {
            stream.on('finish', () => resolve());
            stream.on('error', reject);
        });
        return outputPath;
    });
}
function addHeader(doc, reportName, reportType) {
    doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text(reportName, { align: 'center' });
    doc
        .moveDown(0.5)
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#7F8C8D')
        .text(reportType, { align: 'center' });
    doc
        .moveDown(1)
        .strokeColor('#3498DB')
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();
    doc.moveDown(1.5);
}
function addMetadataSection(doc, metadata) {
    var _a, _b;
    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Report Information', { underline: true });
    doc.moveDown(0.5);
    const metadataItems = [
        { label: 'Generated At', value: new Date(metadata.generatedAt).toLocaleString() },
    ];
    if (metadata.projectName) {
        metadataItems.push({ label: 'Project', value: metadata.projectName });
    }
    if (((_a = metadata.dateRange) === null || _a === void 0 ? void 0 : _a.startDate) || ((_b = metadata.dateRange) === null || _b === void 0 ? void 0 : _b.endDate)) {
        const startDate = metadata.dateRange.startDate ? new Date(metadata.dateRange.startDate).toLocaleDateString() : 'N/A';
        const endDate = metadata.dateRange.endDate ? new Date(metadata.dateRange.endDate).toLocaleDateString() : 'N/A';
        metadataItems.push({ label: 'Date Range', value: `${startDate} - ${endDate}` });
    }
    metadataItems.forEach(item => {
        doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#34495E')
            .text(`${item.label}: `, { continued: true })
            .font('Helvetica')
            .fillColor('#7F8C8D')
            .text(item.value);
    });
    doc.moveDown(1.5);
}
function addSummarySection(doc, summary) {
    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Executive Summary', { underline: true });
    doc.moveDown(0.5);
    const metrics = [
        { label: 'Total Activities', value: summary.totalActivities || 0 },
        { label: 'Completed Activities', value: summary.completedActivities || 0 },
        { label: 'Total Requests', value: summary.totalRequests || 0 },
        { label: 'Approved Requests', value: summary.approvedRequests || 0 },
        { label: 'Total Retirements', value: summary.totalRetirements || 0 },
        { label: 'Completed Retirements', value: summary.completedRetirements || 0 },
        { label: 'Total Budget', value: `$${(summary.totalBudget || 0).toLocaleString()}` },
        { label: 'Actual Cost', value: `$${(summary.actualCost || 0).toLocaleString()}` },
        { label: 'Budget Utilization', value: `${(summary.budgetUtilization || 0).toFixed(2)}%` },
        { label: 'Completion Rate', value: `${(summary.completionRate || 0).toFixed(2)}%` },
    ];
    const startX = 50;
    const startY = doc.y;
    const boxWidth = 250;
    const boxHeight = 60;
    const spacing = 20;
    const columns = 2;
    metrics.forEach((metric, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const x = startX + col * (boxWidth + spacing);
        const y = startY + row * (boxHeight + spacing);
        if (y + boxHeight > doc.page.height - 100) {
            doc.addPage();
            return;
        }
        doc
            .rect(x, y, boxWidth, boxHeight)
            .fillAndStroke('#ECF0F1', '#BDC3C7');
        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#7F8C8D')
            .text(metric.label, x + 10, y + 10, { width: boxWidth - 20 });
        doc
            .fontSize(18)
            .font('Helvetica-Bold')
            .fillColor('#2C3E50')
            .text(metric.value.toString(), x + 10, y + 30, { width: boxWidth - 20 });
    });
    const totalRows = Math.ceil(metrics.length / columns);
    doc.y = startY + totalRows * (boxHeight + spacing) + 20;
}
function addChartsSection(doc, charts) {
    return __awaiter(this, void 0, void 0, function* () {
        doc.addPage();
        doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .fillColor('#2C3E50')
            .text('Visual Analytics', { underline: true });
        doc.moveDown(1);
        const chartImages = yield (0, chartGenerator_1.generateCharts)(charts);
        for (const chartImage of chartImages) {
            if (doc.y + 300 > doc.page.height - 100) {
                doc.addPage();
            }
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .fillColor('#34495E')
                .text(chartImage.title, { align: 'center' });
            doc.moveDown(0.5);
            const imageWidth = 500;
            const imageHeight = 250;
            const x = (doc.page.width - imageWidth) / 2;
            doc.image(chartImage.imageBuffer, x, doc.y, {
                width: imageWidth,
                height: imageHeight
            });
            doc.moveDown(3);
        }
    });
}
function addTablesSection(doc, tables) {
    tables.forEach((table, tableIndex) => {
        if (tableIndex > 0 || doc.y + 200 > doc.page.height - 100) {
            doc.addPage();
        }
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#2C3E50')
            .text(table.title, { underline: true });
        doc.moveDown(0.5);
        const tableWidth = doc.page.width - 100;
        const columnWidth = tableWidth / table.headers.length;
        const headerY = doc.y;
        table.headers.forEach((header, colIndex) => {
            const x = 50 + colIndex * columnWidth;
            doc
                .rect(x, headerY, columnWidth, 25)
                .fillAndStroke('#3498DB', '#2980B9');
            doc
                .fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#FFFFFF')
                .text(header, x + 5, headerY + 7, {
                width: columnWidth - 10,
                align: 'left'
            });
        });
        doc.y = headerY + 25;
        table.rows.forEach((row, rowIndex) => {
            const rowY = doc.y;
            if (rowY + 25 > doc.page.height - 100) {
                doc.addPage();
                doc.y = 50;
            }
            row.forEach((cell, colIndex) => {
                const x = 50 + colIndex * columnWidth;
                const fillColor = rowIndex % 2 === 0 ? '#FFFFFF' : '#ECF0F1';
                doc
                    .rect(x, doc.y, columnWidth, 25)
                    .fillAndStroke(fillColor, '#BDC3C7');
                doc
                    .fontSize(9)
                    .font('Helvetica')
                    .fillColor('#2C3E50')
                    .text(cell.toString(), x + 5, doc.y + 7, {
                    width: columnWidth - 10,
                    align: 'left'
                });
            });
            doc.y += 25;
        });
        doc.moveDown(2);
    });
}
function addFooter(doc, generatedAt) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc
            .strokeColor('#BDC3C7')
            .lineWidth(1)
            .moveTo(50, doc.page.height - 40)
            .lineTo(doc.page.width - 50, doc.page.height - 40)
            .stroke();
        doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor('#7F8C8D')
            .text(`Page ${i + 1} of ${pages.count}`, 50, doc.page.height - 30, { align: 'left' })
            .text(`Generated: ${new Date(generatedAt).toLocaleString()}`, 50, doc.page.height - 30, { align: 'right' });
    }
}
function getFileSize(filePath) {
    try {
        const stats = fs_1.default.statSync(filePath);
        return stats.size;
    }
    catch (error) {
        return 0;
    }
}
