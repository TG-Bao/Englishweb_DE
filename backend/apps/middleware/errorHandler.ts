import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (err: Error | AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });
};
