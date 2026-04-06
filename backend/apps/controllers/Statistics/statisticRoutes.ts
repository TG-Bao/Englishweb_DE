import { Router } from "express";
import { StatisticController } from "./StatisticController";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new StatisticController();

router.get("/me", AuthMiddleware.authenticate, controller.getMeStats);
router.get("/user/:userId", controller.getUserProfileStats);
router.get("/leaderboard", controller.getLeaderboard);
router.post("/check-in", AuthMiddleware.authenticate, controller.checkIn);

export default router;
