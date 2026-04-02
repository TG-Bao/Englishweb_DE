import { api } from "../api/client";

export interface LevelItem {
    _id: string;
    name: string;
    description?: string;
    minPoints?: number;
    order: number;
    isPublished: boolean;
}

class LevelService {
    async getAll() {
        const res = await api.get("/levels/all");
        return res.data.data as LevelItem[];
    }

    async getPublished() {
        const res = await api.get("/levels");
        return res.data.data as LevelItem[];
    }

    async create(data: Partial<LevelItem>) {
        const res = await api.post("/levels", data);
        return res.data;
    }

    async update(id: string, data: Partial<LevelItem>) {
        const res = await api.patch(`/levels/${id}`, data);
        return res.data;
    }

    async delete(id: string) {
        const res = await api.delete(`/levels/${id}`);
        return res.data;
    }
}

export const levelService = new LevelService();
