import { MongoClient, Db, ObjectId } from "mongodb";
import { Topic } from "../Entity/Topic";
import { ITopicService } from "../interfaces/services/TopicService";
import { TopicRepository } from "../Repository/TopicRepository";
import { DatabaseConnection } from "../Database/Database";
import { AppError } from "../utils/AppError";

export class TopicService implements ITopicService {
  private client: MongoClient;
  private database: Db;
  private topicRepo: TopicRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.topicRepo = new TopicRepository(this.database);
  }

  async listPublished() {
    return this.topicRepo.listPublished();
  }

  async listAll() {
    return this.topicRepo.listAll();
  }

  async getById(id: string) {
    return this.topicRepo.findById(id);
  }

  async create(data: Omit<Topic, "_id">) {
    return this.topicRepo.create(data);
  }

  async update(id: string, data: Partial<Topic>) {
    return this.topicRepo.update(id, data);
  }

  async remove(id: string) {
    // 1. Kiểm tra ràng buộc từ vựng
    const vocabCount = await this.database.collection("vocabularies").countDocuments({ 
      topicId: new ObjectId(id) 
    });
    
    // 2. Kiểm tra ràng buộc bài kiểm tra
    const quizCount = await this.database.collection("quizzes").countDocuments({ 
      scopeId: new ObjectId(id),
      scopeType: "TOPIC"
    });

    if (vocabCount > 0 || quizCount > 0) {
      throw new AppError(
        `Không thể xóa chủ đề này vì vẫn còn ${vocabCount} từ vựng và ${quizCount} bài kiểm tra liên quan. Vui lòng chuyển hoặc xóa các nội dung này trước.`,
        400
      );
    }

    await this.topicRepo.remove(id);
  }
}
