import { MongoClient, Db, ObjectId } from "mongodb";
import { IGrammarExerciseService } from "../interfaces/services/GrammarExerciseService";
import { GrammarExerciseRepository } from "../Repository/GrammarExerciseRepository";
import { ExerciseOptionRepository } from "../Repository/ExerciseOptionRepository";
import { UserExerciseResultRepository } from "../Repository/UserExerciseResultRepository";
import { UserExerciseResult } from "../Entity/UserExerciseResult";
import { DatabaseConnection } from "../Database/Database";
import { AppError } from "../utils/AppError";

export class GrammarExerciseService implements IGrammarExerciseService {
  private client: MongoClient;
  private database: Db;
  private exerciseRepo: GrammarExerciseRepository;
  private optionRepo: ExerciseOptionRepository;
  private resultRepo: UserExerciseResultRepository;

  constructor() {
    this.client = DatabaseConnection.getMongoClient();
    this.database = this.client.db();
    this.exerciseRepo = new GrammarExerciseRepository(this.database);
    this.optionRepo = new ExerciseOptionRepository(this.database);
    this.resultRepo = new UserExerciseResultRepository(this.database);
  }

  async listByGrammar(grammarId: string) {
    if (!ObjectId.isValid(grammarId)) {
      throw new AppError("ID ngữ pháp không hợp lệ", 400);
    }
    const exercises = await this.exerciseRepo.listByGrammar(grammarId);
    const results = [];
    for (const ex of exercises) {
      const options = await this.optionRepo.findByExercise(ex._id!.toString());
      results.push({ ...ex, options });
    }
    return results;
  }

  async create(data: {
    grammarId: string;
    question: string;
    type: "MCQ" | "FILL";
    explanation?: string;
    options?: { content: string; isCorrect: boolean }[];
  }) {
    if (!ObjectId.isValid(data.grammarId)) throw new AppError("ID ngữ pháp không hợp lệ", 400);

    const exercise = await this.exerciseRepo.create({
      grammarId: new ObjectId(data.grammarId),
      question: data.question,
      type: data.type,
      explanation: data.explanation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOptions: any[] = [];
    if (data.options && data.options.length > 0) {
      for (const opt of data.options) {
        const saved = await this.optionRepo.create({
          exerciseId: exercise._id!,
          content: opt.content,
          isCorrect: opt.isCorrect,
        });
        savedOptions.push(saved);
      }
    }

    return { ...exercise, options: savedOptions };
  }

  async delete(exerciseId: string) {
    if (!ObjectId.isValid(exerciseId)) throw new AppError("ID bài tập không hợp lệ", 400);
    await this.optionRepo.deleteByExercise(exerciseId);
    const deleted = await this.exerciseRepo.delete(exerciseId);
    if (!deleted) throw new AppError("Không tìm thấy bài tập", 404);
  }

  async submit(userId: string, exerciseId: string, answer: string) {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(exerciseId)) {
      throw new AppError("ID người dùng hoặc bài tập không hợp lệ", 400);
    }

    const exercise = await this.exerciseRepo.findById(exerciseId);
    if (!exercise) throw new AppError("Không tìm thấy bài tập", 404);

    const options = await this.optionRepo.findByExercise(exerciseId);
    let isCorrect = false;
    let selectedOptionId: ObjectId | undefined;
    let userAnswer: string | undefined;

    if (exercise.type === "MCQ") {
      if (!ObjectId.isValid(answer)) throw new AppError("Lựa chọn không hợp lệ", 400);
      const selected = options.find(o => o._id!.toString() === answer);
      if (!selected) throw new AppError("Không tìm thấy lựa chọn này", 400);
      isCorrect = selected.isCorrect;
      selectedOptionId = new ObjectId(answer);
    } else {
      // FILL type
      userAnswer = answer;
      const correctOption = options.find(o => o.isCorrect);
      if (correctOption) {
        isCorrect = userAnswer.toLowerCase().trim() === correctOption.content.toLowerCase().trim();
      }
    }

    const existingResult = await this.resultRepo.findByUserAndExercise(userId, exerciseId);

    const resultData: Partial<UserExerciseResult> = {
      selectedOptionId,
      userAnswer,
      isCorrect,
      createdAt: new Date()
    };

    let result;
    if (existingResult) {
      await this.resultRepo.update(existingResult._id!.toString(), resultData);
      result = await this.resultRepo.findByUserAndExercise(userId, exerciseId);
    } else {
      result = await this.resultRepo.save({
        userId: new ObjectId(userId),
        exerciseId: new ObjectId(exerciseId),
        ...resultData
      } as any);
    }

    const correctOption = options.find(o => o.isCorrect);
    return {
      result,
      isCorrect,
      correctAnswer: correctOption?.content || "",
      explanation: exercise.explanation || ""
    };
  }
}
