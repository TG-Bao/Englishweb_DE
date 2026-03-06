import { ObjectId } from "mongodb";
import { UserDocument, USER_COLLECTION } from "../models/User";
import { Database } from "../config/Database";
import { IUserRepository, UserUpdateData } from "../interfaces/repositories/UserRepository";

export class UserRepository implements IUserRepository {
  private get collection() {
    return Database.getInstance().getCollection<UserDocument>(USER_COLLECTION);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.collection.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<UserDocument, "_id">): Promise<UserDocument> {
    const now = new Date();
    const doc: Omit<UserDocument, "_id"> = {
      ...data,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as UserDocument);
    return { ...doc, _id: result.insertedId } as UserDocument;
  }

  async findAll(): Promise<UserDocument[]> {
    // Loại bỏ trường password khi trả về danh sách
    return this.collection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateById(id: string, data: UserUpdateData): Promise<UserDocument | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after", projection: { password: 0 } }
    );
    return result ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async countAll(): Promise<number> {
    return this.collection.countDocuments();
  }

  /**
   * Ghi nhận thời gian đăng nhập cuối
   */
  async setLastLogin(id: string): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );
  }
}
