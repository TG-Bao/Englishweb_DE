import { ProgressDocument } from "../../models/Progress";

export interface IProgressRepository {
  getByUserId(userId: string): Promise<ProgressDocument | null>;
  upsert(userId: string, data: Partial<ProgressDocument>): Promise<ProgressDocument>;
}
