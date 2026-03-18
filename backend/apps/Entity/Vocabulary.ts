import { ObjectId } from "mongodb";

export class Vocabulary {
  _id?: ObjectId;
  topicId!: ObjectId;
  word!: string;
  meaning!: string;
  definitionVi?: string;
  phonetic?: string;
  audioUrl?: string;
  example!: string;
  exampleVi?: string;
  topic!: string;
  level!: string;
  learned?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const VOCABULARY_COLLECTION = "vocabularies";
