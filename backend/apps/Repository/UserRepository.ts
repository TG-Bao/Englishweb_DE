import { ObjectId, Db, ClientSession } from "mongodb";
import { User, USER_COLLECTION } from "../Entity/User";
import { IUserRepository, UserUpdateData } from "../interfaces/repositories/UserRepository";

export class UserRepository implements IUserRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<User>(USER_COLLECTION);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email }, { session: this.session || undefined });
  }

  async findById(id: string): Promise<User | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<User, "_id">): Promise<User> {
    const now = new Date();
    const doc: Omit<User, "_id"> = {
      ...data,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as User, { session: this.session || undefined });
    return { ...doc, _id: result.insertedId } as User;
  }

  async findAll(): Promise<User[]> {
    return this.collection
      .find({}, { projection: { password: 0 }, session: this.session || undefined })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateById(id: string, data: UserUpdateData): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after", projection: { password: 0 }, session: this.session || undefined }
    );
    return result ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
    return result.deletedCount > 0;
  }

  async countAll(): Promise<number> {
    return this.collection.countDocuments({}, { session: this.session || undefined });
  }

  async setLastLogin(id: string): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } },
      { session: this.session || undefined }
    );
  }
}
