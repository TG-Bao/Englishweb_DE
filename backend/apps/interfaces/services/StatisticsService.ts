import { UserSafeView } from "./UserService";

export interface UserStats {
    completedTopicsCount: number;
    vocabLearnedCount: number;
    currentPoints: number;
    currentLevel: string;
    nextLevel?: string;
    xpProgressPercentage: number;
}

export interface IStatisticsService {
    getUserStats(userId: string): Promise<UserStats>;
    getLeaderboard(limit: number): Promise<UserSafeView[]>;
}
