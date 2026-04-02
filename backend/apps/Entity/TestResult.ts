import { ObjectId } from "mongodb";

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}

export class TestResult {
  _id?: ObjectId;
  userId!: ObjectId;
  testId!: ObjectId;
  totalQuestions!: number;
  correctCount!: number;
  score!: number; // Percentage 0-100
  xpEarned!: number;
  answers!: UserAnswer[]; // Detail answers
  completedAt?: Date;

  constructor() {}
}

export const TEST_RESULT_COLLECTION = "test_results";
