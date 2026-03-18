import app from "./app";
import { env } from "./Config/env";
import { DatabaseConnection } from "./apps/Database/Database";

const startServer = async () => {
  try {
    const client = DatabaseConnection.getMongoClient();
    await client.connect();
    console.log("Connected to MongoDB successfully");

    const PORT = env.port || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
