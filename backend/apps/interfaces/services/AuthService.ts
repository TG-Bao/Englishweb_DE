import { User } from "../../Entity/User";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{ user: User; token: string }>;
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  updateProfile(userId: string, data: any): Promise<User>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
