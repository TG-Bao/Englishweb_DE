import { DatabaseConnection } from "./apps/Database/Database";

const updateLevels = async () => {
  const client = DatabaseConnection.getMongoClient();
  await client.connect();
  const db = client.db();
  
  const levels = [
    { name: "A2", minPoints: 1000 },
    { name: "B1", minPoints: 3000 },
    { name: "B2", minPoints: 5000 },
    { name: "C1", minPoints: 7000 },
    { name: "C2", minPoints: 10000 },
  ];

  for (const level of levels) {
    await db.collection("levels").updateOne(
      { name: level.name },
      { $set: { minPoints: level.minPoints, updatedAt: new Date() } }
    );
    console.log(`Updated Level ${level.name} to ${level.minPoints} XP`);
  }

  process.exit(0);
};

updateLevels();
