import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { ILevelService } from "../interfaces/services/LevelService";

export class LevelController {
    constructor(private levelService: ILevelService) { }

    listPublished = asyncHandler(async (_req: Request, res: Response) => {
        const levels = await this.levelService.listPublished();
        sendSuccess(res, levels);
    });

    listAll = asyncHandler(async (_req: Request, res: Response) => {
        const levels = await this.levelService.listAll();
        sendSuccess(res, levels);
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const doc = await this.levelService.create(req.body);
        sendSuccess(res, doc, 201, "Tạo level thành công");
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const doc = await this.levelService.update(req.params.id, req.body);
        sendSuccess(res, doc, 200, "Cập nhật level thành công");
    });

    remove = asyncHandler(async (req: Request, res: Response) => {
        await this.levelService.remove(req.params.id);
        sendSuccess(res, null, 200, "Xóa level thành công");
    });
}
