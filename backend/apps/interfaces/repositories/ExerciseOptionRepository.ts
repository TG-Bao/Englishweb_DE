import { ExerciseOption } from "../../Entity/ExerciseOption";

export interface IExerciseOptionRepository {
  findByExercise(exerciseId: string): Promise<ExerciseOption[]>;
  create(data: Omit<ExerciseOption, "_id">): Promise<ExerciseOption>;
}
