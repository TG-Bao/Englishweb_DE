export type CreateVocabularyDto = {
  topicId: string;
  word: string;
  meaning: string;
  example: string;
  topic: string;
  level: string;
  phonetic?: string;
  audioUrl?: string;
};

export type UpdateVocabularyDto = {
  topicId?: string;
  word?: string;
  meaning?: string;
  example?: string;
  topic?: string;
  level?: string;
  phonetic?: string;
  audioUrl?: string;
};
