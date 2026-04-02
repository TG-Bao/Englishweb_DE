import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
import { DatabaseConnection } from "../apps/Database/Database";
import { LEVEL_COLLECTION } from "../apps/Entity/Level";

const updateLevels = async () => {
  try {
    const client = DatabaseConnection.getMongoClient();
    await client.connect();
    const db = client.db();

    console.log("Updating level thresholds...");

    const levels = [
      { name: "A1", minPoints: 0, order: 1, description: "Beginner", isPublished: true },
      { name: "A2", minPoints: 1000, order: 2, description: "Elementary", isPublished: true },
      { name: "B1", minPoints: 3000, order: 3, description: "Intermediate", isPublished: true },
      { name: "B2", minPoints: 5000, order: 4, description: "Upper Intermediate", isPublished: true },
      { name: "C1", minPoints: 7000, order: 5, description: "Advanced", isPublished: true },
      { name: "C2", minPoints: 10000, order: 6, description: "Proficiency", isPublished: true },
    ];

    for (const level of levels) {
      await db.collection(LEVEL_COLLECTION).updateOne(
        { name: level.name },
        { $set: { ...level, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`Updated ${level.name}: ${level.minPoints} XP`);
    }

    console.log("\nSynchronizing user levels...");
    const users = await db.collection("users").find().toArray();
    for (const user of users) {
      const currentPoints = user.points || 0;
      let newLevelName = "A1";
      
      for (const level of levels) {
        if (currentPoints >= level.minPoints) {
          newLevelName = level.name;
        }
      }

      if (user.level !== newLevelName) {
        await db.collection("users").updateOne(
          { _id: user._id },
          { 
            $set: { 
              level: newLevelName, 
              currentLevel: newLevelName, 
              totalXP: currentPoints, // ensure totalXP matches points
              updatedAt: new Date() 
            } 
          }
        );
        console.log(`Synced User ${user.email || user.name}: ${user.level} -> ${newLevelName} (${currentPoints} points)`);
      }
    }

    console.log("\n✅ LEVEL UPDATE & SYNC SUCCESSFUL!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateLevels();
