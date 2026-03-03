import { GrammarDocument } from "../models/Grammar";
import { IGrammarRepository } from "../interfaces/repositories/GrammarRepository";
import { IGrammarService } from "../interfaces/services/GrammarService";

export class GrammarService implements IGrammarService {
  constructor(private grammarRepo: IGrammarRepository) {}

  listByLesson(lessonId: string) {
    return this.grammarRepo.listByLesson(lessonId);
  }

  create(data: Omit<GrammarDocument, "_id">) {
    return this.grammarRepo.create(data);
  }

  update(id: string, data: Partial<GrammarDocument>) {
    return this.grammarRepo.update(id, data);
  }

  remove(id: string) {
    return this.grammarRepo.remove(id);
  }
}
