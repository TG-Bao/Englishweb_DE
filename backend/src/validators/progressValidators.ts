import { MarkGrammarDto, MarkVocabularyDto } from "../dtos/progressDtos";
import { requireString } from "./common";

export const validateMarkVocabulary = (payload: any): MarkVocabularyDto => {
  return {
    lessonId: requireString(payload?.lessonId, "lessonId"),
    vocabId: requireString(payload?.vocabId, "vocabId")
  };
};

export const validateMarkGrammar = (payload: any): MarkGrammarDto => {
  return {
    lessonId: requireString(payload?.lessonId, "lessonId"),
    grammarId: requireString(payload?.grammarId, "grammarId")
  };
};
