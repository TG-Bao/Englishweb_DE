import { ObjectId } from "mongodb";
import { EngLevel } from "./User";

export type TestQuestionType = "MCQ" | "FILL";

export interface TestQuestion {
  id: string; // Internal ID for the UI
  question: string;
  type: TestQuestionType;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation?: string;
}

export class Test {
  _id?: ObjectId;
  title!: string;
  description!: string;
  level!: EngLevel;
  questions!: TestQuestion[];
  timeLimit?: number; // In minutes
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const TEST_COLLECTION = "tests";
