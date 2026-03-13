import { GrammarDocument } from "../models/Grammar";
import { IGrammarRepository } from "../interfaces/repositories/GrammarRepository";
import { IGrammarService } from "../interfaces/services/GrammarService";

export class GrammarService implements IGrammarService {
  constructor(private grammarRepo: IGrammarRepository) {}

  async listByLevel(level: string): Promise<GrammarDocument[]> {
    return this.grammarRepo.listByLevel(level);
  }

  async findById(id: string): Promise<GrammarDocument | null> {
    return this.grammarRepo.findById(id);
  }

  async create(data: Omit<GrammarDocument, "_id">): Promise<GrammarDocument> {
    return this.grammarRepo.create(data);
  }

  async update(id: string, data: Partial<GrammarDocument>): Promise<GrammarDocument | null> {
    return this.grammarRepo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    return this.grammarRepo.remove(id);
  }
}
