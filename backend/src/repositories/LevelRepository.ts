import { ObjectId } from "mongodb";
import { LevelDocument, LEVEL_COLLECTION } from "../models/Level";
import { Database } from "../config/Database";
import { ILevelRepository } from "../interfaces/repositories/LevelRepository";

export class LevelRepository implements ILevelRepository {
    private get collection() {
        return Database.getInstance().getCollection<LevelDocument>(LEVEL_COLLECTION);
    }

    async listPublished(): Promise<LevelDocument[]> {
        return this.collection.find({ isPublished: true }).sort({ order: 1 }).toArray();
    }

    async listAll(): Promise<LevelDocument[]> {
        return this.collection.find().sort({ order: 1 }).toArray();
    }

    async findById(id: string): Promise<LevelDocument | null> {
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async create(data: Omit<LevelDocument, "_id">): Promise<LevelDocument> {
        const result = await this.collection.insertOne(data as LevelDocument);
        return { ...data, _id: result.insertedId } as LevelDocument;
    }

    async update(id: string, data: Partial<LevelDocument>): Promise<LevelDocument | null> {
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
