import { ILevelService } from "../interfaces/services/LevelService";
import { ILevelRepository } from "../interfaces/repositories/LevelRepository";
import { AppError } from "../utils/AppError";
import { LevelDocument } from "../models/Level";

export class LevelService implements ILevelService {
    constructor(private levelRepo: ILevelRepository) { }

    async listPublished(): Promise<LevelDocument[]> {
        return this.levelRepo.listPublished();
    }

    async listAll(): Promise<LevelDocument[]> {
        return this.levelRepo.listAll();
    }

    async create(data: any): Promise<LevelDocument> {
        const newDoc: Omit<LevelDocument, "_id"> = {
            name: data.name,
            description: data.description || "",
            order: data.order || 1,
            minPoints: data.minPoints || 0,
            isPublished: data.isPublished !== undefined ? data.isPublished : true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.levelRepo.create(newDoc);
    }

    async update(id: string, data: any): Promise<LevelDocument> {
        const existing = await this.levelRepo.findById(id);
        if (!existing) throw new AppError("Level không tồn tại", 404);

        const updateData: Partial<LevelDocument> = {
            ...data,
            updatedAt: new Date()
        };
        delete updateData._id;

        const updated = await this.levelRepo.update(id, updateData);
        if (!updated) throw new AppError("Lập trình lỗi không cập nhật được", 500);
        return updated;
    }

    async remove(id: string): Promise<void> {
        const existing = await this.levelRepo.findById(id);
        if (!existing) throw new AppError("Level không tồn tại", 404);
        await this.levelRepo.remove(id);
    }
}
