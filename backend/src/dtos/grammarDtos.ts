export type CreateGrammarDto = {
  level: string;
  title: string;
  description: string;
  examples: string[];
};

export type UpdateGrammarDto = {
  level?: string;
  title?: string;
  description?: string;
  examples?: string[];
};
