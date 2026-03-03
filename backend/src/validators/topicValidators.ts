import { CreateTopicDto, UpdateTopicDto } from "../dtos/topicDtos";
import { optionalBoolean, optionalNumber, optionalString, requireNumber, requireString } from "./common";

export const validateCreateTopic = (payload: any): CreateTopicDto => {
  return {
    title: requireString(payload?.title, "title"),
    description: optionalString(payload?.description),
    order: requireNumber(payload?.order, "order"),
    level: requireString(payload?.level, "level"),
    isPublished: optionalBoolean(payload?.isPublished) ?? true
  };
};

export const validateUpdateTopic = (payload: any): UpdateTopicDto => {
  const dto: UpdateTopicDto = {};
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.description !== undefined) dto.description = optionalString(payload.description);
  if (payload?.order !== undefined) dto.order = optionalNumber(payload.order);
  if (payload?.level !== undefined) dto.level = requireString(payload.level, "level");
  if (payload?.isPublished !== undefined) dto.isPublished = optionalBoolean(payload.isPublished);
  return dto;
};
