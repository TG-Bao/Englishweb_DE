import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { IProgressService } from "../interfaces/services/ProgressService";
import { validateMarkGrammar, validateMarkVocabulary } from "../validators/progressValidators";
import { sendSuccess } from "../utils/response";

export class ProgressController {
  constructor(private progressService: IProgressService) {}

  getMyProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const progress = await this.progressService.getByUser(req.user.id);
    sendSuccess(
      res,
      progress || {
        levelProgress: [],
        topicProgress: [],
        quizResults: []
      }
    );
  });

  markVocabularyLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { topicId, vocabId } = validateMarkVocabulary(req.body);
    const progress = await this.progressService.markVocabularyLearned(req.user.id, topicId, vocabId);
    sendSuccess(res, progress);
  });

  markGrammarLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { level, grammarId } = validateMarkGrammar(req.body);
    const progress = await this.progressService.markGrammarLearned(req.user.id, level, grammarId);
    sendSuccess(res, progress);
  });
}
