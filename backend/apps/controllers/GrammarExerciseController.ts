import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { GrammarExerciseService } from "../Services/GrammarExerciseService";

export class GrammarExerciseController {
  private exerciseService: GrammarExerciseService;

  constructor() {
    this.exerciseService = new GrammarExerciseService();
  }

  listByGrammar = asyncHandler(async (req: AuthRequest, res: Response) => {
    const grammarId = req.query.grammarId as string;
    const results = await this.exerciseService.listByGrammar(grammarId);
    sendSuccess(res, results);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { grammarId, question, type, explanation, options } = req.body;
    if (!grammarId || !question || !type) throw new AppError("grammarId, question và type là bắt buộc", 400);
    const created = await this.exerciseService.create({ grammarId, question, type, explanation, options });
    sendSuccess(res, created, 201, "Tạo bài tập thành công");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.exerciseService.delete(req.params.id);
    sendSuccess(res, { id: req.params.id }, 200, "Xóa thành công");
  });

  submit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { exerciseId, selectedOptionId } = req.body;
    const userId = req.user!.id;
    const result = await this.exerciseService.submit(userId, exerciseId, selectedOptionId);
    sendSuccess(res, result);
  });
}
