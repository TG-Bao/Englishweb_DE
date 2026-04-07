import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, ClientSession, Db } from "mongodb";
import { AppError } from "../utils/AppError";
import { env } from "../../Config/env";
import { IAuthService } from "../interfaces/services/AuthService";
import { UserRepository } from "../Repository/UserRepository";
import { DatabaseConnection } from "../Database/Database";

export class AuthService implements IAuthService {
  private client: MongoClient;
  private database: Db;
  private userRepo: UserRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db(); // Uses default DB from URI
    this.userRepo = new UserRepository(this.database);
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({
      name,
      email,
      password: hashed,
      role: "USER" as any,
      level: "A1" as any,
      isActive: true,
    });

    const token = this.createToken(user._id!.toString(), user.role);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.isActive === false) {
      throw new AppError("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.", 403);
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new AppError("Invalid credentials", 401);
    }

    await this.userRepo.setLastLogin(user._id!.toString());

    const token = this.createToken(user._id!.toString(), user.role);
    return { user, token };
  }

  async updateProfile(userId: string, data: any) {
    // SECURITY FIX: Chặn việc cập nhật quyền (role) và các chỉ số (level, points) trái phép qua profile update
    const { role, level, currentLevel, points, totalXP, ...updateData } = data;
    
    const user = await this.userRepo.updateById(userId, updateData);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const matches = await bcrypt.compare(oldPassword, user.password);
    if (!matches) {
      throw new AppError("Mật khẩu cũ không chính xác", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updateById(userId, { password: hashed } as any);
  }

  private createToken(id: string, role: string) {
    return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  }
}
