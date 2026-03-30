import { MongoClient, Db, ObjectId } from "mongodb";
import { IProgressService } from "../interfaces/services/ProgressService";
import { ProgressRepository } from "../Repository/ProgressRepository";
import { TopicRepository } from "../Repository/TopicRepository";
import { VocabularyRepository } from "../Repository/VocabularyRepository";
import { QuizRepository } from "../Repository/QuizRepository";
import { DatabaseConnection } from "../Database/Database";
import { Progress, TopicProgress, LevelProgress } from "../Entity/Progress";

export class ProgressService implements IProgressService {
  private client: MongoClient;
  private database: Db;
  private progressRepo: ProgressRepository;
  private topicRepo: TopicRepository;
  private vocabRepo: VocabularyRepository;
  private quizRepo: QuizRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.progressRepo = new ProgressRepository(this.database);
    this.topicRepo = new TopicRepository(this.database);
    this.vocabRepo = new VocabularyRepository(this.database);
    this.quizRepo = new QuizRepository(this.database);
  }

  async getByUser(userId: string) {
    const progress = await this.progressRepo.getByUserId(userId);
    if (!progress || !progress.quizResults || progress.quizResults.length === 0) {
      return progress;
    }

    // Join quiz titles using existing findById
    const quizResultPromises = progress.quizResults.map(async (qr) => {
      const quiz = await this.quizRepo.findById(qr.quizId.toString());
      return {
        ...qr,
        quizTitle: quiz?.title || "Bài kiểm tra"
      };
    });

    const quizResultsWithTitles = await Promise.all(quizResultPromises);

    return {
      ...progress,
      quizResults: quizResultsWithTitles
    };
  }

  private async ensureProgress(userId: string): Promise<Progress> {
    const current = await this.progressRepo.getByUserId(userId);
    if (current) return current;

    return this.progressRepo.upsert(userId, { topicProgress: [], levelProgress: [], quizResults: [] });
  }

  private findTopicProgress(progress: Progress, topicId: string): TopicProgress | undefined {
    return progress.topicProgress.find(tp => tp.topicId.toString() === topicId);
  }

  private async ensureTopicProgress(userId: string, topicId: string): Promise<Progress> {
    const progress = await this.ensureProgress(userId);
    const existing = this.findTopicProgress(progress, topicId);

    if (!existing) {
      progress.topicProgress.push({
        topicId: new ObjectId(topicId),
        status: "IN_PROGRESS" as any,
        vocabLearned: [],
        bestScore: 0,
        quizPassed: false
      });
      return this.progressRepo.upsert(userId, { topicProgress: progress.topicProgress });
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

    // Evaluate status
    const vocab = await this.vocabRepo.list({ topicId });
    const quizzes = await this.quizRepo.listByScope("TOPIC", topicId);
    const quiz = quizzes[0];
    const vocabDone = vocab.length === 0 || topicProgress.vocabLearned.length >= vocab.length;
    const quizDone = !quiz || topicProgress.quizPassed;

    if (vocabDone && quizDone) {
      topicProgress.status = "COMPLETED" as any;
      topicProgress.completedAt = new Date();
      await this.progressRepo.upsert(userId, { topicProgress: progress.topicProgress });
    }

    return updated;
  }

  async toggleVocabularyLearned(userId: string, vocabId: string) {
    const vocab = await this.vocabRepo.findById(vocabId);
    if (!vocab) throw new Error("Vocabulary not found");
    const topicId = vocab.topicId.toString();

    const progress = await this.ensureTopicProgress(userId, topicId);
    const tp = progress.topicProgress.find(p => p.topicId.toString() === topicId);
    if (!tp) throw new Error("Failed to ensure topic progress");

    const vId = new ObjectId(vocabId);
    const index = tp.vocabLearned.findIndex((id: ObjectId) => id.toString() === vocabId);
    let isLearned = false;

    if (index === -1) {
      tp.vocabLearned.push(vId);
      isLearned = true;
    } else {
      tp.vocabLearned.splice(index, 1);
      isLearned = false;
    }

    const updated = await this.progressRepo.upsert(userId, {
      topicProgress: progress.topicProgress
    });

    if (isLearned) {
      const vocabList = await this.vocabRepo.list({ topicId });
      const quizzes = await this.quizRepo.listByScope("TOPIC", topicId);
      const quiz = quizzes[0];
      const vocabDone = vocabList.length === 0 || tp.vocabLearned.length >= vocabList.length;
      const quizDone = !quiz || tp.quizPassed;

      if (vocabDone && quizDone) {
        tp.status = "COMPLETED" as any;
        tp.completedAt = new Date();
        await this.progressRepo.upsert(userId, { topicProgress: progress.topicProgress });
      }
    }

    return { progress: updated, learned: isLearned };
  }

  async markGrammarLearned(userId: string, level: string, grammarId: string, status: string = "COMPLETED") {
    const progress = await this.ensureProgress(userId);
    
    if (!progress.grammarProgress) {
      progress.grammarProgress = [];
    }
    
    const existing = progress.grammarProgress.find((p: any) => p.grammarId.toString() === grammarId);
    
    if (!existing) {
      progress.grammarProgress.push({
        grammarId: new ObjectId(grammarId),
        status: status as any,
        completedAt: status === "COMPLETED" ? new Date() : undefined
      } as any);
    } else {
      existing.status = status as any;
      if (status === "COMPLETED") {
        existing.completedAt = new Date();
      }
    }
    
    return this.progressRepo.upsert(userId, { grammarProgress: progress.grammarProgress });
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

    await this.progressRepo.upsert(userId, {
      topicProgress: progress.topicProgress
    });

    // Evaluate completion
    const vocab = await this.vocabRepo.list({ topicId });
    const vocabDone = vocab.length === 0 || topicProgress.vocabLearned.length >= vocab.length;
    const quizDone = passed; // The one we just recorded

    if (vocabDone && quizDone) {
      topicProgress.status = "COMPLETED" as any;
      topicProgress.completedAt = new Date();
      await this.progressRepo.upsert(userId, { topicProgress: progress.topicProgress });
    }

    return progress;
  }
}
