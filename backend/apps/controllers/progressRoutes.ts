import { Router } from "express";
import { ProgressController } from "./ProgressController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/my", AuthMiddleware.authenticate, (req, res, next) => new ProgressController().getMyProgress(req, res, next));
router.post("/vocabulary/mark-learned", AuthMiddleware.authenticate, (req, res, next) => new ProgressController().markVocabularyLearned(req, res, next));
router.post("/grammar/mark-learned", AuthMiddleware.authenticate, (req, res, next) => new ProgressController().markGrammarLearned(req, res, next));

export default router;
