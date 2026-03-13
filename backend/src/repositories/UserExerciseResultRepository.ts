import { ObjectId } from "mongodb";
import { UserExerciseResultDocument, USER_EXERCISE_RESULT_COLLECTION } from "../models/UserExerciseResult";
import { Database } from "../config/Database";

export class UserExerciseResultRepository {
  private get collection() {
    return Database.getInstance().getCollection<UserExerciseResultDocument>(USER_EXERCISE_RESULT_COLLECTION);
  }

  async create(data: Omit<UserExerciseResultDocument, "_id">): Promise<UserExerciseResultDocument> {
    const result = await this.collection.insertOne(data as UserExerciseResultDocument);
    return { ...data, _id: result.insertedId } as UserExerciseResultDocument;
  }

  async findByUserAndExercise(userId: string, exerciseId: string): Promise<UserExerciseResultDocument | null> {
    return this.collection.findOne({ 
      userId: new ObjectId(userId), 
      exerciseId: new ObjectId(exerciseId) 
    });
  }
}
