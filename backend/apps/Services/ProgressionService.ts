import { ObjectId } from "mongodb";
import { DatabaseConnection } from "../Database/Database";
import { User, USER_COLLECTION, EngLevel } from "../Entity/User";
import { LEVEL_COLLECTION } from "../Entity/Level";

export class ProgressionService {
  /**
   * Add XP to user and update their level if needed
   */
  async addXP(userId: string, xpToAdd: number): Promise<User | null> {
    if (xpToAdd <= 0) return null;

    const db = DatabaseConnection.getMongoClient().db();
    const user = await db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(userId) }) as User;
    if (!user) return null;

    const currentPoints = user.points || 0;
    const newTotalXP = currentPoints + xpToAdd;

    // Determine new Level based on XP thresholds in DB
    const levels = await db.collection(LEVEL_COLLECTION).find().sort({ order: 1 }).toArray();
    let newLevelName: EngLevel = (user.level || "A1") as EngLevel;
    
    for (const level of levels) {
      if (newTotalXP >= (level.minPoints || 0)) {
        newLevelName = level.name as EngLevel;
      }
    }

    // Apply changes to User (using both naming conventions for safety)
    await db.collection(USER_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          points: newTotalXP,
          level: newLevelName,
          totalXP: newTotalXP,
          currentLevel: newLevelName,
          updatedAt: new Date()
        } 
      }
    );

    return await db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(userId) }) as User;
  }
}
