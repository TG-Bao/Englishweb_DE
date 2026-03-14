import { SentenceDocument } from "../models/Sentence";
import { CreateSentenceDto, UpdateSentenceDto } from "../dtos/sentenceDtos";
import { ISentenceService } from "../interfaces/services/SentenceService";
import { ISentenceRepository } from "../interfaces/repositories/SentenceRepository";

export class SentenceService implements ISentenceService {
  private sentenceRepository: ISentenceRepository;

  constructor(sentenceRepository: ISentenceRepository) {
    this.sentenceRepository = sentenceRepository;
  }

  async listSentences(): Promise<SentenceDocument[]> {
    return this.sentenceRepository.list();
  }

  async getSentenceById(id: string): Promise<SentenceDocument | null> {
    return this.sentenceRepository.findById(id);
  }

  async createSentence(data: CreateSentenceDto): Promise<SentenceDocument> {
    return this.sentenceRepository.create(data);
  }

  async updateSentence(id: string, data: UpdateSentenceDto): Promise<SentenceDocument | null> {
    return this.sentenceRepository.update(id, data);
  }

  async deleteSentence(id: string): Promise<boolean> {
    return this.sentenceRepository.delete(id);
  }
}