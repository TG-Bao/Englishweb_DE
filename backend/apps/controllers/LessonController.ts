import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { LessonService } from "../Services/LessonService";
import { sendSuccess } from "../utils/response";

export class LessonController {
  private lessonService: LessonService;

  constructor() {
    this.lessonService = new LessonService();
  }

  list = asyncHandler(async (_req: Request, res: Response) => {
    const lessons = await this.lessonService.list();
    return sendSuccess(res, lessons);
  });

  listByLevel = asyncHandler(async (req: Request, res: Response) => {
    const levelId = req.params.levelId;
    const lessons = await this.lessonService.listByLevel(levelId);
    return sendSuccess(res, lessons);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const lesson = await this.lessonService.findById(req.params.id);
    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }
    return sendSuccess(res, lesson);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const created = await this.lessonService.create(req.body);
    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.lessonService.update(req.params.id, req.body);
    if (!updated) {
      throw new AppError("Lesson not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.lessonService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
