export type CreateQuestionDto = {
  quizId: string;
  sourceType: string;
  sourceId?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: string;
};

export type UpdateQuestionDto = {
  quizId?: string;
  sourceType?: string;
  sourceId?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  type?: string;
};
