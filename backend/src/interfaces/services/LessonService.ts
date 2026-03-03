import { LessonDocument } from "../../models/Lesson";

export interface ILessonService {
  listByTopic(topicId: string, publishedOnly?: boolean): Promise<LessonDocument[]>;
  getById(id: string): Promise<LessonDocument | null>;
  create(data: Omit<LessonDocument, "_id">): Promise<LessonDocument>;
  update(id: string, data: Partial<LessonDocument>): Promise<LessonDocument | null>;
  remove(id: string): Promise<void>;
}
