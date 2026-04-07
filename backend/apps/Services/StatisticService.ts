import { Db, ObjectId } from "mongodb";
import { DatabaseConnection } from "../Database/Database";
import { Progress } from "../Entity/Progress";
import { TEST_RESULT_COLLECTION } from "../Entity/TestResult";
import { USER_COLLECTION, User } from "../Entity/User";

export class StatisticService {
  private database: Db;

  constructor() {
    this.database = DatabaseConnection.getMongoClient().db();
  }

  async getUserStats(userId: string) {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid User ID");

    const user = await this.database.collection<User>(USER_COLLECTION).findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) throw new Error("User not found");

    // Aggregate Progress
    const progress = await this.database.collection("progress").findOne({ userId: new ObjectId(userId) });
    
    let completedTopicsCount = 0;
    let vocabLearnedCount = 0;
    let grammarLearnedCount = 0;
    let speakingPracticeCount = 0;
    let learningStreak = 0;
    let badges: string[] = [];

    if (progress) {
      completedTopicsCount = (progress.topicProgress || []).filter((p: any) => p.status === "COMPLETED").length;
      vocabLearnedCount = (progress.topicProgress || []).reduce((acc: number, p: any) => acc + (p.vocabLearned || []).length, 0);
      grammarLearnedCount = (progress.grammarProgress || []).filter((p: any) => p.status === "COMPLETED").length;
      speakingPracticeCount = (progress.speakingProgress || []).length;
      
      // Calculate Streak from quiz results and speaking practice dates
      const activityDates: Date[] = [
        ...(progress.quizResults || []).map((r: any) => new Date(r.takenAt)),
        ...(progress.speakingProgress || []).map((s: any) => new Date(s.recordedAt)),
        ...(progress.checkInDates || []).map((d: any) => new Date(d))
      ].filter(d => !isNaN(d.getTime()));

      learningStreak = this.calculateStreak(activityDates);
    }

    // Comprehensive Tests Taken
    const testsTaken = await this.database.collection("test_results").countDocuments({ userId: new ObjectId(userId) });

    // Calculate Rank
    const currentPoints = user.points || user.totalXP || 0;
    const rank = await this.database.collection(USER_COLLECTION).countDocuments({
      role: { $ne: "ADMIN" },
      $expr: {
        $gt: [{ $max: [{ $ifNull: ["$points", 0] }, { $ifNull: ["$totalXP", 0] }] }, currentPoints]
      }
    }) + 1;

    // Determine Badges (simple logic)
    if (currentPoints >= 1000) badges.push("Học viên triển vọng");
    if (currentPoints >= 5000) badges.push("Chiến thần ngôn ngữ");
    if (completedTopicsCount >= 5) badges.push("Thông thái");
    if (learningStreak >= 7) badges.push("Chăm chỉ");

    return {
      user: {
        name: user.name,
        level: user.level || user.currentLevel || "A1",
        totalXP: currentPoints,
        avatarUrl: user.avatarUrl
      },
      completedTopicsCount,
      vocabLearnedCount,
      grammarLearnedCount,
      speakingPracticeCount,
      testsTaken,
      currentPoints,
      currentLevel: user.level || user.currentLevel || "A1",
      learningStreak,
      badges,
      rank
    };
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;
    
    // 1. Chuẩn hóa danh sách ngày (chỉ lấy YYYY-MM-DD, loại bỏ giờ phút giây)
    const uniqueDates = Array.from(new Set(dates.map(d => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy.getTime();
    }))).sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const yesterdayTime = todayTime - 86400000;

    // 2. Nếu ngày gần nhất không phải hôm nay hoặc hôm qua, streak về 0
    const mostRecentTime = uniqueDates[0];
    if (mostRecentTime < yesterdayTime) {
      return 0;
    }

    // 3. Đếm ngược từ ngày gần nhất
    let streak = 1;
    let expectedTime = mostRecentTime - 86400000;

    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === expectedTime) {
        streak++;
        expectedTime -= 86400000;
      } else if (uniqueDates[i] < expectedTime) {
        // Có khoảng trống trong chuỗi ngày
        break;
      }
      // Trường hợp uniqueDates[i] > expectedTime không xảy ra do đã sort và distinct
    }

    return streak;
  }

  async recordCheckIn(userId: string) {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid User ID");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progressObj = await this.database.collection("progress").findOne({ userId: new ObjectId(userId) });
    
    const checkInDates: string[] = progressObj?.checkInDates || [];
    if (checkInDates.includes(today.toISOString())) {
      throw new Error("Bạn đã điểm danh trong ngày hôm nay rồi!");
    }

    await this.database.collection("progress").updateOne(
      { userId: new ObjectId(userId) },
      { $push: { checkInDates: today.toISOString() } as any },
      { upsert: true }
    );

    return { message: "Điểm danh thành công!", date: today };
  }

  async getLeaderboard() {
    const topUsers = await this.database.collection<User>(USER_COLLECTION)
      .aggregate([
        { $match: { role: { $ne: "ADMIN" } } },
        {
          $addFields: {
            effectivePoints: { 
              $max: [
                { $ifNull: ["$points", 0] }, 
                { $ifNull: ["$totalXP", 0] }
              ]
            }
          }
        },
        { $sort: { effectivePoints: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            name: 1,
            avatarUrl: 1,
            level: { $ifNull: ["$level", { $ifNull: ["$currentLevel", "A1"] }] },
            points: "$effectivePoints"
          }
        }
      ])
      .toArray();

    return topUsers;
  }

}
