import { Router } from "express";
import { ProgressController } from "../controllers/ProgressController";
import { ProgressService } from "../services/ProgressService";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { QuizRepository } from "../repositories/QuizRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const progressRepo = new ProgressRepository();
const progressService = new ProgressService(
  progressRepo,
  new TopicRepository(),
  new VocabularyRepository(),
  new GrammarRepository(),
  new QuizRepository()
);
const progressController = new ProgressController(progressService);

router.get("/me", AuthMiddleware.authenticate, progressController.getMyProgress);
router.post("/vocabulary", AuthMiddleware.authenticate, progressController.markVocabularyLearned);
router.post("/grammar", AuthMiddleware.authenticate, progressController.markGrammarLearned);

export default router;
