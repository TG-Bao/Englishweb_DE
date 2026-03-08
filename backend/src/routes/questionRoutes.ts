import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { QuestionService } from "../services/QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const questionService = new QuestionService(new QuestionRepository());
const questionController = new QuestionController(questionService);

router.get("/quiz/:quizId", AuthMiddleware.authenticate, questionController.listByQuiz);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), questionController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), questionController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), questionController.remove);

export default router;
