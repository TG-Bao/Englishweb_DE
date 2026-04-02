import { Level } from "../../Entity/Level";

export interface ILevelService {
    listPublished(): Promise<Level[]>;
    listAll(): Promise<Level[]>;
    create(data: any): Promise<Level>;
    update(id: string, data: any): Promise<Level | null>;
    remove(id: string): Promise<void>;
}
