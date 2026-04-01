import { Router } from "express";
import { TestController } from "./TestController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();
const controller = new TestController();

router.get("/", controller.getAllTests);
router.get("/:id", controller.getTestById);
router.post("/:id/submit", controller.submitTest);

// Admin Routes
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), controller.createTest);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), controller.updateTest);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), controller.deleteTest);

export default router;
