import { CreateQuizDto, SubmitQuizDto, UpdateQuizDto } from "../dtos/quizDtos";
import { optionalBoolean, optionalNumber, optionalString, requireString } from "./common";
import { AppError } from "../utils/AppError";

export const validateCreateQuiz = (payload: any): CreateQuizDto => {
  return {
    scopeType: payload?.scopeType as any,
    scopeId: optionalString(payload?.scopeId),
    title: requireString(payload?.title, "title"),
    passScore: optionalNumber(payload?.passScore) ?? 70,
    isPublished: optionalBoolean(payload?.isPublished) ?? true
  };
};

export const validateUpdateQuiz = (payload: any): UpdateQuizDto => {
  const dto: UpdateQuizDto = {};
  if (payload?.scopeType !== undefined) dto.scopeType = payload.scopeType as any;
  if (payload?.scopeId !== undefined) dto.scopeId = optionalString(payload.scopeId);
  if (payload?.title !== undefined) dto.title = requireString(payload.title, "title");
  if (payload?.passScore !== undefined) dto.passScore = optionalNumber(payload.passScore);
  if (payload?.isPublished !== undefined) dto.isPublished = optionalBoolean(payload.isPublished);
  return dto;
};

export const validateSubmitQuiz = (payload: any): SubmitQuizDto => {
  const quizId = requireString(payload?.quizId, "quizId");
  const answers = payload?.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new AppError("answers is required", 400);
  }
  return { quizId, answers };
};
