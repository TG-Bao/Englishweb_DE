import { UserDocument } from "../../models/User";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{ user: UserDocument; token: string }>;
  login(email: string, password: string): Promise<{ user: UserDocument; token: string }>;
}
