import { Router } from "express";
import { VocabularyController } from "./VocabularyController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", AuthMiddleware.optionalAuth, (req, res, next) => new VocabularyController().list(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new VocabularyController().create(req, res, next));
router.patch("/:id/toggle-learned", AuthMiddleware.authenticate, (req, res, next) => new VocabularyController().toggleLearned(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new VocabularyController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new VocabularyController().remove(req, res, next));

export default router;
