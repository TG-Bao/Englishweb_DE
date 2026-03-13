import { AppError } from "../utils/AppError";
import { UserDocument } from "../models/User";
import { IUserRepository, UserUpdateData } from "../interfaces/repositories/UserRepository";
import { IUserService, UserSafeView } from "../interfaces/services/UserService";

export class UserService implements IUserService {
    constructor(private userRepo: IUserRepository) { }

    private toSafeView(doc: UserDocument): UserSafeView {
        return {
            _id: doc._id!.toString(),
            name: doc.name,
            email: doc.email,
            role: doc.role,
            avatarUrl: doc.avatarUrl,
            phone: doc.phone,
            bio: doc.bio,
            dateOfBirth: doc.dateOfBirth,
            gender: doc.gender,
            level: doc.level,
            targetLevel: doc.targetLevel,
            learningGoal: doc.learningGoal,
            isActive: doc.isActive ?? true,
            lastLoginAt: doc.lastLoginAt,
            address: doc.address,
            points: doc.points,
            totalTopicsLearned: doc.totalTopicsLearned,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async getAllUsers(): Promise<UserSafeView[]> {
        const users = await this.userRepo.findAll();
        return users.map(u => this.toSafeView(u));
    }

    async getUserById(id: string): Promise<UserSafeView> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new AppError("Không tìm thấy người dùng", 404);
        return this.toSafeView(user);
    }

    async updateUser(id: string, data: UserUpdateData): Promise<UserSafeView> {
        // Kiểm tra email trùng lặp nếu có thay đổi email
        if (data.email) {
            const existing = await this.userRepo.findByEmail(data.email);
            if (existing && existing._id!.toString() !== id) {
                throw new AppError("Email đã được sử dụng bởi tài khoản khác", 400);
            }
        }

        const updated = await this.userRepo.updateById(id, data);
        if (!updated) throw new AppError("Không tìm thấy người dùng", 404);
        return this.toSafeView(updated);
    }

    async deleteUser(id: string): Promise<void> {
        const deleted = await this.userRepo.deleteById(id);
        if (!deleted) throw new AppError("Không tìm thấy người dùng", 404);
    }

    async getTotalUsers(): Promise<number> {
        return this.userRepo.countAll();
    }
}
