import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { StatisticService } from "../Services/StatisticService";

const statisticService = new StatisticService();

export class StatisticController {
  getUserProfileStats = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const stats = await statisticService.getUserStats(userId);
    return sendSuccess(res, stats);
  });

  getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const leaderboard = await statisticService.getLeaderboard();
    return sendSuccess(res, leaderboard);
  });
}
