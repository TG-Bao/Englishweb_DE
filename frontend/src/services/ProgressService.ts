import { api } from "../api/client";

export const ProgressService = {
  getMyProgress: async () => {
    const res = await api.get("/progress");
    return res.data.data;
  },

  markVocabularyLearned: async (topicId: string, vocabId: string) => {
    const res = await api.post("/progress/vocabulary/mark", { topicId, vocabId });
    return res.data.data;
  },

  markGrammarLearned: async (level: string, grammarId: string) => {
    const res = await api.post("/progress/grammar/mark", { level, grammarId });
    return res.data.data;
  }
};
