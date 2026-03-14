import { SentenceDocument } from "../../models/Sentence";

export interface ISentenceRepository {
  list(): Promise<SentenceDocument[]>;
  findById(id: string): Promise<SentenceDocument | null>;
  create(data: Omit<SentenceDocument, "_id">): Promise<SentenceDocument>;
  update(id: string, data: Partial<SentenceDocument>): Promise<SentenceDocument | null>;
  delete(id: string): Promise<boolean>;
}
