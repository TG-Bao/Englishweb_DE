import { MongoClient, Db } from "mongodb";
import { Question } from "../Entity/Question";
import { IQuestionService } from "../interfaces/services/QuestionService";
import { QuestionRepository } from "../Repository/QuestionRepository";
import { DatabaseConnection } from "../Database/Database";

export class QuestionService implements IQuestionService {
  private client: MongoClient;
  private database: Db;
  private questionRepo: QuestionRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.questionRepo = new QuestionRepository(this.database);
  }

  async listByQuiz(quizId: string) {
    return this.questionRepo.listByQuiz(quizId);
  }

  async create(data: Omit<Question, "_id">) {
    return this.questionRepo.create(data);
  }

  async update(id: string, data: Partial<Question>) {
    return this.questionRepo.update(id, data);
  }

  async remove(id: string) {
    await this.questionRepo.remove(id);
  }
}
