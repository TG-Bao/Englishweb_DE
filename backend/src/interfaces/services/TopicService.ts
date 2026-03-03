import { TopicDocument } from "../../models/Topic";

export interface ITopicService {
  listPublished(): Promise<TopicDocument[]>;
  listAll(): Promise<TopicDocument[]>;
  create(data: Omit<TopicDocument, "_id">): Promise<TopicDocument>;
  update(id: string, data: Partial<TopicDocument>): Promise<TopicDocument | null>;
  remove(id: string): Promise<void>;
}
