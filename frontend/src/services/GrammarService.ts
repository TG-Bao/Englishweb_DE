import { api } from "../api/client";

export interface GrammarLesson {
  _id: string;
  level: string;
  title: string;
  description: string;
  structure?: string;
  examples: string[];
  mediaUrl?: string;
}

export const GrammarService = {
  getByLevel: async (level: string) => {
    const res = await api.get(`/grammar/level/${level}`);
    return res.data.data as GrammarLesson[];
  },

  getById: async (id: string) => {
    const res = await api.get(`/grammar/${id}`);
    return res.data.data as GrammarLesson;
  }
};
