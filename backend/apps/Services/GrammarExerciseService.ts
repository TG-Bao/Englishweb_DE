import { MongoClient, Db, ObjectId } from "mongodb";
import { IGrammarExerciseService } from "../interfaces/services/GrammarExerciseService";
import { GrammarExerciseRepository } from "../Repository/GrammarExerciseRepository";
import { ExerciseOptionRepository } from "../Repository/ExerciseOptionRepository";
import { UserExerciseResultRepository } from "../Repository/UserExerciseResultRepository";
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

  async submit(userId: string, exerciseId: string, selectedOptionId: string) {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(exerciseId) || !ObjectId.isValid(selectedOptionId)) {
      throw new AppError("ID người dùng, bài tập hoặc lựa chọn không hợp lệ", 400);
    }

    const exercise = await this.exerciseRepo.findById(exerciseId);
    if (!exercise) throw new AppError("Không tìm thấy bài tập", 404);

    const options = await this.optionRepo.findByExercise(exerciseId);
    const selected = options.find(o => o._id!.toString() === selectedOptionId);
    if (!selected) throw new AppError("Không tìm thấy lựa chọn này cho bài tập đã chọn", 400);

    const isCorrect = selected.isCorrect;

    // Check if the user has already submitted an answer for this exercise
    const existingResult = await this.resultRepo.findByUserAndExercise(userId, exerciseId);

    let result;
    if (existingResult) {
      // Update the existing result
      await this.resultRepo.update(existingResult._id!.toString(), {
        selectedOptionId: new ObjectId(selectedOptionId),
        isCorrect: isCorrect,
        createdAt: new Date() // Since UserExerciseResult only has createdAt, we update it
      });
      result = await this.resultRepo.findByUserAndExercise(userId, exerciseId);
    } else {
      // Create a new result
      result = await this.resultRepo.save({
        userId: new ObjectId(userId),
        exerciseId: new ObjectId(exerciseId),
        selectedOptionId: new ObjectId(selectedOptionId),
        isCorrect,
        createdAt: new Date()
      });
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
