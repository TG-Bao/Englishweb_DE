import { ObjectId, Db, ClientSession } from "mongodb";
import { Vocabulary, VOCABULARY_COLLECTION } from "../Entity/Vocabulary";
import { IVocabularyRepository } from "../interfaces/repositories/VocabularyRepository";

export class VocabularyRepository implements IVocabularyRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Vocabulary>(VOCABULARY_COLLECTION);
  }

  async list(filters: { topicId?: string; topic?: string; level?: string; search?: string; learned?: string }) {
    const query: any = {};
    if (filters.topicId) query.topicId = new ObjectId(filters.topicId);
    if (filters.topic) query.topic = filters.topic;
    if (filters.level) query.level = filters.level;
    if (filters.search) query.word = { $regex: filters.search, $options: "i" };
    if (filters.learned === "1") {
      query.learned = 1;
    } else if (filters.learned === "0") {
      query.learned = { $ne: 1 };
    }

    return this.collection.find(query, { session: this.session || undefined }).toArray();
  }

  async findById(id: string) {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Vocabulary, "_id">) {
    const now = new Date();
    const doc = { ...data, createdAt: now, updatedAt: now };
    const result = await this.collection.insertOne(doc as Vocabulary, { session: this.session || undefined });
    return { ...doc, _id: result.insertedId } as Vocabulary;
  }

  async update(id: string, data: Partial<Vocabulary>) {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after", session: this.session || undefined }
    );
    return result;
  }

  async remove(id: string) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
    return result.deletedCount > 0;
  }
}
