import { ObjectId } from "mongodb";

export class Lesson {
  _id?: ObjectId;
  title!: string;
  description?: string;
  image!: string;
  level_id!: ObjectId; // A lesson should belong to a level
  order!: number;
  isPublished!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Lesson>) {
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
}

export const LESSON_COLLECTION = "lessons";
