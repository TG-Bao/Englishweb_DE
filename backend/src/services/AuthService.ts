import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { IUserRepository } from "../interfaces/repositories/UserRepository";
import { IAuthService } from "../interfaces/services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

export class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepository) { }

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
      role: "USER",
      level: "A1", // Mặc định level A1 khi mới đăng ký
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

    // Kiểm tra tài khoản có bị khoá không
    if (user.isActive === false) {
      throw new AppError("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.", 403);
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new AppError("Invalid credentials", 401);
    }

    // Ghi nhận lần đăng nhập cuối (nếu repo hỗ trợ)
    if (typeof (this.userRepo as UserRepository).setLastLogin === "function") {
      await (this.userRepo as UserRepository).setLastLogin(user._id!.toString());
    }

    const token = this.createToken(user._id!.toString(), user.role);
    return { user, token };
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.userRepo.updateById(userId, data);
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

  private createToken(id: string, role: "USER" | "ADMIN") {
    return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  }
}
