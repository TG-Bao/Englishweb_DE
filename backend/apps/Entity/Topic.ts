import { ObjectId } from "mongodb";

export class Topic {
  _id?: ObjectId;
  title!: string;
  description?: string;
  theory?: string;
  examples?: string[];
  order!: number;
  level!: string;
  isPublished!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const TOPIC_COLLECTION = "grammar_topics";
