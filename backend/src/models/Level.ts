import { ObjectId } from "mongodb";

export interface LevelDocument {
    _id?: ObjectId;
    name: string; // e.g., "A1", "A2", "Beginner"
    description?: string;
    minPoints?: number; // Minimum points required
    order: number;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export const LEVEL_COLLECTION = "levels";
