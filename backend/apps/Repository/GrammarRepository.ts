import { ObjectId, Db, ClientSession } from "mongodb";
import { Grammar, GRAMMAR_COLLECTION } from "../Entity/Grammar";
import { IGrammarRepository } from "../interfaces/repositories/GrammarRepository";

export class GrammarRepository implements IGrammarRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Grammar>(GRAMMAR_COLLECTION);
  }

  async listByLevel(level: string): Promise<Grammar[]> {
    return this.collection.find({ level }, { session: this.session || undefined }).toArray();
  }

  async findById(id: string): Promise<Grammar | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Grammar, "_id">): Promise<Grammar> {
    const result = await this.collection.insertOne(data as Grammar, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as Grammar;
  }

  async update(id: string, data: Partial<Grammar>): Promise<Grammar | null> {
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
