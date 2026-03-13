import { CreateGrammarDto, UpdateGrammarDto } from "../dtos/grammarDtos";
import { optionalArray, optionalString, requireString } from "./common";

export const validateCreateGrammar = (payload: any): CreateGrammarDto => {
  return {
    level: requireString(payload?.level, "level"),
    title: requireString(payload?.title, "title"),
    description: requireString(payload?.description, "description"),
    structure: optionalString(payload?.structure),
    examples: optionalArray<string>(payload?.examples) || [],
    mediaUrl: optionalString(payload?.mediaUrl)
  };
};

export const validateUpdateGrammar = (payload: any): UpdateGrammarDto => {
  const dto: UpdateGrammarDto = {};
  if (payload?.level !== undefined) dto.level = requireString(payload.level, "level");
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.description !== undefined) dto.description = requireString(payload.description, "description");
  if (payload?.structure !== undefined) dto.structure = optionalString(payload.structure);
  if (payload?.examples !== undefined) dto.examples = optionalArray<string>(payload.examples);
  if (payload?.mediaUrl !== undefined) dto.mediaUrl = optionalString(payload.mediaUrl);
  return dto;
};
