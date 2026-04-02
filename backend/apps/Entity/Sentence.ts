import { ObjectId } from "mongodb";

export class Sentence {
  _id?: ObjectId;
  lesson_id!: ObjectId;
  text!: string;
  type!: "speaking" | "listening";
  audio_url?: string;
  order!: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Sentence>) {
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
}

export const SENTENCE_COLLECTION = "sentences";
