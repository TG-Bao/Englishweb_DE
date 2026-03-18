import { Topic } from "../../Entity/Topic";

export interface ITopicRepository {
  listPublished(): Promise<Topic[]>;
  listAll(): Promise<Topic[]>;
  findById(id: string): Promise<Topic | null>;
  create(data: Omit<Topic, "_id">): Promise<Topic>;
  update(id: string, data: Partial<Topic>): Promise<Topic | null>;
  remove(id: string): Promise<void>;
}
