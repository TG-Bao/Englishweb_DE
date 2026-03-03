export type CreateVocabularyDto = {
  lessonId: string;
  word: string;
  meaning: string;
  example: string;
  topic: string;
  level: string;
  phonetic?: string;
  audioUrl?: string;
};

export type UpdateVocabularyDto = {
  lessonId?: string;
  word?: string;
  meaning?: string;
  example?: string;
  topic?: string;
  level?: string;
  phonetic?: string;
  audioUrl?: string;
};
