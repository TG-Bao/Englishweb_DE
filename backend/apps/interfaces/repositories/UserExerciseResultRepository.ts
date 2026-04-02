import { UserExerciseResult } from "../../Entity/UserExerciseResult";

export interface IUserExerciseResultRepository {
  save(data: Omit<UserExerciseResult, "_id">): Promise<UserExerciseResult>;
  findByUserAndExercise(userId: string, exerciseId: string): Promise<UserExerciseResult | null>;
  update(id: string, data: Partial<UserExerciseResult>): Promise<void>;
}
