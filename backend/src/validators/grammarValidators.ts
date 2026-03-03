import { CreateGrammarDto, UpdateGrammarDto } from "../dtos/grammarDtos";
import { optionalArray, optionalString, requireString } from "./common";

export const validateCreateGrammar = (payload: any): CreateGrammarDto => {
  return {
    lessonId: requireString(payload?.lessonId, "lessonId"),
    title: requireString(payload?.title, "title"),
    description: requireString(payload?.description, "description"),
    examples: optionalArray<string>(payload?.examples) || []
  };
};

export const validateUpdateGrammar = (payload: any): UpdateGrammarDto => {
  const dto: UpdateGrammarDto = {};
  if (payload?.lessonId !== undefined) dto.lessonId = requireString(payload.lessonId, "lessonId");
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.description !== undefined) dto.description = requireString(payload.description, "description");
  if (payload?.examples !== undefined) dto.examples = optionalArray<string>(payload.examples);
  return dto;
};
