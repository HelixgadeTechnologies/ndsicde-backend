import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/errorLogger";
import { errorResponse } from "../utils/responseHandler";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      await logError("ENDPOINT", req.path, error, {
        method: req.method,
        params: req.params,
        query: req.query,
      });
      res
        .status(error?.statusCode ?? 500)
        .json(errorResponse("Internal server error", error));
    }
  };
