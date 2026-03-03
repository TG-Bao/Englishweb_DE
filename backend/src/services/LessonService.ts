import { LessonDocument } from "../models/Lesson";
import { ILessonRepository } from "../interfaces/repositories/LessonRepository";
import { ILessonService } from "../interfaces/services/LessonService";

export class LessonService implements ILessonService {
  constructor(private lessonRepo: ILessonRepository) {}

  listByTopic(topicId: string, publishedOnly = true) {
    return this.lessonRepo.listByTopic(topicId, publishedOnly);
  }

  getById(id: string) {
    return this.lessonRepo.findById(id);
  }

  create(data: Omit<LessonDocument, "_id">) {
    return this.lessonRepo.create(data);
  }

  update(id: string, data: Partial<LessonDocument>) {
    return this.lessonRepo.update(id, data);
  }

  remove(id: string) {
    return this.lessonRepo.remove(id);
  }
}
