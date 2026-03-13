import { ObjectId } from "mongodb";

export interface GrammarDocument {
  _id?: ObjectId;
  level: string;
  title: string;
  description: string;
  structure?: string;
  examples: string[];
  mediaUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateGrammarDto = {
  level: string;
  title: string;
  description: string;
  structure?: string;
  examples: string[];
  mediaUrl?: string;
};

export type UpdateGrammarDto = {
  level?: string;
  title?: string;
  description?: string;
  structure?: string;
  examples?: string[];
  mediaUrl?: string;
};

export const GRAMMAR_COLLECTION = "grammars";
