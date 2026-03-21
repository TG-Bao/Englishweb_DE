import { Router } from "express";
import { TopicController } from "./TopicController";
import { SentenceController } from "./SentenceController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();
const topicController = new TopicController();
const sentenceController = new SentenceController();

router.get("/", AuthMiddleware.authenticate, topicController.listPublished);
router.get(
  "/all",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  topicController.listAll
);
router.get(
  "/:topicId/sentences",
  AuthMiddleware.authenticate,
  sentenceController.getSentencesByTopic
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  topicController.create
);
router.patch(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  topicController.update
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  topicController.remove
);

export default router;
