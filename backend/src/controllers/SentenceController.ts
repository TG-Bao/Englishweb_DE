import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { ISentenceService } from "../interfaces/services/SentenceService";
import { CreateSentenceDto, UpdateSentenceDto, createSentenceSchema, updateSentenceSchema } from "../dtos/sentenceDtos";
import { sentenceIdSchema } from "../validators/sentenceValidators";

export class SentenceController {
  constructor(private sentenceService: ISentenceService) {}

  listSentences = asyncHandler(async (req: Request, res: Response) => {
    const sentences = await this.sentenceService.listSentences();
    return sendSuccess(res, sentences);
  });

  getSentenceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = sentenceIdSchema.parse(req.params);
    const sentence = await this.sentenceService.getSentenceById(id);
    if (!sentence) {
      res.status(404);
      throw new Error("Sentence not found");
    }
    return sendSuccess(res, sentence);
  });

  createSentence = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateSentenceDto = createSentenceSchema.parse(req.body);
    const newSentence = await this.sentenceService.createSentence(data);
    return sendSuccess(res, newSentence, 201);
  });

  updateSentence = asyncHandler(async (req: Request, res: Response) => {
    const { id } = sentenceIdSchema.parse(req.params);
    const data: UpdateSentenceDto = updateSentenceSchema.parse(req.body);
    const updatedSentence = await this.sentenceService.updateSentence(id, data);
    if (!updatedSentence) {
      res.status(404);
      throw new Error("Sentence not found");
    }
    return sendSuccess(res, updatedSentence);
  });

  deleteSentence = asyncHandler(async (req: Request, res: Response) => {
    const { id } = sentenceIdSchema.parse(req.params);
    const deleted = await this.sentenceService.deleteSentence(id);
    if (!deleted) {
      res.status(404);
      throw new Error("Sentence not found");
    }
    return sendSuccess(res, { message: "Sentence deleted" });
  });
}