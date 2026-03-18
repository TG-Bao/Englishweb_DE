import { ObjectId } from "mongodb";

export type UserRole = "USER" | "ADMIN";
export type UserGender = "MALE" | "FEMALE" | "OTHER";
export type EngLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export class User {
    _id?: ObjectId;
    name!: string;
    email!: string;
    password!: string;
    role!: UserRole;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
    level?: EngLevel;
    targetLevel?: EngLevel;
    learningGoal?: string;
    isActive?: boolean;
    lastLoginAt?: Date;
    address?: string;
    points?: number;
    totalTopicsLearned?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {}
}

export const USER_COLLECTION = "users";
