import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { IVocabularyService } from "../interfaces/services/VocabularyService";
import { validateCreateVocabulary, validateUpdateVocabulary } from "../validators/vocabularyValidators";
import { sendSuccess } from "../utils/response";
import { VocabularyDocument } from "../models/Vocabulary";

export class VocabularyController {
  constructor(private vocabService: IVocabularyService) { }

  list = asyncHandler(async (req: Request, res: Response) => {
    const topic = req.query.topic?.toString();
    const lessonId = req.query.lessonId?.toString();
    const level = req.query.level?.toString();
    const search = req.query.search?.toString();

    const filters = { lessonId, topic, level, search };
    const items = await this.vocabService.list(filters);

    const formattedItems = items.map(item => ({
      _id: item._id,
      word: item.word,
      meaning: item.meaning,
      phonetic: item.phonetic,
      audioUrl: item.audioUrl,
      example: item.example,
      topic: item.topic,
      level: item.level
    }));

    return sendSuccess(res, formattedItems);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateCreateVocabulary(req.body);

    const created = await this.vocabService.create({
      lessonId: new ObjectId(dto.lessonId),
      word: dto.word,
      meaning: dto.meaning,
      example: dto.example,
      topic: dto.topic,
      level: dto.level,
      phonetic: dto.phonetic,
      audioUrl: dto.audioUrl
    });
    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, ...dto } = validateUpdateVocabulary(req.body);
    const data: Partial<VocabularyDocument> = {
      ...dto,
      ...(lessonId ? { lessonId: new ObjectId(lessonId) } : {})
    };

    const updated = await this.vocabService.update(req.params.id, data);
    if (!updated) {
      throw new AppError("Vocabulary not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.vocabService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
