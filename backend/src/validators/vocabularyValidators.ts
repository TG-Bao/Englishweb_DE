import { CreateVocabularyDto, UpdateVocabularyDto } from "../dtos/vocabularyDtos";
import { optionalString, requireString } from "./common";

export const validateCreateVocabulary = (payload: any): CreateVocabularyDto => {
  return {
    lessonId: requireString(payload?.lessonId, "lessonId"),
    word: requireString(payload?.word, "word"),
    meaning: requireString(payload?.meaning, "meaning"),
    example: requireString(payload?.example, "example"),
    topic: requireString(payload?.topic, "topic"),
    level: requireString(payload?.level, "level"),
    phonetic: optionalString(payload?.phonetic),
    audioUrl: optionalString(payload?.audioUrl)
  };
};

export const validateUpdateVocabulary = (payload: any): UpdateVocabularyDto => {
  const dto: UpdateVocabularyDto = {};
  if (payload?.lessonId !== undefined) dto.lessonId = requireString(payload.lessonId, "lessonId");
  if (payload?.word !== undefined) dto.word = requireString(payload.word, "word");
  if (payload?.meaning !== undefined) dto.meaning = requireString(payload.meaning, "meaning");
  if (payload?.example !== undefined) dto.example = requireString(payload.example, "example");
  if (payload?.topic !== undefined) dto.topic = requireString(payload.topic, "topic");
  if (payload?.level !== undefined) dto.level = requireString(payload.level, "level");
  if (payload?.phonetic !== undefined) dto.phonetic = optionalString(payload.phonetic);
  if (payload?.audioUrl !== undefined) dto.audioUrl = optionalString(payload.audioUrl);
  return dto;
};
