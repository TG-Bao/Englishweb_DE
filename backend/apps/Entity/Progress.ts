import { ObjectId } from "mongodb";

export type ProgressStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

export class QuizResult {
  quizId!: ObjectId;
  score!: number;
  total!: number;
  percentage!: number;
  passed!: boolean;
  takenAt!: Date;
}

export class TopicProgress {
  topicId!: ObjectId;
  status!: ProgressStatus;
  vocabLearned!: ObjectId[];
  bestScore!: number;
  quizPassed!: boolean;
  completedAt?: Date;
}

export class LevelProgress {
  level!: string;
  grammarLearned!: ObjectId[];
  status!: ProgressStatus;
  completedAt?: Date;
}

export class SpeakingProgress {
  sentenceId!: ObjectId;
  lessonId!: ObjectId;
  audioUrl!: string;
  expected?: string;
  transcript?: string;
  accuracy?: number;
  isCompleted!: boolean;
  recordedAt!: Date;
}

export class Progress {
  _id?: ObjectId;
  userId!: ObjectId;
  topicProgress!: TopicProgress[];
  levelProgress!: LevelProgress[];
  speakingProgress!: SpeakingProgress[];
  quizResults!: QuizResult[];
  grammarProgress?: any[];
  checkInDates?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const PROGRESS_COLLECTION = "progress";
