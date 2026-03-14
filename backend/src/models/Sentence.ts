import { ObjectId } from "mongodb";

export const SENTENCE_COLLECTION = "sentences";

export interface SentenceDocument {
  _id?: ObjectId;
  text: string;
  audioUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
