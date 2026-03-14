import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import topicRoutes from "./routes/topicRoutes";
import vocabularyRoutes from "./routes/vocabularyRoutes";
import quizRoutes from "./routes/quizRoutes";
import questionRoutes from "./routes/questionRoutes";
import progressRoutes from "./routes/progressRoutes";
import userRoutes from "./routes/userRoutes";
import levelRoutes from "./routes/levelRoutes";
import grammarExerciseRoutes from "./routes/grammarExerciseRoutes";
import grammarRoutes from "./routes/grammarRoutes";
import sentenceRoutes from "./routes/sentenceRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  // app.use("/api/topics", topicRoutes);
  app.use("/api/vocabulary", vocabularyRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/topics", topicRoutes);
  app.use("/api/vocabularies", vocabularyRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/questions", questionRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/levels", levelRoutes);

  app.use("/api/grammars", grammarRoutes); 
  app.use("/api/grammar-topics", topicRoutes); 
  app.use("/api/grammar-exercises", grammarExerciseRoutes);
  app.use("/api/sentences", sentenceRoutes);
  app.use(errorHandler);

  return app;
};
// backend/src/app.ts

// Đăng ký đúng prefix để ra được URL như yêu cầu
