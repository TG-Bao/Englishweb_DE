import { EngLevel, UserGender, UserRole } from "../../models/User";
import { UserUpdateData } from "../repositories/UserRepository";

/** Thông tin user trả về ngoài (không có password) */
export interface UserSafeView {
    _id: string;
    name: string;
    email: string;
    role: UserRole;

    // Hồ sơ cá nhân
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: Date;
    gender?: UserGender;

    // Học tập
    level?: EngLevel;
    targetLevel?: EngLevel;
    learningGoal?: string;

    // Trạng thái
    isActive?: boolean;
    lastLoginAt?: Date;

    // Thêm mới
    address?: string;
    points?: number;
    totalLessons?: number;

    // Thời gian
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserService {
    getAllUsers(): Promise<UserSafeView[]>;
    getUserById(id: string): Promise<UserSafeView>;
    updateUser(id: string, data: UserUpdateData): Promise<UserSafeView>;
    deleteUser(id: string): Promise<void>;
    getTotalUsers(): Promise<number>;
}
