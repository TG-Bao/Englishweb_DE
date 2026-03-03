import { TopicDocument } from "../models/Topic";
import { ITopicRepository } from "../interfaces/repositories/TopicRepository";
import { ITopicService } from "../interfaces/services/TopicService";

export class TopicService implements ITopicService {
  constructor(private topicRepo: ITopicRepository) {}

  listPublished() {
    return this.topicRepo.listPublished();
  }

  listAll() {
    return this.topicRepo.listAll();
  }

  create(data: Omit<TopicDocument, "_id">) {
    return this.topicRepo.create(data);
  }

  update(id: string, data: Partial<TopicDocument>) {
    return this.topicRepo.update(id, data);
  }

  remove(id: string) {
    return this.topicRepo.remove(id);
  }
}
