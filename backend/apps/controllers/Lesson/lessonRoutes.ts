import { Router } from "express";
import { LessonController } from "./LessonController";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const lessonController = new LessonController();

router.get("/", AuthMiddleware.authenticate, lessonController.list);
router.get("/level/:levelId", AuthMiddleware.authenticate, lessonController.listByLevel);
router.get("/:id", AuthMiddleware.authenticate, lessonController.getById);
router.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  lessonController.create
);
router.patch(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  lessonController.update
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["ADMIN"]),
  lessonController.remove
);

export default router;
