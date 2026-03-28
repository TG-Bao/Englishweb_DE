import { MongoClient, Db, ObjectId } from "mongodb";
import { IStatisticsService, UserStats } from "../interfaces/services/StatisticsService";
import { UserRepository } from "../Repository/UserRepository";
import { ProgressRepository } from "../Repository/ProgressRepository";
import { LevelRepository } from "../Repository/LevelRepository";
import { DatabaseConnection } from "../Database/Database";
import { UserSafeView } from "../interfaces/services/UserService";
import { AppError } from "../utils/AppError";

export class StatisticsService implements IStatisticsService {
  private client: MongoClient;
  private database: Db;
  private userRepo: UserRepository;
  private progressRepo: ProgressRepository;
  private levelRepo: LevelRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.userRepo = new UserRepository(this.database);
    this.progressRepo = new ProgressRepository(this.database);
    this.levelRepo = new LevelRepository(this.database);
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const progress = await this.progressRepo.getByUserId(userId);

    // 1. Tính số topic đã hoàn thành
    const completedTopicsCount = progress?.topicProgress.filter(tp => tp.status === "COMPLETED").length || 0;

    // 2. Tính số từ vựng đã học (tổng length của vocabLearned trong topicProgress)
    const vocabLearnedCount = progress?.topicProgress.reduce((acc, tp) => acc + (tp.vocabLearned?.length || 0), 0) || 0;

    // 3. Tính % hoàn thành level hiện tại
    const levels = await this.levelRepo.listPublished();
    const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

    const userPoints = user.points || 0;
    const currentLevelName = user.level || "A1";

    const currentLevelIndex = sortedLevels.findIndex(l => l.name === currentLevelName);
    const nextLevel = currentLevelIndex !== -1 && currentLevelIndex < sortedLevels.length - 1
      ? sortedLevels[currentLevelIndex + 1]
      : null;

    const currentLevelObj = currentLevelIndex !== -1 ? sortedLevels[currentLevelIndex] : sortedLevels[0];

    let xpProgressPercentage = 0;
    if (nextLevel) {
      const minXP = currentLevelObj.minPoints || 0;
      const maxXP = nextLevel.minPoints || 0;

      if (userPoints >= maxXP) {
        xpProgressPercentage = 100;
      } else if (userPoints <= minXP) {
        xpProgressPercentage = 0;
      } else {
        xpProgressPercentage = Math.round(((userPoints - minXP) / (maxXP - minXP)) * 100);
      }
    } else {
      xpProgressPercentage = 100;
    }

    return {
      completedTopicsCount,
      vocabLearnedCount,
      currentPoints: userPoints,
      currentLevel: currentLevelName,
      nextLevel: nextLevel?.name,
      xpProgressPercentage
    };
  }

  async getLeaderboard(limit: number = 10): Promise<UserSafeView[]> {
    const users = await this.database.collection("users")
      .find({ role: "USER" }, { projection: { password: 0 } })
      .sort({ points: -1 })
      .limit(limit)
      .toArray();

    return users.map(u => ({
      ...u,
      _id: u._id.toString()
    })) as unknown as UserSafeView[];
  }
}
