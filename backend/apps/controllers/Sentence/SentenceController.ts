import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { SentenceService } from "../../Services/SentenceService";
import { sendSuccess } from "../../utils/response";
import { ObjectId } from "mongodb";
import { validateCreateSentence, validateUpdateSentence } from "../../validators/sentenceValidators";

export class SentenceController {
  private sentenceService: SentenceService;

  constructor() {
    this.sentenceService = new SentenceService();
  }

  list = asyncHandler(async (_req: Request, res: Response) => {
    const sentences = await this.sentenceService.list();
    return sendSuccess(res, sentences);
  });

  listByLesson = asyncHandler(async (req: Request, res: Response) => {
    const lessonId = req.params.lessonId;
    const sentences = await this.sentenceService.findByLessonId(lessonId);
    return sendSuccess(res, sentences);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const sentence = await this.sentenceService.findById(req.params.id);
    if (!sentence) {
      throw new AppError("Sentence not found", 404);
    }
    return sendSuccess(res, sentence);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateCreateSentence(req.body);
    const data = {
      ...dto,
      lesson_id: new ObjectId(dto.lesson_id)
    };
    const created = await this.sentenceService.create(data);
    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateUpdateSentence(req.body);
    const data: any = { ...dto };
    if (data.lesson_id) {
      data.lesson_id = new ObjectId(data.lesson_id);
    }
    const updated = await this.sentenceService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Sentence not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.sentenceService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });

  // Methods cũ để maintain backward compatibility
  getSentencesByTopic = asyncHandler(async (req: Request, res: Response) => {
    const topicId = req.params.topicId;
    const sentences = await this.sentenceService.getSentencesByTopic(topicId);
    return sendSuccess(res, sentences);
  });

  getSentenceById = asyncHandler(async (req: Request, res: Response) => {
    const sentenceId = req.params.id;
    const sentence = await this.sentenceService.getSentenceById(sentenceId);
    if (!sentence) {
      throw new AppError("Sentence not found", 404);
    }
    return sendSuccess(res, sentence);
  });
}
