import { VocabularyDocument } from "../models/Vocabulary";
import { IVocabularyRepository } from "../interfaces/repositories/VocabularyRepository";
import { IVocabularyService } from "../interfaces/services/VocabularyService";

export class VocabularyService implements IVocabularyService {
  constructor(private vocabRepo: IVocabularyRepository) { }


  list(filters: { lessonId?: string; topic?: string; level?: string; search?: string }) {
    return this.vocabRepo.list(filters);
  }

  create(data: Omit<VocabularyDocument, "_id">) {
    return this.vocabRepo.create(data);
  }

  update(id: string, data: Partial<VocabularyDocument>) {
    return this.vocabRepo.update(id, data);
  }

  remove(id: string) {
    return this.vocabRepo.remove(id);
  }
}
