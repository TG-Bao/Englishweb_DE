import { ObjectId } from "mongodb";

export interface UserExerciseResultDocument {
  _id?: ObjectId;
  userId: ObjectId;
  exerciseId: ObjectId;
  isCorrect: boolean;
  submittedAnswer: string;
  createdAt?: Date;
}

export const USER_EXERCISE_RESULT_COLLECTION = "user_exercise_results";
