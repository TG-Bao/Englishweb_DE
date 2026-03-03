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
    return sendSuccess(
      res,
      progress || {
        lessonProgress: [],
        topicProgress: [],
        quizResults: []
      }
    );
  });

  markVocabularyLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { lessonId, vocabId } = validateMarkVocabulary(req.body);
    const progress = await this.progressService.markVocabularyLearned(req.user.id, lessonId, vocabId);
    return sendSuccess(res, progress);
  });

  markGrammarLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { lessonId, grammarId } = validateMarkGrammar(req.body);
    const progress = await this.progressService.markGrammarLearned(req.user.id, lessonId, grammarId);
    return sendSuccess(res, progress);
  });
}
