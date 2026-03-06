import { UserDocument } from "../../models/User";

export type UserUpdateData = Partial<Pick<UserDocument,
  | "name" | "email" | "role"
  | "avatarUrl" | "phone" | "bio" | "dateOfBirth" | "gender"
  | "level" | "targetLevel" | "learningGoal"
  | "isActive" | "lastLoginAt"
>>;

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  create(data: Omit<UserDocument, "_id">): Promise<UserDocument>;
  findAll(): Promise<UserDocument[]>;
  updateById(id: string, data: UserUpdateData): Promise<UserDocument | null>;
  deleteById(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}
