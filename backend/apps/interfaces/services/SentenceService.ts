import { Sentence } from "../../Entity/Sentence";

export interface ISentenceService {
  list(): Promise<Sentence[]>;
  findByLessonId(lessonId: string): Promise<Sentence[]>;
  findById(id: string): Promise<Sentence | null>;
  create(data: Omit<Sentence, "_id" | "createdAt" | "updatedAt">): Promise<Sentence>;
  update(id: string, data: Partial<Sentence>): Promise<Sentence | null>;
  remove(id: string): Promise<void>;
  getSentencesByTopic(topicId: string): Promise<Sentence[]>;
  getSentenceById(id: string): Promise<Sentence | null>;
}
