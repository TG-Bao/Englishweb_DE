import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { AppError } from "../../utils/AppError";
import { GrammarService } from "../../Services/GrammarService";

export class GrammarController {
  private grammarService: GrammarService;

  constructor() {
    this.grammarService = new GrammarService();
  }

  listByLevel = asyncHandler(async (req: Request, res: Response) => {
    const level = req.params.level;
    const grammars = await this.grammarService.listByLevel(level);
    sendSuccess(res, grammars);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const grammar = await this.grammarService.findById(id);
    if (!grammar) {
      throw new AppError("Grammar lesson not found", 404);
    }
    sendSuccess(res, grammar);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const created = await this.grammarService.create(req.body);
    sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updated = await this.grammarService.update(id, req.body);
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
