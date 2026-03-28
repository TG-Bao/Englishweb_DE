import { Router } from "express";
import { TestController } from "./TestController";

const router = Router();
const controller = new TestController();

router.get("/", controller.getAllTests);
router.get("/:id", controller.getTestById);
router.post("/:id/submit", controller.submitTest);

export default router;
