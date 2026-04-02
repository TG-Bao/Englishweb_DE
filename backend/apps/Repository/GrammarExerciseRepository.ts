import { ObjectId, Db, ClientSession } from "mongodb";
import { GrammarExercise, GRAMMAR_EXERCISE_COLLECTION } from "../Entity/GrammarExercise";
import { IGrammarExerciseRepository } from "../interfaces/repositories/GrammarExerciseRepository"

export class GrammarExerciseRepository implements IGrammarExerciseRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION);
  }

  async listByGrammar(grammarId: string): Promise<GrammarExercise[]> {
    if (!ObjectId.isValid(grammarId)) return [];
    return this.collection.find({ grammarId: new ObjectId(grammarId) }, { session: this.session || undefined }).toArray();
  }

  async findById(id: string): Promise<GrammarExercise | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }

  async create(data: Omit<GrammarExercise, "_id">): Promise<GrammarExercise> {
    const result = await this.collection.insertOne(data as GrammarExercise, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as GrammarExercise;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
    return result.deletedCount > 0;
  }

  async deleteByGrammar(grammarId: string): Promise<void> {
    if (!ObjectId.isValid(grammarId)) return;
    await this.collection.deleteMany({ grammarId: new ObjectId(grammarId) }, { session: this.session || undefined });
  }
}
