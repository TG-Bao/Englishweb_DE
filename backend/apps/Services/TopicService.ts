import { MongoClient, Db } from "mongodb";
import { Topic } from "../Entity/Topic";
import { ITopicService } from "../interfaces/services/TopicService";
import { TopicRepository } from "../Repository/TopicRepository";
import { DatabaseConnection } from "../Database/Database";

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
    await this.topicRepo.remove(id);
  }
}
