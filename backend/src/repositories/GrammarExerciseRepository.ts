import { ObjectId } from "mongodb";
import { GrammarExerciseDocument, GRAMMAR_EXERCISE_COLLECTION } from "../models/GrammarExercise";
import { Database } from "../config/Database";

export class GrammarExerciseRepository {
  private get collection() {
    return Database.getInstance().getCollection<GrammarExerciseDocument>(GRAMMAR_EXERCISE_COLLECTION);
  }

  async findByGrammar(grammarId: string): Promise<GrammarExerciseDocument[]> {
    return this.collection.find({ grammarId: new ObjectId(grammarId) }).toArray();
  }

  async findById(id: string): Promise<GrammarExerciseDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<GrammarExerciseDocument, "_id">): Promise<GrammarExerciseDocument> {
    const result = await this.collection.insertOne(data as GrammarExerciseDocument);
    return { ...data, _id: result.insertedId } as GrammarExerciseDocument;
  }
}
