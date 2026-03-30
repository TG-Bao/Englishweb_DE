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
    
    let completedTopics = 0;
    let totalVocab = 0;

    if (progress) {
      completedTopics = (progress.topicProgress || []).filter((p: any) => p.status === "COMPLETED").length;
      totalVocab = (progress.topicProgress || []).reduce((acc: number, p: any) => acc + (p.vocabLearned || []).length, 0);
    }

    // Comprehensive Tests Taken
    const testsTaken = await this.database.collection("test_results").countDocuments({ userId: new ObjectId(userId) });

    return {
      user: {
        name: user.name,
        level: user.level || user.currentLevel || "A1",
        totalXP: user.totalXP || user.points || 0,
        avatarUrl: user.avatarUrl
      },
      stats: {
        completedTopics,
        totalVocab,
        testsTaken
      }
    };
  }

  async getLeaderboard() {
    const topUsers = await this.database.collection<User>(USER_COLLECTION)
      .find({}, { 
        projection: { name: 1, avatarUrl: 1, level: 1, currentLevel: 1, totalXP: 1, points: 1 },
        limit: 10,
        sort: { totalXP: -1, points: -1 }
      })
      .toArray();

    return topUsers.map(u => ({
      name: u.name,
      avatarUrl: u.avatarUrl,
      level: u.level || u.currentLevel || "A1",
      xp: u.totalXP || u.points || 0
    }));
  }
}
