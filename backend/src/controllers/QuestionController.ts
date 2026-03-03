import { Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { IQuestionService } from "../interfaces/services/QuestionService";
import { validateCreateQuestion, validateUpdateQuestion } from "../validators/questionValidators";
import { sendSuccess } from "../utils/response";

export class QuestionController {
  constructor(private questionService: IQuestionService) {}

  listByQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quizId } = req.params;
    const items = await this.questionService.listByQuiz(quizId);
    return sendSuccess(res, items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateCreateQuestion(req.body);

    const created = await this.questionService.create({
      quizId: new ObjectId(dto.quizId),
      sourceType: dto.sourceType,
      sourceId: dto.sourceId ? new ObjectId(dto.sourceId) : undefined,
      question: dto.question,
      options: dto.options,
      correctAnswer: dto.correctAnswer,
      type: dto.type
    });

    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateUpdateQuestion(req.body);
    const data = {
      ...dto,
      ...(dto.quizId ? { quizId: new ObjectId(dto.quizId) } : {}),
      ...(dto.sourceId ? { sourceId: new ObjectId(dto.sourceId) } : {})
    };

    const updated = await this.questionService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Question not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.questionService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
