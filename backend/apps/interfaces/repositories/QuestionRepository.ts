import { Question } from "../../Entity/Question";

export interface IQuestionRepository {
  listByQuiz(quizId: string): Promise<Question[]>;
  create(data: Omit<Question, "_id">): Promise<Question>;
  update(id: string, data: Partial<Question>): Promise<Question | null>;
  remove(id: string): Promise<void>;
}
