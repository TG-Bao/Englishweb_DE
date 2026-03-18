import { Router } from "express";
import { QuestionController } from "./QuestionController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/quiz/:quizId", AuthMiddleware.authenticate, (req, res, next) => new QuestionController().listByQuiz(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuestionController().create(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuestionController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuestionController().remove(req, res, next));

export default router;
