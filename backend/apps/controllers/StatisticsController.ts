import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { StatisticsService } from "../Services/StatisticsService";
import { AuthRequest } from "../middleware/authMiddleware";

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  getMyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await this.statisticsService.getUserStats(req.user!.id);
    sendSuccess(res, stats);
  });

  getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leaderboard = await this.statisticsService.getLeaderboard(limit);
    sendSuccess(res, leaderboard);
  });
}
