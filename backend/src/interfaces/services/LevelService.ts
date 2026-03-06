import { LevelDocument } from "../../models/Level";

export interface ILevelService {
    listPublished(): Promise<LevelDocument[]>;
    listAll(): Promise<LevelDocument[]>;
    create(data: any): Promise<LevelDocument>;
    update(id: string, data: any): Promise<LevelDocument>;
    remove(id: string): Promise<void>;
}
