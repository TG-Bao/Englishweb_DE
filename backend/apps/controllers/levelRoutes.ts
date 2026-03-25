import { Router } from "express";
import { LevelController } from "./LevelController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res, next) => new LevelController().listPublished(req, res, next));
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new LevelController().listAll(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new LevelController().create(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new LevelController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new LevelController().remove(req, res, next));

export default router;
