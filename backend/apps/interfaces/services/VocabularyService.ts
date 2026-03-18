import { Vocabulary } from "../../Entity/Vocabulary";

export interface IVocabularyService {
  list(filters: { topicId?: string; topic?: string; level?: string; search?: string; learned?: string }): Promise<Vocabulary[]>;
  findById(id: string): Promise<Vocabulary | null>;
  create(data: Omit<Vocabulary, "_id">): Promise<Vocabulary>;
  update(id: string, data: Partial<Vocabulary>): Promise<Vocabulary | null>;
  remove(id: string): Promise<boolean>;
}
