import { GrammarDocument } from "../../models/Grammar";

export interface IGrammarRepository {
  listByLevel(level: string): Promise<GrammarDocument[]>;
  findById(id: string): Promise<GrammarDocument | null>;
  create(data: Omit<GrammarDocument, "_id">): Promise<GrammarDocument>;
  update(id: string, data: Partial<GrammarDocument>): Promise<GrammarDocument | null>;
  remove(id: string): Promise<void>;
}
