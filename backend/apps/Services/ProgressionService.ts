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
    
    // 1. Increment points directly in DB
    const updateResult = await db.collection(USER_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $inc: { 
          points: xpToAdd,
          totalXP: xpToAdd
        },
        $set: {
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    const user = updateResult as unknown as User;
    if (!user) return null;

    // 2. Determine and update Level based on new score
    const newTotalXP = user.points || 0;
    const levels = await db.collection(LEVEL_COLLECTION).find().sort({ order: 1 }).toArray();
    let newLevelName: EngLevel = (user.level || "A1") as EngLevel;
    
    for (const level of levels) {
      if (newTotalXP >= (level.minPoints || 0)) {
        newLevelName = level.name as EngLevel;
      }
    }

    if (newLevelName !== user.level) {
      await db.collection(USER_COLLECTION).updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            level: newLevelName,
            currentLevel: newLevelName
          } 
        }
      );
      user.level = newLevelName;
      user.currentLevel = newLevelName;
    }

    return user;
  }
}
