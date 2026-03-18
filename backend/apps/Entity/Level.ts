import { ObjectId } from "mongodb";

export class Level {
    _id?: ObjectId;
    name!: string;
    description?: string;
    minPoints?: number;
    order!: number;
    isPublished!: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {}
}

export const LEVEL_COLLECTION = "levels";
