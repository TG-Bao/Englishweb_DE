import { Lesson } from "../../Entity/Lesson";

export interface ILessonRepository {
  list(): Promise<Lesson[]>;
  listByLevel(levelId: string): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  create(data: Omit<Lesson, "_id">): Promise<Lesson>;
  update(id: string, data: Partial<Lesson>): Promise<Lesson | null>;
  remove(id: string): Promise<void>;
}
