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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePieChart = generatePieChart;
exports.generateBarChart = generateBarChart;
exports.generateDoughnutChart = generateDoughnutChart;
exports.generateLineChart = generateLineChart;
exports.generateChart = generateChart;
exports.generateCharts = generateCharts;
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const width = 800;
const height = 400;
const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: 'white'
});
function generatePieChart(chartData) {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
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
        const imageBuffer = yield chartJSNodeCanvas.renderToBuffer(configuration);
        return {
            title: chartData.title,
            imageBuffer,
            width,
            height
        };
    });
}
function generateBarChart(chartData) {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
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
        const imageBuffer = yield chartJSNodeCanvas.renderToBuffer(configuration);
        return {
            title: chartData.title,
            imageBuffer,
            width,
            height
        };
    });
}
function generateDoughnutChart(chartData) {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
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
        const imageBuffer = yield chartJSNodeCanvas.renderToBuffer(configuration);
        return {
            title: chartData.title,
            imageBuffer,
            width,
            height
        };
    });
}
function generateLineChart(chartData) {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
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
        const imageBuffer = yield chartJSNodeCanvas.renderToBuffer(configuration);
        return {
            title: chartData.title,
            imageBuffer,
            width,
            height
        };
    });
}
function generateChart(chartData) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function generateCharts(chartsData) {
    return __awaiter(this, void 0, void 0, function* () {
        const chartPromises = chartsData.map(chartData => generateChart(chartData));
        return Promise.all(chartPromises);
    });
}
