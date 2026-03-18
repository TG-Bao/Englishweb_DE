import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
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

  submit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { exerciseId, selectedOptionId } = req.body;
    const userId = req.user!.id;
    const result = await this.exerciseService.submit(userId, exerciseId, selectedOptionId);
    sendSuccess(res, result);
  });
}
