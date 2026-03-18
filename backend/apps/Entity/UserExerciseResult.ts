import { ObjectId } from "mongodb";

export class UserExerciseResult {
  _id?: ObjectId;
  userId!: ObjectId;
  exerciseId!: ObjectId;
  selectedOptionId!: ObjectId;
  isCorrect!: boolean;
  createdAt?: Date;

  constructor() {}
}

export const USER_EXERCISE_RESULT_COLLECTION = "user_exercise_results";
