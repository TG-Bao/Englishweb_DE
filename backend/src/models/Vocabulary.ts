import { ObjectId } from "mongodb";

export interface VocabularyDocument {
  _id?: ObjectId;
  topicId: ObjectId;
  word: string;
  meaning: string;
  definitionVi?: string;
  phonetic?: string;
  audioUrl?: string;
  example: string;
  exampleVi?: string;
  topic: string;
  level: string;
  learned?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const VOCABULARY_COLLECTION = "vocabularies";
