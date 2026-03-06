import { api } from "../api/client";

export interface UserItem {
    _id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    level?: string;
    targetLevel?: string;
    learningGoal?: string;
    isActive?: boolean;
    lastLoginAt?: string;
    createdAt?: string;
    address?: string;
    points?: number;
    totalLessons?: number;
}

class UserService {
    async getAll() {
        const res = await api.get("/users");
        return res.data.data as UserItem[];
    }

    async getById(id: string) {
        const res = await api.get(`/users/${id}`);
        return res.data.data as UserItem;
    }

    async update(id: string, data: Partial<UserItem>) {
        const res = await api.patch(`/users/${id}`, data);
        return res.data;
    }

    async delete(id: string) {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    }

    async getCount() {
        const res = await api.get("/users/stats/count");
        return res.data.data.total as number;
    }
}

export const userService = new UserService();
