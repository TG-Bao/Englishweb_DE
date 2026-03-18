import { Level } from "../../Entity/Level";

export interface ILevelRepository {
    listPublished(): Promise<Level[]>;
    listAll(): Promise<Level[]>;
    findById(id: string): Promise<Level | null>;
    create(data: Omit<Level, "_id">): Promise<Level>;
    update(id: string, data: Partial<Level>): Promise<Level | null>;
    remove(id: string): Promise<void>;
}
