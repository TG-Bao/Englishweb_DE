import { CreateSentenceDto, UpdateSentenceDto } from "../model/sentenceModels";
import { requireString, optionalString, requireNumber, optionalNumber } from "./common";

export const validateCreateSentence = (payload: any): CreateSentenceDto => {
  return {
    lesson_id: requireString(payload?.lesson_id, "lesson_id"),
    text: requireString(payload?.text, "text"),
    type: requireString(payload?.type, "type") as "speaking" | "listening",
    audio_url: optionalString(payload?.audio_url),
    order: requireNumber(payload?.order, "order")
  };
};

export const validateUpdateSentence = (payload: any): UpdateSentenceDto => {
  const dto: UpdateSentenceDto = {};
  if (payload?.lesson_id !== undefined) dto.lesson_id = requireString(payload.lesson_id, "lesson_id");
  if (payload?.text !== undefined) dto.text = requireString(payload.text, "text");
  if (payload?.type !== undefined) dto.type = requireString(payload.type, "type") as "speaking" | "listening";
  if (payload?.audio_url !== undefined) dto.audio_url = optionalString(payload.audio_url);
  if (payload?.order !== undefined) dto.order = optionalNumber(payload.order);
  return dto;
};
