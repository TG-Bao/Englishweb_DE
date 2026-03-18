import { ObjectId, Db, ClientSession } from "mongodb";
import { UserExerciseResult, USER_EXERCISE_RESULT_COLLECTION } from "../Entity/UserExerciseResult";
import { IUserExerciseResultRepository } from "../interfaces/repositories/UserExerciseResultRepository";

export class UserExerciseResultRepository implements IUserExerciseResultRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<UserExerciseResult>(USER_EXERCISE_RESULT_COLLECTION);
  }

  async save(data: Omit<UserExerciseResult, "_id">): Promise<UserExerciseResult> {
    const result = await this.collection.insertOne(data as UserExerciseResult, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as UserExerciseResult;
  }

  async findByUserAndExercise(userId: string, exerciseId: string): Promise<UserExerciseResult | null> {
    return this.collection.findOne({
      userId: new ObjectId(userId),
      exerciseId: new ObjectId(exerciseId)
    }, { session: this.session || undefined });
  }

  async update(id: string, data: Partial<UserExerciseResult>): Promise<void> {
    if (!ObjectId.isValid(id)) return;
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
      { session: this.session || undefined }
    );
  }
}
