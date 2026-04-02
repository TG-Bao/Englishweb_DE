export class MarkVocabularyDto {
  topicId!: string;
  vocabId!: string;
  constructor() {}
}

export class MarkGrammarDto {
  level!: string;
  grammarId!: string;
  status?: string;
  constructor() {}
}

export class ProgressResponse {
  userId!: string;
  topicProgress!: any[];
  levelProgress!: any[];
  constructor() {}
}
