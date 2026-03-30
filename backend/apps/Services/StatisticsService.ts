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

    // 4. Tính Streak và Badges
    const allActivityDates = new Set<string>();
    
    // Thêm ngày từ quiz results
    progress?.quizResults?.forEach(q => {
      allActivityDates.add(new Date(q.takenAt).toDateString());
    });

    // Thêm ngày từ topic completion
    progress?.topicProgress?.forEach(tp => {
      if (tp.completedAt) {
        allActivityDates.add(new Date(tp.completedAt).toDateString());
      }
    });

    // Thêm ngày từ speaking progress
    progress?.speakingProgress?.forEach(sp => {
      allActivityDates.add(new Date(sp.recordedAt).toDateString());
    });

    // Tính streak (các ngày liên tiếp tính từ hôm nay/hôm qua ngược về trước)
    const sortedDates = Array.from(allActivityDates)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let learningStreak = 0;
    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActivityDate = new Date(sortedDates[0]);
      lastActivityDate.setHours(0, 0, 0, 0);

      const diffInDays = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

      // Chỉ tính streak nếu có hoạt động trong hôm nay hoặc hôm qua
      if (diffInDays <= 1) {
        learningStreak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const current = new Date(sortedDates[i]);
          const next = new Date(sortedDates[i + 1]);
          current.setHours(0, 0, 0, 0);
          next.setHours(0, 0, 0, 0);

          const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            learningStreak++;
          } else if (diff > 0) {
            break;
          }
        }
      }
    }

    // Tính Badge dựa trên level
    const badgeMap: Record<string, string> = {
      "A1": "A1 Explorer",
      "A2": "A2 Achiever",
      "B1": "B1 Intermediate",
      "B2": "B2 Advanced",
      "C1": "C1 Mastery",
      "C2": "C2 Expert"
    };

    const badges: string[] = [];
    const currentLevelRank = sortedLevels.findIndex(l => l.name === currentLevelName);
    for (let i = 0; i <= currentLevelRank; i++) {
      const levelName = sortedLevels[i].name;
      if (badgeMap[levelName]) {
        badges.push(badgeMap[levelName]);
      }
    }

    // 5. Tính thứ hạng (Rank)
    const allUsers = await this.database.collection("users")
      .find({ role: "USER" })
      .sort({ points: -1 })
      .toArray();
    
    const userRank = allUsers.findIndex(u => u._id.toString() === userId) + 1;

    return {
      completedTopicsCount,
      vocabLearnedCount,
      currentPoints: userPoints,
      currentLevel: currentLevelName,
      nextLevel: nextLevel?.name,
      xpProgressPercentage,
      learningStreak,
      badges,
      rank: userRank || 0
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
