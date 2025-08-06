export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});
export const notFoundResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: false,
  message,
  data,
});

export const errorResponse = (message: string, error?: any): ApiResponse => {
  const errorMessage = error?.toString() || "An error occurred";

  const isDbConnectionError = errorMessage.includes("Can't reach database server");
  const isDbConnectionError2 = errorMessage.includes("Please make sure your database server is running at");

  return {
    success: false,
    message: isDbConnectionError | isDbConnectionError2 ? "Please try again. Database connection failed." : message,
    error: isDbConnectionError | isDbConnectionError2 ? "" : errorMessage,
  };
};