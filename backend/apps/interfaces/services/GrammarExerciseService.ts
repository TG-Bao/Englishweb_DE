export interface IGrammarExerciseService {
  listByGrammar(grammarId: string): Promise<any[]>;
  submit(userId: string, exerciseId: string, selectedOptionId: string): Promise<any>;
}
