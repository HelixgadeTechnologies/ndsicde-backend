import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartData, ChartImageData } from '../interface/reportInterface';

const width = 800;
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: 'white'
});

/**
 * Generate a pie chart image buffer
 */
export async function generatePieChart(chartData: ChartData): Promise<ChartImageData> {
    const configuration: ChartConfiguration = {
        type: 'pie',
        data: {
            labels: chartData.data.labels,
            datasets: [{
                data: chartData.data.values,
                backgroundColor: chartData.data.colors || [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartData.title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return {
        title: chartData.title,
        imageBuffer,
        width,
        height
    };
}

/**
 * Generate a bar chart image buffer
 */
export async function generateBarChart(chartData: ChartData): Promise<ChartImageData> {
    const configuration: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: chartData.data.labels,
            datasets: [{
                label: chartData.title,
                data: chartData.data.values,
                backgroundColor: chartData.data.colors || '#36A2EB',
                borderColor: chartData.data.colors || '#2E86C1',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartData.title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return {
        title: chartData.title,
        imageBuffer,
        width,
        height
    };
}

/**
 * Generate a doughnut chart image buffer
 */
export async function generateDoughnutChart(chartData: ChartData): Promise<ChartImageData> {
    const configuration: ChartConfiguration = {
        type: 'doughnut',
        data: {
            labels: chartData.data.labels,
            datasets: [{
                data: chartData.data.values,
                backgroundColor: chartData.data.colors || [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartData.title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return {
        title: chartData.title,
        imageBuffer,
        width,
        height
    };
}

/**
 * Generate a line chart image buffer
 */
export async function generateLineChart(chartData: ChartData): Promise<ChartImageData> {
    const configuration: ChartConfiguration = {
        type: 'line',
        data: {
            labels: chartData.data.labels,
            datasets: [{
                label: chartData.title,
                data: chartData.data.values,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartData.title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return {
        title: chartData.title,
        imageBuffer,
        width,
        height
    };
}

/**
 * Generate chart based on type
 */
export async function generateChart(chartData: ChartData): Promise<ChartImageData> {
    switch (chartData.type) {
        case 'pie':
            return generatePieChart(chartData);
        case 'bar':
            return generateBarChart(chartData);
        case 'doughnut':
            return generateDoughnutChart(chartData);
        case 'line':
            return generateLineChart(chartData);
        default:
            throw new Error(`Unsupported chart type: ${chartData.type}`);
    }
}

/**
 * Generate multiple charts
 */
export async function generateCharts(chartsData: ChartData[]): Promise<ChartImageData[]> {
    const chartPromises = chartsData.map(chartData => generateChart(chartData));
    return Promise.all(chartPromises);
}
