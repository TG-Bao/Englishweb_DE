import { Router } from "express";
import { GrammarExerciseController } from "./GrammarExerciseController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", AuthMiddleware.authenticate, (req, res, next) => new GrammarExerciseController().listByGrammar(req, res, next));
router.post("/submit", AuthMiddleware.authenticate, (req, res, next) => new GrammarExerciseController().submit(req, res, next));

export default router;
