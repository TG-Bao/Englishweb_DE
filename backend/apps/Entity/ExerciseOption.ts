import { ObjectId } from "mongodb";

export class ExerciseOption {
  _id?: ObjectId;
  exerciseId!: ObjectId;
  content!: string;
  isCorrect!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const EXERCISE_OPTION_COLLECTION = "exercise_options";
