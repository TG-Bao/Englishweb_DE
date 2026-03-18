import { GrammarExercise } from "../../Entity/GrammarExercise";

export interface IGrammarExerciseRepository {
  listByGrammar(grammarId: string): Promise<GrammarExercise[]>;
  findById(id: string): Promise<GrammarExercise | null>;
  create(data: Omit<GrammarExercise, "_id">): Promise<GrammarExercise>;
}
