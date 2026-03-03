import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { ITopicService } from "../interfaces/services/TopicService";
import { validateCreateTopic, validateUpdateTopic } from "../validators/topicValidators";
import { sendSuccess } from "../utils/response";

export class TopicController {
  constructor(private topicService: ITopicService) {}

  listPublished = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.topicService.listPublished();
    return sendSuccess(res, topics);
  });

  listAll = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.topicService.listAll();
    return sendSuccess(res, topics);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateCreateTopic(req.body);

    const created = await this.topicService.create({
      title: dto.title,
      description: dto.description,
      order: dto.order,
      level: dto.level,
      isPublished: dto.isPublished
    });
    return sendSuccess(res, created, 201);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const dto = validateUpdateTopic(req.body);
    const updated = await this.topicService.update(req.params.id, dto);
    if (!updated) {
      throw new AppError("Topic not found", 404);
    }
    return sendSuccess(res, updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.topicService.remove(req.params.id);
    return sendSuccess(res, { id: req.params.id }, 200, "Deleted");
  });
}
