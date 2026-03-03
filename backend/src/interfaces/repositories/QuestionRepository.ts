import { QuestionDocument } from "../../models/Question";

export interface IQuestionRepository {
  listByQuiz(quizId: string): Promise<QuestionDocument[]>;
  create(data: Omit<QuestionDocument, "_id">): Promise<QuestionDocument>;
  update(id: string, data: Partial<QuestionDocument>): Promise<QuestionDocument | null>;
  remove(id: string): Promise<void>;
}
