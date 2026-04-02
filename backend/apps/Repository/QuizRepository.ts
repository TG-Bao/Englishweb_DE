import { ObjectId, Db, ClientSession } from "mongodb";
import { Quiz, QUIZ_COLLECTION } from "../Entity/Quiz";
import { IQuizRepository } from "../interfaces/repositories/QuizRepository";

export class QuizRepository implements IQuizRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Quiz>(QUIZ_COLLECTION);
  }

  async listPublished(): Promise<Quiz[]> {
    return this.collection.find({ isPublished: true }, { session: this.session || undefined }).toArray();
  }

  async listAll(): Promise<Quiz[]> {
    return this.collection.find({}, { session: this.session || undefined }).toArray();
  }

  async listByScope(scopeType: string, scopeId?: string): Promise<Quiz[]> {
    const query: any = { scopeType, isPublished: true };
    if (scopeId) {
      query.scopeId = new ObjectId(scopeId);
    }
    return this.collection.find(query, { session: this.session || undefined }).toArray();
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Quiz, "_id">): Promise<Quiz> {
    const result = await this.collection.insertOne(data as Quiz, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as Quiz;
  }

  async update(id: string, data: Partial<Quiz>): Promise<Quiz | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after", session: this.session || undefined }
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }
}
