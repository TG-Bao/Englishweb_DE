import { Progress } from "../../Entity/Progress";

export interface IProgressService {
  getByUser(userId: string): Promise<Progress | null>;
  markVocabularyLearned(userId: string, topicId: string, vocabId: string): Promise<Progress>;
  markGrammarLearned(userId: string, level: string, grammarId: string): Promise<Progress>;
  recordQuizResult(
    userId: string,
    quizId: string,
    score: number,
    total: number,
    percentage: number,
    passed: boolean
  ): Promise<Progress>;
  recordTopicQuizScore(userId: string, topicId: string, percentage: number, passed: boolean): Promise<Progress>;
}
