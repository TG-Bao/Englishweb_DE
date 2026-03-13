import { Router } from "express";
import { QuizController } from "../controllers/QuizController";
import { QuizService } from "../services/QuizService";
import { QuizRepository } from "../repositories/QuizRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ProgressService } from "../services/ProgressService";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { QuestionService } from "../services/QuestionService";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { VocabularyRepository } from "../repositories/VocabularyRepository";

const router = Router();

const quizRepo = new QuizRepository();
const quizService = new QuizService(quizRepo);
const questionService = new QuestionService(new QuestionRepository());
const progressRepo = new ProgressRepository();
const progressService = new ProgressService(
  progressRepo,
  new TopicRepository(),
  new VocabularyRepository(),
  quizRepo
);
const quizController = new QuizController(quizService, questionService, progressService);

router.get("/", AuthMiddleware.authenticate, quizController.list);
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), quizController.listAll);
router.get("/:id", AuthMiddleware.authenticate, quizController.getDetail);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), quizController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), quizController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), quizController.remove);
router.post("/submit", AuthMiddleware.authenticate, quizController.submit);
router.get("/scope/:scopeType/:scopeId", AuthMiddleware.authenticate, quizController.getByScope);

export default router;
