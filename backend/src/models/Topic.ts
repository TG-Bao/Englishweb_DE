import { ObjectId } from "mongodb";

export interface TopicDocument {
  _id?: ObjectId;
  title: string;
  description?: string;
  theory?: string;
  examples?: string[];
  order: number;
  level: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const TOPIC_COLLECTION = "grammar_topics";
