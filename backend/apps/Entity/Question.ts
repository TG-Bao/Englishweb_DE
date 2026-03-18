import { ObjectId } from "mongodb";

export type QuestionType = "MCQ" | "FILL" | "LISTEN";
export type QuestionSourceType = "VOCAB" | "CUSTOM";

export class Question {
  _id?: ObjectId;
  quizId!: ObjectId;
  sourceType!: QuestionSourceType;
  sourceId?: ObjectId;
  question!: string;
  options!: string[];
  correctAnswer!: string;
  type!: QuestionType;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const QUESTION_COLLECTION = "questions";
