import { MongoClient, Db } from "mongodb";
import { Lesson } from "../Entity/Lesson";
import { ILessonService } from "../interfaces/services/LessonService";
import { LessonRepository } from "../Repository/LessonRepository";
import { DatabaseConnection } from "../Database/Database";

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
    await this.lessonRepo.remove(id);
  }
}
