import { api } from "../api/client";

export interface LessonItem {
  _id: string;
  title: string;
  image: string;
  level_id: string;
  order: number;
  isPublished: boolean;
}

class LessonService {
  async getAll() {
    const res = await api.get("/lessons", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data as LessonItem[];
  }

  async getById(id: string) {
    const res = await api.get(`/lessons/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data as LessonItem;
  }

  async create(data: Partial<LessonItem>) {
    const res = await api.post("/lessons", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data;
  }

  async update(id: string, data: Partial<LessonItem>) {
    const res = await api.patch(`/lessons/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data.data;
  }

  async delete(id: string) {
    const res = await api.delete(`/lessons/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return res.data;
  }
}

export const lessonService = new LessonService();
