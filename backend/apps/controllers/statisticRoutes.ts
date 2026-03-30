import { Router } from "express";
import { StatisticController } from "./StatisticController";

const router = Router();
const controller = new StatisticController();

router.get("/user/:userId", controller.getUserProfileStats);
router.get("/leaderboard", controller.getLeaderboard);

export default router;
