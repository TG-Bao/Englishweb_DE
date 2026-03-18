import { ObjectId, Db, ClientSession } from "mongodb";
import { Level, LEVEL_COLLECTION } from "../Entity/Level";
import { ILevelRepository } from "../interfaces/repositories/LevelRepository";

export class LevelRepository implements ILevelRepository {
    constructor(private database: Db, private session: ClientSession | null = null) {}

    private get collection() {
        return this.database.collection<Level>(LEVEL_COLLECTION);
    }

    async listPublished(): Promise<Level[]> {
        return this.collection.find({ isPublished: true }, { session: this.session || undefined }).sort({ order: 1 }).toArray();
    }

    async listAll(): Promise<Level[]> {
        return this.collection.find({}, { session: this.session || undefined }).sort({ order: 1 }).toArray();
    }

    async findById(id: string): Promise<Level | null> {
        return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
    }

    async create(data: Omit<Level, "_id">): Promise<Level> {
        const result = await this.collection.insertOne(data as Level, { session: this.session || undefined });
        return { ...data, _id: result.insertedId } as Level;
    }

    async update(id: string, data: Partial<Level>): Promise<Level | null> {
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
