import { UserDocument } from "../../models/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  create(data: Omit<UserDocument, "_id">): Promise<UserDocument>;
}
