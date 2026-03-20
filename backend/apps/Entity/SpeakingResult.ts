import { ObjectId } from "mongodb";

export class SpeakingResult {
  _id?: ObjectId;
  user_id!: ObjectId;
  sentence_id!: ObjectId;
  transcript?: string;
  score!: number;
  createdAt?: Date;

  constructor(data: Partial<SpeakingResult>) {
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
  }
}

export const SPEAKING_RESULT_COLLECTION = "speaking_results";
