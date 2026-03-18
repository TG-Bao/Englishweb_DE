import { Router } from "express";
import { QuizController } from "./QuizController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", AuthMiddleware.authenticate, (req, res, next) => new QuizController().list(req, res, next));
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuizController().listAll(req, res, next));
router.get("/:id", AuthMiddleware.authenticate, (req, res, next) => new QuizController().getDetail(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuizController().create(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuizController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new QuizController().remove(req, res, next));
router.post("/submit", AuthMiddleware.authenticate, (req, res, next) => new QuizController().submit(req, res, next));
router.get("/scope/:scopeType/:scopeId", AuthMiddleware.authenticate, (req, res, next) => new QuizController().getByScope(req, res, next));

export default router;
