import { ObjectId, Db, ClientSession } from "mongodb";
import { Progress, PROGRESS_COLLECTION } from "../Entity/Progress";
import { IProgressRepository } from "../interfaces/repositories/ProgressRepository";

export class ProgressRepository implements IProgressRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Progress>(PROGRESS_COLLECTION);
  }

  async getByUserId(userId: string): Promise<Progress | null> {
    return this.collection.findOne({ userId: new ObjectId(userId) }, { session: this.session || undefined });
  }

  async upsert(userId: string, data: Partial<Progress>): Promise<Progress> {
    const result = await this.collection.findOneAndUpdate(
      { userId: new ObjectId(userId) },
      { $set: data },
      { upsert: true, returnDocument: "after", session: this.session || undefined }
    );
    return result as Progress;
  }
}
