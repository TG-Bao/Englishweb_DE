import { Router } from "express";
import { TopicController } from "./TopicController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", AuthMiddleware.authenticate, (req, res, next) => new TopicController().listPublished(req, res, next));
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new TopicController().listAll(req, res, next));
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new TopicController().create(req, res, next));
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new TopicController().update(req, res, next));
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), (req, res, next) => new TopicController().remove(req, res, next));

export default router;
