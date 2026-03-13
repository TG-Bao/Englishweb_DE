import { GrammarExerciseRepository } from "../repositories/GrammarExerciseRepository";
import { ExerciseOptionRepository } from "../repositories/ExerciseOptionRepository";
import { UserExerciseResultRepository } from "../repositories/UserExerciseResultRepository";

export class GrammarExerciseService {
  constructor(
    private exerciseRepo: GrammarExerciseRepository,
    private optionRepo: ExerciseOptionRepository,
    private resultRepo: UserExerciseResultRepository
  ) {}

  async getExercisesByGrammar(grammarId: string) {
    const exercises = await this.exerciseRepo.findByGrammar(grammarId);
    if (!exercises.length) return [];

    const exerciseIds = exercises.map(e => e._id!.toString());
    const allOptions = await this.optionRepo.findByExercises(exerciseIds);

    return exercises.map(exercise => {
      const options = allOptions
        .filter(opt => opt.exerciseId.toString() === exercise._id!.toString())
        .map(opt => ({
          id: opt._id,
          content: opt.content,
          // Ẩn isCorrect khi trả về danh sách cho người học
        }));

      return {
        ...exercise,
        options
      };
    });
  }

  async submitAnswer(userId: string, exerciseId: string, submittedAnswer: string) {
    const exercise = await this.exerciseRepo.findById(exerciseId);
    if (!exercise) {
      throw new Error("Không tìm thấy bài tập");
    }

    const options = await this.optionRepo.findByExercise(exerciseId);
    let isCorrect = false;

    if (exercise.type === "MCQ") {
      const correctOption = options.find(opt => opt.isCorrect);
      isCorrect = correctOption?.content === submittedAnswer;
    } else if (exercise.type === "FILL") {
      // Đối với FILL, so sánh text (có thể cần chuẩn hóa whitespace/lowercase)
      const correctOption = options.find(opt => opt.isCorrect);
      isCorrect = correctOption?.content.trim().toLowerCase() === submittedAnswer.trim().toLowerCase();
    }

    const result = await this.resultRepo.create({
      userId: (userId as any), // Cast sang ObjectId trong repo nếu cần
      exerciseId: (exerciseId as any),
      submittedAnswer,
      isCorrect,
      createdAt: new Date()
    });

    return {
      isCorrect,
      explanation: exercise.explanation,
      correctAnswer: options.find(opt => opt.isCorrect)?.content
    };
  }
}
