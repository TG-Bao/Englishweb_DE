import { UserDocument } from "../../models/User";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{ user: UserDocument; token: string }>;
  login(email: string, password: string): Promise<{ user: UserDocument; token: string }>;
  updateProfile(userId: string, data: any): Promise<UserDocument>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
