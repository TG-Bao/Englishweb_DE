import { Router } from "express";
import { GrammarController } from "./GrammarController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/level/:level", AuthMiddleware.authenticate, (req, res, next) => new GrammarController().listByLevel(req, res, next));
router.get("/:id", AuthMiddleware.authenticate, (req, res, next) => new GrammarController().getById(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new GrammarController().create(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new GrammarController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new GrammarController().remove(req, res, next));

export default router;
