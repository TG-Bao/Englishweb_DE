import { CreateLessonDto, UpdateLessonDto } from "../dtos/lessonDtos";
import { optionalBoolean, optionalNumber, optionalString, requireNumber, requireString } from "./common";

export const validateCreateLesson = (payload: any): CreateLessonDto => {
  return {
    topicId: requireString(payload?.topicId, "topicId"),
    title: requireString(payload?.title, "title"),
    description: optionalString(payload?.description),
    order: requireNumber(payload?.order, "order"),
    isPublished: optionalBoolean(payload?.isPublished) ?? true
  };
};

export const validateUpdateLesson = (payload: any): UpdateLessonDto => {
  const dto: UpdateLessonDto = {};
  if (payload?.topicId !== undefined) dto.topicId = requireString(payload.topicId, "topicId");
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.description !== undefined) dto.description = optionalString(payload.description);
  if (payload?.order !== undefined) dto.order = optionalNumber(payload.order);
  if (payload?.isPublished !== undefined) dto.isPublished = optionalBoolean(payload.isPublished);
  return dto;
};
