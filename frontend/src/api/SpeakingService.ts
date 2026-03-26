import { api } from './client';

export const SpeakingService = {
  submitRecording: async (audioBlob: Blob, userId: string, sentenceId: string, browserTranscript: string) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("userId", userId);
    formData.append("sentenceId", sentenceId);
    formData.append("browserTranscript", browserTranscript);

    const res = await api.post("/speaking", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data; // Keep res.data because component expects { success, data }
  },

  getProgress: async (userId: string) => {
    const res = await api.get(`/speaking/progress/${userId}`);
    return res.data; // res.data is { success: true, data: [...] }
  }
};
