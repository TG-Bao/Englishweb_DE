import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { IUserService } from "../interfaces/services/UserService";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { EngLevel, UserGender } from "../models/User";

const VALID_ROLES = ["USER", "ADMIN"] as const;
const VALID_GENDERS: UserGender[] = ["MALE", "FEMALE", "OTHER"];
const VALID_LEVELS: EngLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export class UserController {
    constructor(private userService: IUserService) { }

    /**
     * GET /api/users
     * Lấy danh sách tất cả người dùng (Admin only)
     */
    getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const users = await this.userService.getAllUsers();
        sendSuccess(res, users);
    });

    /**
     * GET /api/users/stats/count
     * Tổng số người dùng (Admin only)
     */
    getCount = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const total = await this.userService.getTotalUsers();
        sendSuccess(res, { total });
    });

    /**
     * GET /api/users/:id
     * Lấy thông tin một người dùng (Admin only)
     */
    getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await this.userService.getUserById(req.params.id);
        sendSuccess(res, user);
    });

    /**
     * PATCH /api/users/:id
     * Cập nhật thông tin người dùng (Admin only)
     * Hỗ trợ tất cả các trường: thông tin cơ bản, hồ sơ, học tập, trạng thái
     */
    update = asyncHandler(async (req: AuthRequest, res: Response) => {
        const {
            // Cơ bản
            name, email, role,
            // Hồ sơ cá nhân
            avatarUrl, phone, bio, dateOfBirth, gender,
            // Học tập
            level, targetLevel, learningGoal,
            // Trạng thái
            isActive,
            // Thêm mới
            address, points, totalLessons
        } = req.body;

        // Validate role
        if (role && !VALID_ROLES.includes(role)) {
            throw new AppError(`Role không hợp lệ. Chỉ chấp nhận: ${VALID_ROLES.join(", ")}`, 400);
        }

        // Validate gender
        if (gender && !VALID_GENDERS.includes(gender)) {
            throw new AppError(`Gender không hợp lệ. Chỉ chấp nhận: ${VALID_GENDERS.join(", ")}`, 400);
        }

        // Validate level
        if (level && !VALID_LEVELS.includes(level)) {
            throw new AppError(`Level không hợp lệ. Chỉ chấp nhận: ${VALID_LEVELS.join(", ")}`, 400);
        }
        if (targetLevel && !VALID_LEVELS.includes(targetLevel)) {
            throw new AppError(`Target Level không hợp lệ. Chỉ chấp nhận: ${VALID_LEVELS.join(", ")}`, 400);
        }

        // Xây dựng object update (chỉ những trường được cung cấp)
        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        if (phone !== undefined) updateData.phone = phone;
        if (bio !== undefined) updateData.bio = bio;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
        if (gender !== undefined) updateData.gender = gender;
        if (level !== undefined) updateData.level = level;
        if (targetLevel !== undefined) updateData.targetLevel = targetLevel;
        if (learningGoal !== undefined) updateData.learningGoal = learningGoal;
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (address !== undefined) updateData.address = address;
        if (points !== undefined) updateData.points = Number(points);
        if (totalLessons !== undefined) updateData.totalLessons = Number(totalLessons);

        const updated = await this.userService.updateUser(req.params.id, updateData);
        sendSuccess(res, updated, 200, "Cập nhật người dùng thành công");
    });

    /**
     * DELETE /api/users/:id
     * Xóa người dùng (Admin only)
     * Không được tự xóa chính mình
     */
    remove = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (req.user!.id === req.params.id) {
            throw new AppError("Bạn không thể xóa tài khoản của chính mình", 400);
        }
        await this.userService.deleteUser(req.params.id);
        sendSuccess(res, null, 200, "Xóa người dùng thành công");
    });
}
