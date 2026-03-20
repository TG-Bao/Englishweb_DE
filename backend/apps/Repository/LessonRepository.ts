import { ObjectId, Db, ClientSession } from "mongodb";
import { Lesson, LESSON_COLLECTION } from "../Entity/Lesson";
import { ILessonRepository } from "../interfaces/repositories/LessonRepository";

export class LessonRepository implements ILessonRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Lesson>(LESSON_COLLECTION);
  }

  async list(): Promise<Lesson[]> {
    return this.collection.find({}, { session: this.session || undefined }).sort({ order: 1 }).toArray();
  }

  async listByLevel(levelId: string): Promise<Lesson[]> {
    return this.collection.find({ level_id: new ObjectId(levelId) }, { session: this.session || undefined }).sort({ order: 1 }).toArray();
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Lesson, "_id">): Promise<Lesson> {
    const result = await this.collection.insertOne(data as Lesson, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as Lesson;
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
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
