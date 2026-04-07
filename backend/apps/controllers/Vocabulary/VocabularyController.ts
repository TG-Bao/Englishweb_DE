import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/authMiddleware";
import { VocabularyService } from "../../Services/VocabularyService";
import { validateCreateVocabulary, validateUpdateVocabulary } from "../../validators/vocabularyValidators";
import { sendSuccess } from "../../utils/response";
import { ProgressService } from "../../Services/ProgressService";
import { AppError } from "../../utils/AppError";

export class VocabularyController {
  private vocabService: VocabularyService;

  constructor() {
    this.vocabService = new VocabularyService();
  }

  list = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters = {
      topicId: req.query.topicId as string,
      topic: req.query.topic as string,
      level: req.query.level as string,
      search: req.query.search as string
    };
    let items = await this.vocabService.list(filters);

    let learnedSet = new Set<string>();
    if (req.user) {
      const progService = new ProgressService();
      const progress = await progService.getByUser(req.user.id);
      if (progress && progress.topicProgress) {
        progress.topicProgress.forEach((tp: any) => {
          if (tp.vocabLearned) {
            tp.vocabLearned.forEach((id: ObjectId) => learnedSet.add(id.toString()));
          }
        });
      }
    }

    items = items.map((item: any) => {
       item.learned = learnedSet.has(item._id.toString());
       return item;
    });

    const learnedFilter = req.query.learned as string;
    if (learnedFilter === "1") {
       items = items.filter((item: any) => item.learned === true);
    } else if (learnedFilter === "0") {
       items = items.filter((item: any) => item.learned === false);
    }

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
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;
    const progService = new ProgressService();
    const result = await progService.toggleVocabularyLearned(req.user.id, id);
    sendSuccess(res, { learned: result.learned });
  });
}
