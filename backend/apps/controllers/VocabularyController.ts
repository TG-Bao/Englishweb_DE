import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import { VocabularyService } from "../Services/VocabularyService";
import { validateCreateVocabulary, validateUpdateVocabulary } from "../validators/vocabularyValidators";
import { sendSuccess } from "../utils/response";

export class VocabularyController {
  private vocabService: VocabularyService;

  constructor() {
    this.vocabService = new VocabularyService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      topicId: req.query.topicId as string,
      topic: req.query.topic as string,
      level: req.query.level as string,
      search: req.query.search as string,
      learned: req.query.learned as string
    };
    const items = await this.vocabService.list(filters);
    sendSuccess(res, items);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateCreateVocabulary(req.body);
    const created = await this.vocabService.create(dto as any);
    sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateUpdateVocabulary(req.body);
    const data: any = {
      ...dto,
      ...(dto.topicId ? { topicId: new ObjectId(dto.topicId) } : {})
    };
    const updated = await this.vocabService.update(req.params.id, data);
    sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.vocabService.remove(req.params.id);
    sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });

  toggleLearned = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const vocab = await this.vocabService.findById(id);
    const newVal = vocab?.learned === 1 ? 0 : 1;
    const updated = await this.vocabService.update(id, { learned: newVal } as any);
    sendSuccess(res, updated);
  });
}
