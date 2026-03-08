import { ObjectId } from "mongodb";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "../models/Vocabulary";
import { Database } from "../config/Database";
import { IVocabularyRepository } from "../interfaces/repositories/VocabularyRepository";

export class VocabularyRepository implements IVocabularyRepository {
  private get collection() {
    return Database.getInstance().getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);
  }

  async list(filters: { topicId?: string; topic?: string; level?: string; search?: string }): Promise<VocabularyDocument[]> {
    const query: any = {};
    if (filters.topicId) query.topicId = new ObjectId(filters.topicId);
    if (filters.topic) query.topic = filters.topic;
    if (filters.level) query.level = filters.level;
    if (filters.search) {
      query.$or = [
        { word: { $regex: filters.search, $options: "i" } },
        { meaning: { $regex: filters.search, $options: "i" } }
      ];
    }
    return this.collection.find(query).toArray();
  }

  async create(data: Omit<VocabularyDocument, "_id">): Promise<VocabularyDocument> {
    const result = await this.collection.insertOne(data as VocabularyDocument);
    return { ...data, _id: result.insertedId } as VocabularyDocument;
  }

  async update(id: string, data: Partial<VocabularyDocument>): Promise<VocabularyDocument | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
