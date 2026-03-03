import { VocabularyDocument } from "../../models/Vocabulary";

export interface IVocabularyRepository {
  listByLesson(lessonId: string): Promise<VocabularyDocument[]>;
  listByTopic(topic?: string): Promise<VocabularyDocument[]>;
  create(data: Omit<VocabularyDocument, "_id">): Promise<VocabularyDocument>;
  update(id: string, data: Partial<VocabularyDocument>): Promise<VocabularyDocument | null>;
  remove(id: string): Promise<void>;
}
