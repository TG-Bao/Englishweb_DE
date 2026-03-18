import { ObjectId, Db, ClientSession } from "mongodb";
import { ExerciseOption, EXERCISE_OPTION_COLLECTION } from "../Entity/ExerciseOption";
import { IExerciseOptionRepository } from "../interfaces/repositories/ExerciseOptionRepository";

export class ExerciseOptionRepository implements IExerciseOptionRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION);
  }

  async findByExercise(exerciseId: string): Promise<ExerciseOption[]> {
    if (!ObjectId.isValid(exerciseId)) return [];
    return this.collection.find({ exerciseId: new ObjectId(exerciseId) }, { session: this.session || undefined }).toArray();
  }

  async create(data: Omit<ExerciseOption, "_id">): Promise<ExerciseOption> {
    const result = await this.collection.insertOne(data as ExerciseOption, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as ExerciseOption;
  }
}
