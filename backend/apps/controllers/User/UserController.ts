import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { UserService } from "../../Services/UserService";
import { AuthRequest } from "../../middleware/authMiddleware";
import { AppError } from "../../utils/AppError";

const VALID_ROLES = ["USER", "ADMIN"] as const;
const VALID_GENDERS = ["MALE", "FEMALE", "OTHER"] as const;
const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const users = await this.userService.getAllUsers();
        sendSuccess(res, users);
    });

    getCount = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const total = await this.userService.getTotalUsers();
        sendSuccess(res, { total });
    });

    getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await this.userService.getUserById(req.params.id);
        sendSuccess(res, user);
    });

    update = asyncHandler(async (req: AuthRequest, res: Response) => {
        const {
            name, email, role,
            avatarUrl, phone, bio, dateOfBirth, gender,
            level, targetLevel, learningGoal,
            isActive,
            address, points, totalTopicsLearned
        } = req.body;

        if (role && !VALID_ROLES.includes(role as any)) {
            throw new AppError(`Role không hợp lệ`, 400);
        }
        if (gender && !VALID_GENDERS.includes(gender as any)) {
            throw new AppError(`Gender không hợp lệ`, 400);
        }

        const updateData: any = {};
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
        if (totalTopicsLearned !== undefined) updateData.totalTopicsLearned = Number(totalTopicsLearned);

        const updated = await this.userService.updateUser(req.params.id, updateData);
        sendSuccess(res, updated, 200, "Cập nhật người dùng thành công");
    });

    remove = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (req.user!.id === req.params.id) {
            throw new AppError("Bạn không thể xóa tài khoản của chính mình", 400);
        }
        await this.userService.deleteUser(req.params.id);
        sendSuccess(res, null, 200, "Xóa người dùng thành công");
    });
}
