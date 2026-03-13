import { Router } from "express";
import { GrammarExerciseController } from "../controllers/GrammarExerciseController";
import { GrammarExerciseService } from "../services/GrammarExerciseService";
import { GrammarExerciseRepository } from "../repositories/GrammarExerciseRepository";
import { ExerciseOptionRepository } from "../repositories/ExerciseOptionRepository";
import { UserExerciseResultRepository } from "../repositories/UserExerciseResultRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Khởi tạo các thành phần
const exerciseRepo = new GrammarExerciseRepository();
const optionRepo = new ExerciseOptionRepository();
const resultRepo = new UserExerciseResultRepository();
const exerciseService = new GrammarExerciseService(exerciseRepo, optionRepo, resultRepo);
const exerciseController = new GrammarExerciseController(exerciseService);

// Định nghĩa các route
router.get("/", AuthMiddleware.authenticate, exerciseController.listByGrammar);
router.post("/submit", AuthMiddleware.authenticate, exerciseController.submit);

export default router;
