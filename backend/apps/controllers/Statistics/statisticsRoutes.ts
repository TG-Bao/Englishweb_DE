import { Router } from "express";
import { StatisticsController } from "./StatisticsController";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new StatisticsController();

router.use(AuthMiddleware.authenticate);

router.get("/me", (req, res, next) => controller.getMyStats(req, res, next));
router.get("/leaderboard", (req, res, next) => controller.getLeaderboard(req, res, next));

export default router;
