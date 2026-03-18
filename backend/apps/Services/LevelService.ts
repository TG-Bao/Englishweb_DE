import { MongoClient, Db } from "mongodb";
import { Level } from "../Entity/Level";
import { ILevelService } from "../interfaces/services/LevelService";
import { LevelRepository } from "../Repository/LevelRepository";
import { DatabaseConnection } from "../Database/Database";

export class LevelService implements ILevelService {
  private client: MongoClient;
  private database: Db;
  private levelRepo: LevelRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.levelRepo = new LevelRepository(this.database);
  }

  async listPublished() {
    return this.levelRepo.listPublished();
  }

  async listAll() {
    return this.levelRepo.listAll();
  }

  async getById(id: string) {
    return this.levelRepo.findById(id);
  }

  async create(data: Omit<Level, "_id">) {
    return this.levelRepo.create(data);
  }

  async update(id: string, data: Partial<Level>) {
    return this.levelRepo.update(id, data);
  }

  async remove(id: string) {
    await this.levelRepo.remove(id);
  }
}
