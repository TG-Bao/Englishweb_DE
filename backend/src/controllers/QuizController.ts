import { Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middleware/authMiddleware";
import { IQuizService } from "../interfaces/services/QuizService";
import { IQuestionService } from "../interfaces/services/QuestionService";
import { IProgressService } from "../interfaces/services/ProgressService";
import { validateCreateQuiz, validateSubmitQuiz, validateUpdateQuiz } from "../validators/quizValidators";
import { sendSuccess } from "../utils/response";

export class QuizController {
  constructor(
    private quizService: IQuizService,
    private questionService: IQuestionService,
    private progressService: IProgressService
  ) {}

  list = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const items = await this.quizService.listPublished();
    return sendSuccess(res, items);
  });

  listAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const items = await this.quizService.listAll();
    return sendSuccess(res, items);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateCreateQuiz(req.body);

    const created = await this.quizService.create({
      scopeType: dto.scopeType,
      scopeId: dto.scopeId ? new ObjectId(dto.scopeId) : undefined,
      title: dto.title,
      passScore: dto.passScore,
      isPublished: dto.isPublished
    });
    return sendSuccess(res, created, 201);
  });

  submit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { quizId, answers } = validateSubmitQuiz(req.body);

    const quiz = await this.quizService.getById(quizId);
    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    const questions = await this.questionService.listByQuiz(quizId);
    if (questions.length === 0) {
      throw new AppError("Quiz has no questions", 400);
    }

    const answersList = questions.map(q => answers[q._id!.toString()] || "");
    const result = this.quizService.grade(questions, answersList);
    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= quiz.passScore;

    if (req.user) {
      await this.progressService.recordQuizResult(
        req.user.id,
        quizId,
        result.score,
        result.total,
        percentage,
        passed
      );

      if (quiz.scopeType === "LESSON" && quiz.scopeId) {
        await this.progressService.recordLessonQuizScore(req.user.id, quiz.scopeId.toString(), percentage, passed);
      }
    }

    return sendSuccess(res, { ...result, percentage, passed, passScore: quiz.passScore });
  });

  getDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const quiz = await this.quizService.getById(req.params.id);
    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    const questions = await this.questionService.listByQuiz(quiz._id!.toString());
    return sendSuccess(res, { quiz, questions });
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = validateUpdateQuiz(req.body);
    const data = {
      ...dto,
      ...(dto.scopeId ? { scopeId: new ObjectId(dto.scopeId) } : {})
    };

    const updated = await this.quizService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Quiz not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.quizService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
