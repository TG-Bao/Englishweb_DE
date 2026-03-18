import { Quiz } from "../../Entity/Quiz";

export interface IQuizService {
  listPublished(): Promise<Quiz[]>;
  listAll(): Promise<Quiz[]>;
  listByScope(scopeType: string, scopeId?: string): Promise<Quiz[]>;
  getById(id: string): Promise<Quiz | null>;
  create(data: Omit<Quiz, "_id">): Promise<Quiz>;
  update(id: string, data: Partial<Quiz>): Promise<Quiz | null>;
  remove(id: string): Promise<void>;
  grade(questions: { correctAnswer: string }[], answers: string[]): { score: number; total: number };
}
