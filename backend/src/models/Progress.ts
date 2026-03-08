import { ObjectId } from "mongodb";

export type ProgressStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

export interface QuizResult {
  quizId: ObjectId;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  takenAt: Date;
}

export interface TopicProgress {
  topicId: ObjectId;
  status: ProgressStatus;
  vocabLearned: ObjectId[];
  bestScore: number;
  quizPassed: boolean;
  completedAt?: Date;
}

export interface LevelProgress {
  level: string;
  grammarLearned: ObjectId[];
  status: ProgressStatus;
  completedAt?: Date;
}

export interface ProgressDocument {
  _id?: ObjectId;
  userId: ObjectId;
  topicProgress: TopicProgress[];
  levelProgress: LevelProgress[];
  quizResults: QuizResult[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const PROGRESS_COLLECTION = "progress";
