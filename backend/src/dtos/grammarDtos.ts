export type CreateGrammarDto = {
  lessonId: string;
  title: string;
  description: string;
  examples: string[];
};

export type UpdateGrammarDto = {
  lessonId?: string;
  title?: string;
  description?: string;
  examples?: string[];
};
