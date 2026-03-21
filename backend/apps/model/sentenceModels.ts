export interface CreateSentenceDto {
  lesson_id: string;
  text: string;
  type: "speaking" | "listening";
  audio_url?: string;
  order: number;
}

export interface UpdateSentenceDto {
  lesson_id?: string;
  text?: string;
  type?: "speaking" | "listening";
  audio_url?: string;
  order?: number;
}
