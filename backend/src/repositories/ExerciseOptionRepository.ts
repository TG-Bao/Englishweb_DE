import { ObjectId } from "mongodb";
import { ExerciseOptionDocument, EXERCISE_OPTION_COLLECTION } from "../models/ExerciseOption";
import { Database } from "../config/Database";

export class ExerciseOptionRepository {
  private get collection() {
    return Database.getInstance().getCollection<ExerciseOptionDocument>(EXERCISE_OPTION_COLLECTION);
  }

  async findByExercise(exerciseId: string): Promise<ExerciseOptionDocument[]> {
    return this.collection.find({ exerciseId: new ObjectId(exerciseId) }).toArray();
  }

  async findByExercises(exerciseIds: string[]): Promise<ExerciseOptionDocument[]> {
    return this.collection.find({ 
      exerciseId: { $in: exerciseIds.map(id => new ObjectId(id)) } 
    }).toArray();
  }

  async create(data: Omit<ExerciseOptionDocument, "_id">): Promise<ExerciseOptionDocument> {
    const result = await this.collection.insertOne(data as ExerciseOptionDocument);
    return { ...data, _id: result.insertedId } as ExerciseOptionDocument;
  }
}
