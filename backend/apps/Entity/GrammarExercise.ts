import { ObjectId } from "mongodb";

export type GrammarExerciseType = "MCQ" | "FILL";

export class GrammarExercise {
  _id?: ObjectId;
  grammarId!: ObjectId;
  question!: string;
  type!: GrammarExerciseType;
  explanation?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const GRAMMAR_EXERCISE_COLLECTION = "grammar_exercises";
