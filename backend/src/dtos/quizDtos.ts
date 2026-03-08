import { QuizScopeType } from "../models/Quiz";

export type CreateQuizDto = {
  scopeType: QuizScopeType;
  scopeId?: string;
  title: string;
  passScore: number;
  isPublished: boolean;
};

export type UpdateQuizDto = {
  scopeType?: QuizScopeType;
  scopeId?: string;
  title?: string;
  passScore?: number;
  isPublished?: boolean;
};

export type SubmitQuizDto = {
  quizId: string;
  answers: Record<string, string>;
};
