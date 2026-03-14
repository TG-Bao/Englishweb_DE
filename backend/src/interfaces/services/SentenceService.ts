import { SentenceDocument } from "../../models/Sentence";
import { CreateSentenceDto, UpdateSentenceDto } from "../../dtos/sentenceDtos";

export interface ISentenceService {
  listSentences(): Promise<SentenceDocument[]>;
  getSentenceById(id: string): Promise<SentenceDocument | null>;
  createSentence(data: CreateSentenceDto): Promise<SentenceDocument>;
  updateSentence(id: string, data: UpdateSentenceDto): Promise<SentenceDocument | null>;
  deleteSentence(id: string): Promise<boolean>;
}