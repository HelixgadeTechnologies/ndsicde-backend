"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.notFoundResponse = exports.successResponse = void 0;
const successResponse = (message, data) => ({
    success: true,
    message,
    data,
});
exports.successResponse = successResponse;
const notFoundResponse = (message, data) => ({
    success: false,
    message,
    data,
});
exports.notFoundResponse = notFoundResponse;
const errorResponse = (message, error) => {
    const errorMessage = (error === null || error === void 0 ? void 0 : error.toString()) || "An error occurred";
    const isDbConnectionError = errorMessage.includes("Can't reach database server");
    const isDbConnectionError2 = errorMessage.includes("Please make sure your database server is running at");
    return {
        success: false,
        message: isDbConnectionError | isDbConnectionError2 ? "Please try again. Database connection failed." : message,
        error: isDbConnectionError | isDbConnectionError2 ? "" : errorMessage,
    };
};
exports.errorResponse = errorResponse;
