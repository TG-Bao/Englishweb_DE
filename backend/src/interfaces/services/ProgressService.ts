import { ProgressDocument } from "../../models/Progress";

export interface IProgressService {
  getByUser(userId: string): Promise<ProgressDocument | null>;
  markVocabularyLearned(userId: string, lessonId: string, vocabId: string): Promise<ProgressDocument>;
  markGrammarLearned(userId: string, lessonId: string, grammarId: string): Promise<ProgressDocument>;
  recordQuizResult(
    userId: string,
    quizId: string,
    score: number,
    total: number,
    percentage: number,
    passed: boolean
  ): Promise<ProgressDocument>;
  recordLessonQuizScore(userId: string, lessonId: string, percentage: number, passed: boolean): Promise<ProgressDocument>;
}
