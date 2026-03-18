import { Topic } from "../../Entity/Topic";

export interface ITopicService {
  listPublished(): Promise<Topic[]>;
  listAll(): Promise<Topic[]>;
  create(data: Omit<Topic, "_id">): Promise<Topic>;
  update(id: string, data: Partial<Topic>): Promise<Topic | null>;
  remove(id: string): Promise<void>;
}
