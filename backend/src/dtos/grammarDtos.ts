export type CreateGrammarDto = {
  level: string;
  title: string;
  description: string;
  structure?: string;
  examples: string[];
  mediaUrl?: string;
};

export type UpdateGrammarDto = {
  level?: string;
  title?: string;
  description?: string;
  structure?: string;
  examples?: string[];
  mediaUrl?: string;
};

