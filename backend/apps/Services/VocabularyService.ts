import { MongoClient, Db } from "mongodb";
import { Vocabulary } from "../Entity/Vocabulary";
import { IVocabularyService } from "../interfaces/services/VocabularyService";
import { VocabularyRepository } from "../Repository/VocabularyRepository";
import { DatabaseConnection } from "../Database/Database";

export class VocabularyService implements IVocabularyService {
  private client: MongoClient;
  private database: Db;
  private vocabRepo: VocabularyRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.vocabRepo = new VocabularyRepository(this.database);
  }

  async list(filters: any) {
    return this.vocabRepo.list(filters);
  }

  async findById(id: string) {
    return this.vocabRepo.findById(id);
  }

  async create(data: Omit<Vocabulary, "_id">) {
    return this.vocabRepo.create(data);
  }

  async update(id: string, data: Partial<Vocabulary>) {
    return this.vocabRepo.update(id, data);
  }

  async remove(id: string) {
    return this.vocabRepo.remove(id);
  }
}
