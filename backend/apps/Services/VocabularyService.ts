import { MongoClient, Db } from "mongodb";
import { Vocabulary } from "../Entity/Vocabulary";
import { IVocabularyService } from "../interfaces/services/VocabularyService";
import { VocabularyRepository } from "../Repository/VocabularyRepository";
import { DatabaseConnection } from "../Database/Database";
import { TTSService } from "./TTSService";

export class VocabularyService implements IVocabularyService {
  private client: MongoClient;
  private database: Db;
  private vocabRepo: VocabularyRepository;
  private ttsService: TTSService;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.vocabRepo = new VocabularyRepository(this.database);
    this.ttsService = new TTSService();
  }

  async list(filters: any) {
    return this.vocabRepo.list(filters);
  }

  async findById(id: string) {
    return this.vocabRepo.findById(id);
  }

  async create(data: Omit<Vocabulary, "_id">) {
    // Tự động tạo âm thanh nếu có word mà chưa có audioUrl
    if (data.word && !data.audioUrl) {
      try {
        const audioData = await this.ttsService.textToSpeech(data.word, "en");
        data.audioUrl = audioData;
      } catch (error) {
        console.error("Vocabulary TTS Error:", error);
      }
    }
    return this.vocabRepo.create(data);
  }

  async update(id: string, data: Partial<Vocabulary>) {
    // Tự động cập nhật lại âm thanh nếu word thay đổi và không truyền audioUrl mới
    if (data.word && !data.audioUrl) {
      try {
        const audioData = await this.ttsService.textToSpeech(data.word, "en");
        data.audioUrl = audioData;
      } catch (error) {
        console.error("Vocabulary TTS Error:", error);
      }
    }
    return this.vocabRepo.update(id, data);
  }

  async remove(id: string) {
    return this.vocabRepo.remove(id);
  }
}
