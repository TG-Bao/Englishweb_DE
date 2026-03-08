import { Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { IGrammarService } from "../interfaces/services/GrammarService";
import { validateCreateGrammar, validateUpdateGrammar } from "../validators/grammarValidators";
import { sendSuccess } from "../utils/response";
import { GrammarDocument } from "../models/Grammar";

export class GrammarController {
  constructor(private grammarService: IGrammarService) { }

  listByLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const items = await this.grammarService.listByLesson(lessonId);
    return sendSuccess(res, items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateCreateGrammar(req.body);

    const created = await this.grammarService.create({
      lessonId: new ObjectId(dto.lessonId),
      title: dto.title,
      description: dto.description,
      examples: dto.examples || []
    });

    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonId, ...dto } = validateUpdateGrammar(req.body);
    const data: Partial<GrammarDocument> = {
      ...dto,
      ...(lessonId ? { lessonId: new ObjectId(lessonId) } : {})
    };

    const updated = await this.grammarService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Grammar not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.grammarService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
