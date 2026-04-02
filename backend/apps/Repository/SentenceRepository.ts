import { ObjectId, Db, ClientSession } from "mongodb";
import { Sentence, SENTENCE_COLLECTION } from "../Entity/Sentence";
import { ISentenceRepository } from "../interfaces/repositories/SentenceRepository";

export class SentenceRepository implements ISentenceRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Sentence>(SENTENCE_COLLECTION);
  }

  async findByLessonId(lessonId: string): Promise<Sentence[]> {
    if (!lessonId) {
      return this.collection.find({}, { session: this.session || undefined }).sort({ order: 1 }).toArray();
    }
    return this.collection
      .find({ lesson_id: new ObjectId(lessonId) }, { session: this.session || undefined })
      .sort({ order: 1 })
      .toArray();
  }

  async findByTopicId(topicId: string): Promise<Sentence[]> {
    // Sentences không trực tiếp liên kết topic, nên trả về empty array
    // Có thể tìm qua lesson -> topic nếu cần
    return [];
  }

  async findById(id: string): Promise<Sentence | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Sentence, "_id" | "createdAt" | "updatedAt">): Promise<Sentence> {
    const sentence = new Sentence(data);
    const result = await this.collection.insertOne(sentence as Sentence, { session: this.session || undefined });
    return { ...sentence, _id: result.insertedId } as Sentence;
  }

  async update(id: string, data: Partial<Sentence>): Promise<Sentence | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after", session: this.session || undefined }
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }
}
