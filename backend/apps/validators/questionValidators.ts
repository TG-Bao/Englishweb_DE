import { CreateQuestionDto, UpdateQuestionDto } from "../model/questionModels";
import { optionalArray, optionalString, requireArray, requireString } from "./common";

export const validateCreateQuestion = (payload: any): CreateQuestionDto => {
  return {
    quizId: requireString(payload?.quizId, "quizId"),
    sourceType: requireString(payload?.sourceType, "sourceType") as any,
    sourceId: optionalString(payload?.sourceId),
    question: requireString(payload?.question, "question"),
    options: requireArray<string>(payload?.options, "options"),
    correctAnswer: requireString(payload?.correctAnswer, "correctAnswer"),
    type: (optionalString(payload?.type) ?? "MCQ") as any
  };
};

export const validateUpdateQuestion = (payload: any): UpdateQuestionDto => {
  const dto: UpdateQuestionDto = {};
  if (payload?.quizId !== undefined) dto.quizId = requireString(payload.quizId, "quizId");
  if (payload?.sourceType !== undefined) dto.sourceType = requireString(payload.sourceType, "sourceType") as any;
  if (payload?.sourceId !== undefined) dto.sourceId = optionalString(payload.sourceId);
  if (payload?.question !== undefined) dto.question = requireString(payload.question, "question");
  if (payload?.options !== undefined) dto.options = optionalArray<string>(payload.options);
  if (payload?.correctAnswer !== undefined) dto.correctAnswer = requireString(payload.correctAnswer, "correctAnswer");
  if (payload?.type !== undefined) dto.type = optionalString(payload.type) as any;
  return dto;
};
