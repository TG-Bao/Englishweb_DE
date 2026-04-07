import { MongoClient, Db, ObjectId } from "mongodb";
import { Quiz } from "../Entity/Quiz";
import { IQuizService } from "../interfaces/services/QuizService";
import { QuizRepository } from "../Repository/QuizRepository";
import { DatabaseConnection } from "../Database/Database";
import { AppError } from "../utils/AppError";

export class QuizService implements IQuizService {
  private client: MongoClient;
  private database: Db;
  private quizRepo: QuizRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.quizRepo = new QuizRepository(this.database);
  }

  async listPublished() {
    return this.quizRepo.listPublished();
  }

  async listAll() {
    return this.quizRepo.listAll();
  }

  async listByScope(scopeType: string, scopeId?: string) {
    return this.quizRepo.listByScope(scopeType, scopeId);
  }

  async getById(id: string) {
    return this.quizRepo.findById(id);
  }

  async create(data: Omit<Quiz, "_id">) {
    return this.quizRepo.create(data);
  }

  async update(id: string, data: Partial<Quiz>) {
    return this.quizRepo.update(id, data);
  }

  async remove(id: string) {
    // Kiểm tra ràng buộc câu hỏi
    const questionCount = await this.database.collection("questions").countDocuments({ 
      quizId: new ObjectId(id) 
    });

    if (questionCount > 0) {
      throw new AppError(
        `Không thể xóa bài kiểm tra này vì vẫn còn ${questionCount} câu hỏi liên quan. Vui lòng xóa các câu hỏi trước.`,
        400
      );
    }

    await this.quizRepo.remove(id);
  }

  grade(questions: { correctAnswer: string }[], answers: string[]) {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score += 1;
      }
    });

    return { score, total: questions.length };
  }
}
