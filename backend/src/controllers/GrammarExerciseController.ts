import { Request, Response } from "express";
import { GrammarExerciseService } from "../services/GrammarExerciseService";

export class GrammarExerciseController {
  constructor(private exerciseService: GrammarExerciseService) {}

  listByGrammar = async (req: Request, res: Response) => {
    try {
      const { grammarId } = req.query;
      if (!grammarId) {
        return res.status(400).json({ message: "Thiếu grammarId" });
      }

      const exercises = await this.exerciseService.getExercisesByGrammar(grammarId as string);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  submit = async (req: Request, res: Response) => {
    try {
      const { exerciseId, answer } = req.body;
      const userId = (req as any).user?._id; // Giả định AuthMiddleware gán user vào req

      if (!exerciseId || answer === undefined) {
        return res.status(400).json({ message: "Thiếu dữ liệu nộp bài" });
      }

      const result = await this.exerciseService.submitAnswer(userId, exerciseId, answer);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
