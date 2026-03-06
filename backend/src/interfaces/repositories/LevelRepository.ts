import { LevelDocument } from "../../models/Level";

export interface ILevelRepository {
    listPublished(): Promise<LevelDocument[]>;
    listAll(): Promise<LevelDocument[]>;
    findById(id: string): Promise<LevelDocument | null>;
    create(data: Omit<LevelDocument, "_id">): Promise<LevelDocument>;
    update(id: string, data: Partial<LevelDocument>): Promise<LevelDocument | null>;
    remove(id: string): Promise<void>;
}
