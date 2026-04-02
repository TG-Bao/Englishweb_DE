import { NextFunction, Request, Response } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};
