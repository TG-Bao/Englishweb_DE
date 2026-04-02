import { api } from "../api/client";

export interface SentenceItem {
  _id: string;
  lesson_id: string;
  text: string;
  type: "speaking" | "listening";
  audio_url?: string;
  order: number;
}

class SentenceService {
  async getAll() {
    const res = await api.get("/sentences", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data as SentenceItem[];
  }

  async getByLessonId(lessonId: string) {
    const res = await api.get(`/sentences/lesson/${lessonId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data as SentenceItem[];
  }

  async getById(id: string) {
    const res = await api.get(`/sentences/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data as SentenceItem;
  }

  async create(data: Partial<SentenceItem>) {
    const res = await api.post("/sentences", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data;
  }

  async update(id: string, data: Partial<SentenceItem>) {
    const res = await api.patch(`/sentences/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data;
  }

  async delete(id: string) {
    const res = await api.delete(`/sentences/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data;
  }
}

export const sentenceService = new SentenceService();
