import { QuestionDocument } from "../models/Question";
import { IQuestionRepository } from "../interfaces/repositories/QuestionRepository";
import { IQuestionService } from "../interfaces/services/QuestionService";

export class QuestionService implements IQuestionService {
  constructor(private questionRepo: IQuestionRepository) {}

  listByQuiz(quizId: string) {
    return this.questionRepo.listByQuiz(quizId);
  }

  create(data: Omit<QuestionDocument, "_id">) {
    return this.questionRepo.create(data);
  }

  update(id: string, data: Partial<QuestionDocument>) {
    return this.questionRepo.update(id, data);
  }

  remove(id: string) {
    return this.questionRepo.remove(id);
  }
}
