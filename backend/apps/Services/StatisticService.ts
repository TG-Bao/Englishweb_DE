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
        $or: [
            { points: { $gt: currentPoints } },
            { totalXP: { $gt: currentPoints } }
        ]
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
    const sortedDates = [...new Set(dates.map(d => d.toDateString()))]
      .map(s => new Date(s))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If the most recent activity was not today or yesterday, streak is 0
    const mostRecent = sortedDates[0];
    const diffToToday = today.getTime() - mostRecent.getTime();
    
    if (diffToToday > 86400000) { // More than 24 hours ago
      return 0;
    }

    streak = 1;
    let checkDate = mostRecent;

    for (let i = 1; i < sortedDates.length; i++) {
        const diff = checkDate.getTime() - sortedDates[i].getTime();
        if (diff === 86400000) {
            streak++;
            checkDate = sortedDates[i];
        } else {
            break;
        }
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
      .find({ role: { $ne: "ADMIN" } }, { 
        projection: { name: 1, avatarUrl: 1, level: 1, currentLevel: 1, totalXP: 1, points: 1 },
        limit: 10,
        sort: { totalXP: -1, points: -1 }
      })
      .toArray();

    return topUsers.map(u => ({
      _id: u._id,
      name: u.name,
      avatarUrl: u.avatarUrl,
      level: u.level || u.currentLevel || "A1",
      points: u.totalXP || u.points || 0
    }));
  }

}
