import { TopicDocument } from "../../models/Topic";

export interface ITopicRepository {
  listPublished(): Promise<TopicDocument[]>;
  listAll(): Promise<TopicDocument[]>;
  findById(id: string): Promise<TopicDocument | null>;
  create(data: Omit<TopicDocument, "_id">): Promise<TopicDocument>;
  update(id: string, data: Partial<TopicDocument>): Promise<TopicDocument | null>;
  remove(id: string): Promise<void>;
}
