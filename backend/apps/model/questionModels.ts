export class CreateQuestionDto {
  quizId!: string;
  sourceType!: "TOPIC" | "GRAMMAR";
  sourceId?: string;
  question!: string;
  options!: string[];
  correctAnswer!: string;
  type!: "MCQ" | "FILL";
  constructor() {}
}

export class UpdateQuestionDto {
  quizId?: string;
  sourceType?: "TOPIC" | "GRAMMAR";
  sourceId?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  type?: "MCQ" | "FILL";
  constructor() {}
}
