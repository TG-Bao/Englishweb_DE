import { Request, Response } from "express";
import { IGrammarService } from "../interfaces/services/GrammarService";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";

export class GrammarController {
  constructor(private grammarService: IGrammarService) {}

  listByLevel = asyncHandler(async (req: Request, res: Response) => {
    const level = req.params.level;
    const grammars = await this.grammarService.listByLevel(level);
    sendSuccess(res, grammars);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const created = await this.grammarService.create(data);
    sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await this.grammarService.update(id, data);
    if (!updated) {
      throw new AppError("Grammar lesson not found", 404);
    }
    sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this.grammarService.remove(id);
    sendSuccess(res, { id }, 200, "Deleted");
  });
}
