import { MongoClient, Db, ObjectId } from "mongodb";
import { Lesson } from "../Entity/Lesson";
import { ILessonService } from "../interfaces/services/LessonService";
import { LessonRepository } from "../Repository/LessonRepository";
import { DatabaseConnection } from "../Database/Database";
import { AppError } from "../utils/AppError";

export class LessonService implements ILessonService {
  private client: MongoClient;
  private database: Db;
  private lessonRepo: LessonRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.lessonRepo = new LessonRepository(this.database);
  }

  async list() {
    return this.lessonRepo.list();
  }

  async listByLevel(levelId: string) {
    return this.lessonRepo.listByLevel(levelId);
  }

  async findById(id: string) {
    return this.lessonRepo.findById(id);
  }

  async create(data: Omit<Lesson, "_id">) {
    return this.lessonRepo.create(data);
  }

  async update(id: string, data: Partial<Lesson>) {
    return this.lessonRepo.update(id, data);
  }

  async remove(id: string) {
    // Kiểm tra ràng buộc câu văn
    const sentenceCount = await this.database.collection("sentences").countDocuments({ 
      lesson_id: new ObjectId(id) 
    });

    if (sentenceCount > 0) {
      throw new AppError(
        `Không thể xóa bài học này vì vẫn còn ${sentenceCount} câu văn liên quan. Vui lòng xóa các câu văn trước.`,
        400
      );
    }

    await this.lessonRepo.remove(id);
  }
}
