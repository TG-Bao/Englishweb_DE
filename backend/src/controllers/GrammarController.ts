import { Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { IGrammarService } from "../interfaces/services/GrammarService";
import { validateCreateGrammar, validateUpdateGrammar } from "../validators/grammarValidators";
import { sendSuccess } from "../utils/response";

export class GrammarController {
  constructor(private grammarService: IGrammarService) {}


  listByLevel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level } = req.params;
    const items = await this.grammarService.listByLevel(level);
    sendSuccess(res, items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateCreateGrammar(req.body);

    const created = await this.grammarService.create({
      level: dto.level,
      title: dto.title,
      description: dto.description,
      examples: dto.examples || []
    });

    sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateUpdateGrammar(req.body);
    const updated = await this.grammarService.update(req.params.id, dto as any);
    if (!updated) {
      throw new AppError("Grammar not found", 404);
    }
    sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.grammarService.remove(req.params.id);
    sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
