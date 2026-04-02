import { ObjectId } from "mongodb";

export class Grammar {
  _id?: ObjectId;
  level!: string;
  title!: string;
  description!: string;
  examples!: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {}
}

export const GRAMMAR_COLLECTION = "grammars";
