import { ObjectId } from "mongodb";
import { TopicProgress, LevelProgress, ProgressStatus, ProgressDocument } from "../models/Progress";
import { IProgressService } from "../interfaces/services/ProgressService";
import { IProgressRepository } from "../interfaces/repositories/ProgressRepository";
import { ITopicRepository } from "../interfaces/repositories/TopicRepository";
import { IVocabularyRepository } from "../interfaces/repositories/VocabularyRepository";
import { IQuizRepository } from "../interfaces/repositories/QuizRepository";

export class ProgressService implements IProgressService {
  constructor(
    private progressRepo: IProgressRepository,
    private topicRepo: ITopicRepository,
    private vocabRepo: IVocabularyRepository,
    private quizRepo: IQuizRepository
  ) {}

  getByUser(userId: string) {
    return this.progressRepo.getByUserId(userId);
  }

  private async ensureProgress(userId: string): Promise<ProgressDocument> {
    const current = await this.progressRepo.getByUserId(userId);
    if (current) return current;

    return this.progressRepo.upsert(userId, { topicProgress: [], levelProgress: [], quizResults: [] });
  }

  private findTopicProgress(progress: ProgressDocument, topicId: string): TopicProgress | undefined {
    return progress.topicProgress.find(tp => tp.topicId.toString() === topicId);
  }

  private findLevelProgress(progress: ProgressDocument, level: string): LevelProgress | undefined {
    return progress.levelProgress.find(lp => lp.level === level);
  }

  private async ensureTopicProgress(userId: string, topicId: string): Promise<ProgressDocument> {
    const progress = await this.ensureProgress(userId);
    const existing = this.findTopicProgress(progress, topicId);

    if (!existing) {
      progress.topicProgress.push({
        topicId: new ObjectId(topicId),
        status: "IN_PROGRESS",
        vocabLearned: [],
        bestScore: 0,
        quizPassed: false
      });
      return this.progressRepo.upsert(userId, { topicProgress: progress.topicProgress });
    }

    return progress;
  }

  private async ensureLevelProgress(userId: string, level: string): Promise<ProgressDocument> {
    const progress = await this.ensureProgress(userId);
    const existing = this.findLevelProgress(progress, level);

    if (!existing) {
      progress.levelProgress.push({
        level,
        status: "IN_PROGRESS",
        grammarLearned: []
      });
      return this.progressRepo.upsert(userId, { levelProgress: progress.levelProgress });
    }

    return progress;
  }

  async markVocabularyLearned(userId: string, topicId: string, vocabId: string) {
    const progress = await this.ensureTopicProgress(userId, topicId);
    const topicProgress = this.findTopicProgress(progress, topicId);
    if (!topicProgress) return progress;

    if (!topicProgress.vocabLearned.find((id: ObjectId) => id.toString() === vocabId)) {
      topicProgress.vocabLearned.push(new ObjectId(vocabId));
    }

    const updated = await this.progressRepo.upsert(userId, {
      topicProgress: progress.topicProgress
    });
    await this.evaluateTopicCompletion(userId, topicId);
    return updated;
  }

  async markGrammarLearned(userId: string, level: string, grammarId: string) {
    // Để trống hoặc xử lý sau khi có hệ thống Grammar mới
    return this.ensureProgress(userId);
  }

  private async evaluateTopicCompletion(userId: string, topicId: string) {
    const progress = await this.ensureProgress(userId);
    const topicProgress = this.findTopicProgress(progress, topicId);
    if (!topicProgress) return progress;

    const vocab = await this.vocabRepo.list({ topicId });
    const quizzes = await this.quizRepo.listByScope("TOPIC", topicId);
    const quiz = quizzes[0];

    const vocabDone = vocab.length === 0 || topicProgress.vocabLearned.length >= vocab.length;
    const quizDone = !quiz || topicProgress.quizPassed;

    if (vocabDone && quizDone) {
      topicProgress.status = "COMPLETED";
      topicProgress.completedAt = new Date();
    } else {
      topicProgress.status = "IN_PROGRESS";
    }

    return this.progressRepo.upsert(userId, {
      topicProgress: progress.topicProgress
    });
  }

  private async evaluateLevelCompletion(userId: string, level: string) {
    const progress = await this.ensureProgress(userId);
    const levelProgress = this.findLevelProgress(progress, level);
    if (!levelProgress) return progress;

    // Tạm thời đánh dấu là xong nếu không có logic Grammar cũ
    levelProgress.status = "COMPLETED";
    levelProgress.completedAt = new Date();

    return this.progressRepo.upsert(userId, {
      levelProgress: progress.levelProgress
    });
  }

  async recordQuizResult(userId: string, quizId: string, score: number, total: number, percentage: number, passed: boolean) {
    const progress = await this.ensureProgress(userId);
    progress.quizResults.unshift({
      quizId: new ObjectId(quizId),
      score,
      total,
      percentage,
      passed,
      takenAt: new Date()
    });

    return this.progressRepo.upsert(userId, {
      quizResults: progress.quizResults
    });
  }

  async recordTopicQuizScore(userId: string, topicId: string, percentage: number, passed: boolean) {
    const progress = await this.ensureTopicProgress(userId, topicId);
    const topicProgress = this.findTopicProgress(progress, topicId);
    if (!topicProgress) return progress;

    topicProgress.bestScore = Math.max(topicProgress.bestScore || 0, percentage);
    topicProgress.quizPassed = passed;

    const updated = await this.progressRepo.upsert(userId, {
      topicProgress: progress.topicProgress
    });

    await this.evaluateTopicCompletion(userId, topicId);
    return updated;
  }
}
