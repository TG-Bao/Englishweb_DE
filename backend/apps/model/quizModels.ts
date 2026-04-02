import { QuizScopeType } from "../Entity/Quiz";

export class CreateQuizDto {
  scopeType!: QuizScopeType;
  scopeId?: string;
  title!: string;
  passScore!: number;
  isPublished!: boolean;
  constructor() {}
}

export class UpdateQuizDto {
  scopeType?: QuizScopeType;
  scopeId?: string;
  title?: string;
  passScore?: number;
  isPublished?: boolean;
  constructor() {}
}

export class SubmitQuizDto {
  quizId!: string;
  answers!: Record<string, string>;
  constructor() {}
}
