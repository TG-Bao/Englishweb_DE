import { MongoClient, Db } from "mongodb";
import { Sentence } from "../Entity/Sentence";
import { ISentenceService } from "../interfaces/services/SentenceService";
import { SentenceRepository } from "../Repository/SentenceRepository";
import { DatabaseConnection } from "../Database/Database";
import { TTSService } from "./TTSService";

export class SentenceService implements ISentenceService {
  private client: MongoClient;
  private database: Db;
  private sentenceRepo: SentenceRepository;
  private ttsService: TTSService;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.sentenceRepo = new SentenceRepository(this.database);
    this.ttsService = new TTSService();
  }

  async getSentencesByTopic(topicId: string) {
    // Sentences không trực tiếp liên kết topic, trả về empty hoặc tất cả
    return this.sentenceRepo.findByTopicId(topicId);
  }

  async getSentenceById(id: string) {
    return this.sentenceRepo.findById(id);
  }

  async list() {
    // Trả về tất cả sentences
    return this.sentenceRepo.findByLessonId("");
  }

  async findByLessonId(lessonId: string) {
    return this.sentenceRepo.findByLessonId(lessonId);
  }

  async findById(id: string) {
    return this.sentenceRepo.findById(id);
  }

  async create(data: Omit<Sentence, "_id" | "createdAt" | "updatedAt">) {
    // Nếu có text, tự động tạo audio
    if (data.text && !data.audio_url) {
      try {
        const audioUrl = await this.ttsService.textToSpeech(data.text, "en");
        data.audio_url = audioUrl;
      } catch (error) {
        console.error("TTS Error:", error);
        // Nếu TTS thất bại, vẫn tạo sentence nhưng không có audio
      }
    }
    return this.sentenceRepo.create(data);
  }

  async update(id: string, data: Partial<Sentence>) {
    // Nếu text được update, tạo lại audio
    if (data.text && !data.audio_url) {
      try {
        const audioUrl = await this.ttsService.textToSpeech(data.text, "en");
        data.audio_url = audioUrl;
      } catch (error) {
        console.error("TTS Error:", error);
      }
    }
    return this.sentenceRepo.update(id, data);
  }

  async remove(id: string) {
    return this.sentenceRepo.remove(id);
  }
}
