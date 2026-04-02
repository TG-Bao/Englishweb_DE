import { Progress } from "../../Entity/Progress";

export interface IProgressRepository {
  getByUserId(userId: string): Promise<Progress | null>;
  upsert(userId: string, data: Partial<Progress>): Promise<Progress>;
}
