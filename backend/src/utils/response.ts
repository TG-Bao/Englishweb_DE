import { Response } from "express";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, message?: string) => {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {})
  };
  return res.status(statusCode).json(payload);
};
