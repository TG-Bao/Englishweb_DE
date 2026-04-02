import { ObjectId, Db, ClientSession } from "mongodb";
import { Topic, TOPIC_COLLECTION } from "../Entity/Topic";
import { ITopicRepository } from "../interfaces/repositories/TopicRepository";

export class TopicRepository implements ITopicRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Topic>(TOPIC_COLLECTION);
  }

  async listPublished(): Promise<Topic[]> {
    return this.collection.find({ isPublished: true }, { session: this.session || undefined }).sort({ order: 1 }).toArray();
  }

  async listAll(): Promise<Topic[]> {
    return this.collection.find({}, { session: this.session || undefined }).sort({ order: 1 }).toArray();
  }

  async findById(id: string): Promise<Topic | null> {
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<Topic, "_id">): Promise<Topic> {
    const result = await this.collection.insertOne(data as Topic, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as Topic;
  }

  async update(id: string, data: Partial<Topic>): Promise<Topic | null> {
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
