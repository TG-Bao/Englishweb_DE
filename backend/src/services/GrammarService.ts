import { GrammarDocument } from "../models/Grammar";
import { IGrammarRepository } from "../interfaces/repositories/GrammarRepository";
import { IGrammarService } from "../interfaces/services/GrammarService";

export class GrammarService implements IGrammarService {
  constructor(private grammarRepo: IGrammarRepository) {}


  listByLevel(level: string) {
    return this.grammarRepo.listByLevel(level);
  }

  findById(id: string) {
    return this.grammarRepo.findById(id);
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
