export class CreateGrammarDto {
  level!: string;
  title!: string;
  description!: string;
  structure?: string;
  examples!: string[];
  mediaUrl?: string;
  constructor() {}
}

export class UpdateGrammarDto {
  level?: string;
  title?: string;
  description?: string;
  structure?: string;
  examples?: string[];
  mediaUrl?: string;
  constructor() {}
}
