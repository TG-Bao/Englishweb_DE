import { QuizDocument } from "../../models/Quiz";

export interface IQuizRepository {
  listPublished(): Promise<QuizDocument[]>;
  listAll(): Promise<QuizDocument[]>;
  listByScope(scopeType: string, scopeId?: string): Promise<QuizDocument[]>;
  findById(id: string): Promise<QuizDocument | null>;
  create(data: Omit<QuizDocument, "_id">): Promise<QuizDocument>;
  update(id: string, data: Partial<QuizDocument>): Promise<QuizDocument | null>;
  remove(id: string): Promise<void>;
}
