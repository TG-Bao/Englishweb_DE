import { Quiz } from "../../Entity/Quiz";

export interface IQuizRepository {
  listPublished(): Promise<Quiz[]>;
  listAll(): Promise<Quiz[]>;
  listByScope(scopeType: string, scopeId?: string): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  create(data: Omit<Quiz, "_id">): Promise<Quiz>;
  update(id: string, data: Partial<Quiz>): Promise<Quiz | null>;
  remove(id: string): Promise<void>;
}
