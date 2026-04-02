import { Router } from "express";
import { SentenceController } from "./SentenceController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();
const sentenceController = new SentenceController();

// User routes (public/user)
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  sentenceController.getSentenceById
);

// Admin routes (CRUD)
router.get("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.list);
router.get("/lesson/:lessonId", AuthMiddleware.authenticate, sentenceController.listByLesson);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.remove);

export default router;
