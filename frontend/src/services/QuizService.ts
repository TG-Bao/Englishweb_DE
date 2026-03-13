import { api } from "../api/client";

export interface QuizItem {
    _id: string;
    title: string;
    scopeType?: string;
    scopeId?: string;
    passScore?: number;
}

class QuizService {
    async getAll() {
        const res = await api.get("/quiz/all");
        return res.data.data as QuizItem[];
    }

    async getByScope(scopeType: string, scopeId: string) {
        const res = await api.get(`/quiz/scope/${scopeType}/${scopeId}`);
        return res.data.data;
    }

    async create(data: any) {
        const res = await api.post("/quiz", data);
        return res.data;
    }

    async update(id: string, data: any) {
        const res = await api.patch(`/quiz/${id}`, data);
        return res.data;
    }

    async delete(id: string) {
        const res = await api.delete(`/quiz/${id}`);
        return res.data;
    }
}

export const quizService = new QuizService();
