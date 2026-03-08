import { VocabularyDocument } from "../../models/Vocabulary";

export interface IVocabularyRepository {
  list(filters: { topicId?: string; topic?: string; level?: string; search?: string }): Promise<VocabularyDocument[]>;
  create(data: Omit<VocabularyDocument, "_id">): Promise<VocabularyDocument>;
  update(id: string, data: Partial<VocabularyDocument>): Promise<VocabularyDocument | null>;
  remove(id: string): Promise<void>;
}
