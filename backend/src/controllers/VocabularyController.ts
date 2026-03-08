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
    const topicId = req.query.topicId?.toString();
    const level = req.query.level?.toString();
    const search = req.query.search?.toString();

    const filters = { topicId, topic, level, search };
    const items = await this.vocabService.list(filters);

    const formattedItems = items.map(item => ({
      _id: item._id,
      word: item.word,
      meaning: item.meaning,
      phonetic: item.phonetic,
      audioUrl: item.audioUrl,
      example: item.example,
      topic: item.topic,
      level: item.level,
      topicId: item.topicId
    }));

    return sendSuccess(res, formattedItems);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateCreateVocabulary(req.body);

    const created = await this.vocabService.create({
      topicId: new ObjectId(dto.topicId),
      word: dto.word,
      meaning: dto.meaning,
      example: dto.example,
      topic: dto.topic,
      level: dto.level,
      phonetic: dto.phonetic,
      audioUrl: dto.audioUrl
    });
    sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateUpdateVocabulary(req.body);
    const { topicId, ...updateFields } = dto;
    const data: any = {
      ...updateFields,
      ...(topicId ? { topicId: new ObjectId(topicId) } : {})
    };

    const updated = await this.vocabService.update(req.params.id, data as any);
    if (!updated) {
      throw new AppError("Vocabulary not found", 404);
    }
    sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.vocabService.remove(req.params.id);
    sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
