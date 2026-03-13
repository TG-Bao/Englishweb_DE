import { ObjectId } from "mongodb";

export interface ExerciseOptionDocument {
  _id?: ObjectId;
  exerciseId: ObjectId;
  content: string;
  isCorrect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const EXERCISE_OPTION_COLLECTION = "exercise_options";
