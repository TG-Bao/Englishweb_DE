import { User } from "../../Entity/User";

export type UserUpdateData = Partial<Pick<User,
  | "name" | "email" | "role"
  | "avatarUrl" | "phone" | "bio" | "dateOfBirth" | "gender"
  | "level" | "targetLevel" | "learningGoal"
  | "isActive" | "lastLoginAt"
>>;

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, "_id">): Promise<User>;
  findAll(): Promise<User[]>;
  updateById(id: string, data: UserUpdateData): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}
