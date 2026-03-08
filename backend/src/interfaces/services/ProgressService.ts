import { ProgressDocument } from "../../models/Progress";

export interface IProgressService {
  getByUser(userId: string): Promise<ProgressDocument | null>;
  markVocabularyLearned(userId: string, topicId: string, vocabId: string): Promise<ProgressDocument>;
  markGrammarLearned(userId: string, level: string, grammarId: string): Promise<ProgressDocument>;
  recordQuizResult(
    userId: string,
    quizId: string,
    score: number,
    total: number,
    percentage: number,
    passed: boolean
  ): Promise<ProgressDocument>;
  recordTopicQuizScore(userId: string, topicId: string, percentage: number, passed: boolean): Promise<ProgressDocument>;
}
