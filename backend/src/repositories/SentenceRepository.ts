import { ObjectId } from "mongodb";
import { SentenceDocument, SENTENCE_COLLECTION } from "../models/Sentence";
import { Database } from "../config/Database";
import { ISentenceRepository } from "../interfaces/repositories/SentenceRepository";

export class SentenceRepository implements ISentenceRepository {
  private get collection() {
    return Database.getInstance().getCollection<SentenceDocument>(SENTENCE_COLLECTION);
  }

  async list(): Promise<SentenceDocument[]> {
    return this.collection.find({}).toArray();
  }

  async findById(id: string): Promise<SentenceDocument | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<SentenceDocument, "_id">): Promise<SentenceDocument> {
    const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
    const result = await this.collection.insertOne(doc as SentenceDocument);
    return { _id: result.insertedId, ...doc } as SentenceDocument;
  }

  async update(id: string, data: Partial<SentenceDocument>): Promise<SentenceDocument | null> {
    if (!ObjectId.isValid(id)) return null;
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
