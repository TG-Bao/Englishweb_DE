import { ObjectId, Db, ClientSession } from "mongodb";
import { Question, QUESTION_COLLECTION } from "../Entity/Question";
import { IQuestionRepository } from "../interfaces/repositories/QuestionRepository";

export class QuestionRepository implements IQuestionRepository {
  constructor(private database: Db, private session: ClientSession | null = null) {}

  private get collection() {
    return this.database.collection<Question>(QUESTION_COLLECTION);
  }

  async listByQuiz(quizId: string): Promise<Question[]> {
    return this.collection.find({ quizId: new ObjectId(quizId) }, { session: this.session || undefined }).toArray();
  }

  async create(data: Omit<Question, "_id">): Promise<Question> {
    const result = await this.collection.insertOne(data as Question, { session: this.session || undefined });
    return { ...data, _id: result.insertedId } as Question;
  }

  async update(id: string, data: Partial<Question>): Promise<Question | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after", session: this.session || undefined }
    );
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) }, { session: this.session || undefined });
  }
}
