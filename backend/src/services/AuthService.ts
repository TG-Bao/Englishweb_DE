import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { IUserRepository } from "../interfaces/repositories/UserRepository";
import { IAuthService } from "../interfaces/services/AuthService";

export class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, password: hashed, role: "USER" });

    const token = this.createToken(user._id!.toString(), user.role);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.createToken(user._id!.toString(), user.role);
    return { user, token };
  }

  private createToken(id: string, role: "USER" | "ADMIN") {
    return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  }
}
