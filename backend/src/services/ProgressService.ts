import { ObjectId } from "mongodb";
import { LessonProgress, LessonStatus, ProgressDocument } from "../models/Progress";
import { IProgressService } from "../interfaces/services/ProgressService";
import { IProgressRepository } from "../interfaces/repositories/ProgressRepository";
import { ILessonRepository } from "../interfaces/repositories/LessonRepository";
import { IVocabularyRepository } from "../interfaces/repositories/VocabularyRepository";
import { IGrammarRepository } from "../interfaces/repositories/GrammarRepository";
import { IQuizRepository } from "../interfaces/repositories/QuizRepository";

export class ProgressService implements IProgressService {
  constructor(
    private progressRepo: IProgressRepository,
    private lessonRepo: ILessonRepository,
    private vocabRepo: IVocabularyRepository,
    private grammarRepo: IGrammarRepository,
    private quizRepo: IQuizRepository
  ) {}

  getByUser(userId: string) {
    return this.progressRepo.getByUserId(userId);
  }

  private async ensureProgress(userId: string): Promise<ProgressDocument> {
    const current = await this.progressRepo.getByUserId(userId);
    if (current) return current;

    return this.progressRepo.upsert(userId, { lessonProgress: [], topicProgress: [], quizResults: [] });
  }

  private findLessonProgress(progress: ProgressDocument, lessonId: string): LessonProgress | undefined {
    return progress.lessonProgress.find(lp => lp.lessonId.toString() === lessonId);
  }

  private async ensureLessonProgress(userId: string, lessonId: string): Promise<ProgressDocument> {
    const progress = await this.ensureProgress(userId);
    const existing = this.findLessonProgress(progress, lessonId);

    if (!existing) {
      progress.lessonProgress.push({
        lessonId: new ObjectId(lessonId),
        status: "IN_PROGRESS",
        vocabLearned: [],
        grammarLearned: [],
        bestScore: 0,
        quizPassed: false
      });
    }

    return this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  async markVocabularyLearned(userId: string, lessonId: string, vocabId: string) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    if (!lessonProgress.vocabLearned.find(id => id.toString() === vocabId)) {
      lessonProgress.vocabLearned.push(new ObjectId(vocabId));
    }

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
    await this.evaluateLessonCompletion(userId, lessonId);
    return updated;
  }

  async markGrammarLearned(userId: string, lessonId: string, grammarId: string) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    if (!lessonProgress.grammarLearned.find(id => id.toString() === grammarId)) {
      lessonProgress.grammarLearned.push(new ObjectId(grammarId));
    }

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
    await this.evaluateLessonCompletion(userId, lessonId);
    return updated;
  }

  private async updateTopicProgress(userId: string, topicId: string) {
    const progress = await this.ensureProgress(userId);
    const lessons = await this.lessonRepo.listByTopic(topicId, false);
    const totalLessons = lessons.length;

    const completedLessons = lessons.filter(lesson => {
      const lp = progress.lessonProgress.find(p => p.lessonId.toString() === lesson._id!.toString());
      return lp?.status === "COMPLETED";
    }).length;

    let status: LessonStatus = "IN_PROGRESS";
    const anyStarted = progress.lessonProgress.some(p => {
      const lesson = lessons.find(l => l._id!.toString() === p.lessonId.toString());
      return lesson && p.status !== "LOCKED";
    });
    if (completedLessons === 0 && !anyStarted) status = "LOCKED";
    if (completedLessons === totalLessons && totalLessons > 0) status = "COMPLETED";

    const existing = progress.topicProgress.find(tp => tp.topicId.toString() === topicId);
    if (existing) {
      existing.completedLessons = completedLessons;
      existing.totalLessons = totalLessons;
      existing.status = status;
      existing.completedAt = status === "COMPLETED" ? new Date() : undefined;
    } else {
      progress.topicProgress.push({
        topicId: new ObjectId(topicId),
        completedLessons,
        totalLessons,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined
      });
    }

    return this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  private async evaluateLessonCompletion(userId: string, lessonId: string) {
    const progress = await this.ensureProgress(userId);
    const lesson = await this.lessonRepo.findById(lessonId);
    if (!lesson) return progress;

    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    const vocab = await this.vocabRepo.listByLesson(lessonId);
    const grammar = await this.grammarRepo.listByLesson(lessonId);
    const quizzes = await this.quizRepo.listByScope("LESSON", lessonId);
    const quiz = quizzes[0];

    const vocabDone = vocab.length === 0 || lessonProgress.vocabLearned.length >= vocab.length;
    const grammarDone = grammar.length === 0 || lessonProgress.grammarLearned.length >= grammar.length;
    const quizDone = !quiz || lessonProgress.quizPassed;

    if (vocabDone && grammarDone && quizDone) {
      lessonProgress.status = "COMPLETED";
    } else {
      lessonProgress.status = "IN_PROGRESS";
    }

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });

    await this.updateTopicProgress(userId, lesson.topicId.toString());
    return updated;
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
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });
  }

  async recordLessonQuizScore(userId: string, lessonId: string, percentage: number, passed: boolean) {
    const progress = await this.ensureLessonProgress(userId, lessonId);
    const lessonProgress = this.findLessonProgress(progress, lessonId);
    if (!lessonProgress) return progress;

    lessonProgress.bestScore = Math.max(lessonProgress.bestScore || 0, percentage);
    lessonProgress.quizPassed = passed;

    const updated = await this.progressRepo.upsert(userId, {
      lessonProgress: progress.lessonProgress,
      topicProgress: progress.topicProgress,
      quizResults: progress.quizResults
    });

    await this.evaluateLessonCompletion(userId, lessonId);
    return updated;
  }
}
