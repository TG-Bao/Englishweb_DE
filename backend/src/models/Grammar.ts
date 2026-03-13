import { ObjectId } from "mongodb";

export interface GrammarDocument {
  _id?: ObjectId;
  level: string;
  title: string;
  description: string;
  examples: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateGrammarDto = {
  level: string;
  title: string;
  description: string;
  examples: string[];
};

export type UpdateGrammarDto = {
  level?: string;
  title?: string;
  description?: string;
  examples?: string[];
};

export const GRAMMAR_COLLECTION = "grammars";
