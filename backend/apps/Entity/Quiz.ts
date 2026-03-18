import { ObjectId } from "mongodb";

export type QuizScopeType = "TOPIC" | "LEVEL" | "GRAMMAR";

export class Quiz {
  _id?: ObjectId;
  scopeType!: QuizScopeType;
  scopeId?: ObjectId;
  title!: string;
  passScore!: number;
  isPublished!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const QUIZ_COLLECTION = "quizzes";
