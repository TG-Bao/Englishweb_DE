import { MarkGrammarDto, MarkVocabularyDto } from "../model/progressModels";
import { requireString } from "./common";

export const validateMarkVocabulary = (payload: any): MarkVocabularyDto => {
  return {
    topicId: requireString(payload?.topicId, "topicId"),
    vocabId: requireString(payload?.vocabId, "vocabId")
  };
};

export const validateMarkGrammar = (payload: any): MarkGrammarDto => {
  return {
    level: requireString(payload?.level, "level"),
    grammarId: requireString(payload?.grammarId, "grammarId"),
    status: payload?.status as any
  };
};
