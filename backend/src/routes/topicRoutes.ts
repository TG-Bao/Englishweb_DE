import { Router } from "express";
import { TopicController } from "../controllers/TopicController";
import { TopicService } from "../services/TopicService";
import { TopicRepository } from "../repositories/TopicRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const topicRepo = new TopicRepository();
const topicService = new TopicService(topicRepo);
const topicController = new TopicController(topicService);

router.get("/", AuthMiddleware.authenticate, topicController.listPublished);
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), topicController.listAll);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), topicController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), topicController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), topicController.remove);

export default router;
