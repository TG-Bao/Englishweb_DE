export type CreateQuizDto = {
  scopeType: string;
  scopeId?: string;
  title: string;
  passScore: number;
  isPublished: boolean;
};

export type UpdateQuizDto = {
  scopeType?: string;
  scopeId?: string;
  title?: string;
  passScore?: number;
  isPublished?: boolean;
};

export type SubmitQuizDto = {
  quizId: string;
  answers: Record<string, string>;
};
