import { MongoClient, Db, ObjectId } from "mongodb";
import { Grammar } from "../Entity/Grammar";
import { IGrammarService } from "../interfaces/services/GrammarService";
import { GrammarRepository } from "../Repository/GrammarRepository";
import { DatabaseConnection } from "../Database/Database";
import { AppError } from "../utils/AppError";

export class GrammarService implements IGrammarService {
  private client: MongoClient;
  private database: Db;
  private grammarRepo: GrammarRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.grammarRepo = new GrammarRepository(this.database);
  }

  async listByLevel(level: string): Promise<Grammar[]> {
    return this.grammarRepo.listByLevel(level);
  }

  async findById(id: string): Promise<Grammar | null> {
    return this.grammarRepo.findById(id);
  }

  async create(data: Omit<Grammar, "_id">): Promise<Grammar> {
    return this.grammarRepo.create(data);
  }

  async update(id: string, data: Partial<Grammar>): Promise<Grammar | null> {
    return this.grammarRepo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    // Kiểm tra ràng buộc bài tập ngữ pháp
    const exerciseCount = await this.database.collection("grammar_exercises").countDocuments({ 
      grammarId: new ObjectId(id) 
    });

    if (exerciseCount > 0) {
      throw new AppError(
        `Không thể xóa nội dung ngữ pháp này vì vẫn còn ${exerciseCount} bài tập liên quan. Vui lòng xóa các bài tập trước.`,
        400
      );
    }

    await this.grammarRepo.remove(id);
  }
}
