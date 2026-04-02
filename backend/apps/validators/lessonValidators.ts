import { CreateLessonDto, UpdateLessonDto } from "../model/lessonModels";
import { optionalBoolean, optionalNumber, optionalString, requireNumber, requireString } from "./common";

export const validateCreateLesson = (payload: any): CreateLessonDto => {
  return {
    title: requireString(payload?.title, "title"),
    image: requireString(payload?.image, "image"),
    order: requireNumber(payload?.order, "order"),
    level_id: requireString(payload?.level_id, "level_id"),
    isPublished: optionalBoolean(payload?.isPublished) ?? true
  };
};

export const validateUpdateLesson = (payload: any): UpdateLessonDto => {
  const dto: UpdateLessonDto = {};
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.image !== undefined) dto.image = requireString(payload.image, "image");
  if (payload?.order !== undefined) dto.order = optionalNumber(payload.order);
  if (payload?.level_id !== undefined) dto.level_id = requireString(payload.level_id, "level_id");
  if (payload?.isPublished !== undefined) dto.isPublished = optionalBoolean(payload.isPublished);
  return dto;
};
