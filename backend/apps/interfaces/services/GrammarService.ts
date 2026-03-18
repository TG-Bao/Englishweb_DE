import { Grammar } from "../../Entity/Grammar";

export interface IGrammarService {
  listByLevel(level: string): Promise<Grammar[]>;
  findById(id: string): Promise<Grammar | null>;
  create(data: Omit<Grammar, "_id">): Promise<Grammar>;
  update(id: string, data: Partial<Grammar>): Promise<Grammar | null>;
  remove(id: string): Promise<void>;
}
