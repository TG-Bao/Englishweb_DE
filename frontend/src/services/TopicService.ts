import { api } from "../api/client";

export interface TopicItem {
  _id: string;
  title: string;
  order?: number;
  level?: string;
}

export interface SentenceItem {
  _id: string;
  text: string;
  audio_url?: string;
  order: number;
}

class TopicService {
  async getAll() {
    const res = await api.get("/topics/all");
    return res.data.data as TopicItem[];
  }

  async getSentencesForTopic(topicId: string) {
    const res = await api.get(`/topics/${topicId}/sentences`);
    return res.data.data as SentenceItem[];
  }

  async create(data: any) {
    const res = await api.post("/topics", data);
    return res.data;
  }

  async update(id: string, data: any) {
    const res = await api.patch(`/topics/${id}`, data);
    return res.data;
  }

  async delete(id: string) {
    const res = await api.delete(`/topics/${id}`);
    return res.data;
  }
}

export const topicService = new TopicService();
