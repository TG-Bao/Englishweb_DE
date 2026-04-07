export class CreateVocabularyDto {
  topicId!: string;
  word!: string;
  meaning!: string;
  example!: string;
  topic!: string;
  level!: string;
  definitionVi?: string;
  exampleVi?: string;
  phonetic?: string;
  audioUrl?: string;
  constructor() {}
}

export class UpdateVocabularyDto {
  topicId?: string;
  word?: string;
  meaning?: string;
  example?: string;
  topic?: string;
  level?: string;
  definitionVi?: string;
  exampleVi?: string;
  phonetic?: string;
  audioUrl?: string;
  constructor() {}
}
