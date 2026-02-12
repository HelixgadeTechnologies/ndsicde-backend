import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { PDFGenerationOptions, ChartImageData, TableData, ReportData } from '../interface/reportInterface';
import { generateCharts } from './chartGenerator';

/**
 * Generate a professional PDF report with charts and tables
 */
export async function generatePDFReport(options: PDFGenerationOptions): Promise<string> {
    const { reportData, outputPath, includeCharts = true, includeTables = true, pageSize = 'A4', orientation = 'portrait' } = options;

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create PDF document
    const doc = new PDFDocument({
        size: pageSize,
        layout: orientation,
        bufferPages: true,
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    // Pipe to file
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add header
    addHeader(doc, reportData.metadata.reportName, reportData.metadata.reportType);

    // Add metadata section
    addMetadataSection(doc, reportData.metadata);

    // Add summary section
    addSummarySection(doc, reportData.summary);

    // Add charts if enabled
    if (includeCharts && reportData.charts.length > 0) {
        await addChartsSection(doc, reportData.charts);
    }

    // Add tables if enabled
    if (includeTables && reportData.tables.length > 0) {
        addTablesSection(doc, reportData.tables);
    }

    // Add footer to all pages
    addFooter(doc, reportData.metadata.generatedAt);

    // Finalize PDF
    doc.end();

    // Wait for stream to finish
    await new Promise<void>((resolve, reject) => {
        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });

    return outputPath;
}


/**
 * Add header to PDF
 */
function addHeader(doc: PDFKit.PDFDocument, reportName: string, reportType: string) {
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

/**
 * Add metadata section
 */
function addMetadataSection(doc: PDFKit.PDFDocument, metadata: any) {
    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Report Information', { underline: true });

    doc.moveDown(0.5);

    const metadataItems: { label: string; value: string }[] = [
        { label: 'Generated At', value: new Date(metadata.generatedAt).toLocaleString() },
    ];

    if (metadata.projectName) {
        metadataItems.push({ label: 'Project', value: metadata.projectName });
    }

    if (metadata.dateRange?.startDate || metadata.dateRange?.endDate) {
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

/**
 * Add summary section with key metrics
 */
function addSummarySection(doc: PDFKit.PDFDocument, summary: any) {
    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Executive Summary', { underline: true });

    doc.moveDown(0.5);

    // Create a grid layout for metrics
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

        // Check if we need a new page
        if (y + boxHeight > doc.page.height - 100) {
            doc.addPage();
            return;
        }

        // Draw box
        doc
            .rect(x, y, boxWidth, boxHeight)
            .fillAndStroke('#ECF0F1', '#BDC3C7');

        // Add label
        doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#7F8C8D')
            .text(metric.label, x + 10, y + 10, { width: boxWidth - 20 });

        // Add value
        doc
            .fontSize(18)
            .font('Helvetica-Bold')
            .fillColor('#2C3E50')
            .text(metric.value.toString(), x + 10, y + 30, { width: boxWidth - 20 });
    });

    // Move down after metrics grid
    const totalRows = Math.ceil(metrics.length / columns);
    doc.y = startY + totalRows * (boxHeight + spacing) + 20;
}

/**
 * Add charts section
 */
async function addChartsSection(doc: PDFKit.PDFDocument, charts: any[]) {
    doc.addPage();

    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2C3E50')
        .text('Visual Analytics', { underline: true });

    doc.moveDown(1);

    // Generate chart images
    const chartImages = await generateCharts(charts);

    for (const chartImage of chartImages) {
        // Check if we need a new page
        if (doc.y + 350 > doc.page.height - 100) {
            doc.addPage();
        }

        // Add chart title
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#34495E')
            .text(chartImage.title, { align: 'center' });

        doc.moveDown(0.5);

        // Add chart image
        const imageWidth = 500;
        const imageHeight = 250;
        const x = (doc.page.width - imageWidth) / 2;

        doc.image(chartImage.imageBuffer, x, doc.y, {
            width: imageWidth,
            height: imageHeight
        });

        // Manually move the cursor down after the image
        doc.y += imageHeight + 20;

        doc.moveDown(1.5);
    }
}

/**
 * Add tables section
 */
function addTablesSection(doc: PDFKit.PDFDocument, tables: TableData[]) {
    tables.forEach((table, tableIndex) => {
        // Add new page for each table (except first if there's space)
        if (tableIndex > 0 || doc.y + 200 > doc.page.height - 100) {
            doc.addPage();
        }

        // Table title
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#2C3E50')
            .text(table.title, { underline: true });

        doc.moveDown(0.5);

        // Calculate column widths
        const tableWidth = doc.page.width - 100;
        const columnWidth = tableWidth / table.headers.length;

        // Draw header row
        const headerY = doc.y;
        table.headers.forEach((header, colIndex) => {
            const x = 50 + colIndex * columnWidth;

            // Header background
            doc
                .rect(x, headerY, columnWidth, 25)
                .fillAndStroke('#3498DB', '#2980B9');

            // Header text
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

        // Draw data rows
        table.rows.forEach((row, rowIndex) => {
            const rowY = doc.y;
            const rowHeight = 25; // Default height

            // Check if we need a new page
            if (rowY + rowHeight > doc.page.height - 100) {
                doc.addPage();
                doc.y = 50;
            }

            const currentY = doc.y;
            let maxCellHeight = rowHeight;

            row.forEach((cell, colIndex) => {
                const x = 50 + colIndex * columnWidth;

                // Cell background (alternating colors)
                const fillColor = rowIndex % 2 === 0 ? '#FFFFFF' : '#ECF0F1';
                doc
                    .rect(x, currentY, columnWidth, rowHeight)
                    .fillAndStroke(fillColor, '#BDC3C7');

                // Cell text
                doc
                    .fontSize(9)
                    .font('Helvetica')
                    .fillColor('#2C3E50')
                    .text(cell.toString(), x + 5, currentY + 7, {
                        width: columnWidth - 10,
                        align: 'left'
                    });
            });

            doc.y = currentY + rowHeight;
        });

        doc.moveDown(2);
    });
}

/**
 * Add footer to all pages
 */
function addFooter(doc: PDFKit.PDFDocument, generatedAt: Date) {
    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);

        // Footer line
        doc
            .strokeColor('#BDC3C7')
            .lineWidth(1)
            .moveTo(50, doc.page.height - 40)
            .lineTo(doc.page.width - 50, doc.page.height - 40)
            .stroke();

        // Page number and timestamp
        doc
            .fontSize(8)
            .font('Helvetica')
            .fillColor('#7F8C8D')
            .text(
                `Page ${i + 1} of ${pages.count}`,
                50,
                doc.page.height - 30,
                { align: 'left' }
            )
            .text(
                `Generated: ${new Date(generatedAt).toLocaleString()}`,
                50,
                doc.page.height - 30,
                { align: 'right' }
            );
    }
}

/**
 * Calculate file size
 */
export function getFileSize(filePath: string): number {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}
