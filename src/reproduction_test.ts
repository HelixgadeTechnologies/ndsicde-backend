import { generatePDFReport } from './utils/pdfGenerator';
import { ReportData } from './interface/reportInterface';
import path from 'path';
import fs from 'fs';

async function testGeneration() {
    console.log('Starting PDF generation test with layout improvements...');

    const dummyReportData: ReportData = {
        summary: {
            totalActivities: 50,
            completedActivities: 20,
            totalRequests: 30,
            approvedRequests: 25,
            rejectedRequests: 2,
            pendingRequests: 3,
            totalRetirements: 10,
            completedRetirements: 8,
            totalBudget: 1000000,
            actualCost: 500000,
            budgetUtilization: 50,
            completionRate: 40,
            approvalRate: 83.33
        },
        charts: [
            {
                type: 'pie',
                title: 'Activity Status Distribution Test',
                data: {
                    labels: ['Completed', 'In Progress', 'Delayed', 'Not Started'],
                    values: [20, 15, 5, 10],
                    colors: ['#27AE60', '#3498DB', '#E74C3C', '#95A5A6']
                }
            },
            {
                type: 'bar',
                title: 'Budget vs Actual Cost Test',
                data: {
                    labels: ['Total Budget', 'Actual Cost'],
                    values: [1000000, 500000],
                    colors: ['#3498DB', '#E67E22']
                }
            }
        ],
        tables: [
            {
                title: 'Top 10 Activities by Budget',
                headers: ['Activity', 'Responsible Person', 'Budget', 'Actual Cost', 'Completion %', 'Status'],
                rows: [
                    ['Visiting new orphanges in PH City...', 'Esther, Davis', '$500,000', '$800,000', '51%', 'Delayed'],
                    ['Statement for Test...', 'Mary, John', '$700', '$67,000', '51%', 'Delayed'],
                    ['Activity test statement...', 'Mary Doe', '$500', '$0', '0%', 'Delayed']
                ]
            },
            {
                title: 'Recent Requests',
                headers: ['Activity', 'Staff', 'Amount', 'Status', 'Date'],
                rows: [
                    ['Request for fuel', 'James Bond', '$200', 'Approved', '2026-02-12'],
                    ['Office supplies', 'Jane Doe', '$150', 'Pending', '2026-02-11']
                ]
            }
        ],
        metadata: {
            reportName: 'Layout Verification Report',
            reportType: 'Activity Summary',
            generatedAt: new Date(),
            filters: {
                selectedMetrics: ['budgetUtilization', 'completionRate']
            }
        }
    };

    const outputPath = path.join(process.cwd(), 'reports', 'test_layout_fix.pdf');

    try {
        const resultPath = await generatePDFReport({
            reportData: dummyReportData,
            outputPath,
            includeCharts: true,
            includeTables: true
        });

        console.log(`Report generated successfully at: ${resultPath}`);

        if (fs.existsSync(resultPath)) {
            const stats = fs.statSync(resultPath);
            console.log(`File size: ${stats.size} bytes`);
        }
    } catch (error) {
        console.error('Test FAILED:', error);
        process.exit(1);
    }
}

testGeneration();
