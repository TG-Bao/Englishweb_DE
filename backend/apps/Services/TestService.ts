import { ObjectId } from "mongodb";
import { DatabaseConnection } from "../Database/Database";
import { Test, TEST_COLLECTION } from "../Entity/Test";
import { TestResult, TEST_RESULT_COLLECTION, UserAnswer } from "../Entity/TestResult";
import { User, USER_COLLECTION, EngLevel } from "../Entity/User";
import { LEVEL_COLLECTION } from "../Entity/Level";
import { AppError } from "../utils/AppError";
import { ProgressionService } from "./ProgressionService";

const progressionService = new ProgressionService();

export class TestService {
  /**
   * Submit a test attempt and grade it
   */
  async submitTest(userId: string, testId: string, userAnswers: { questionId: string; answer: string }[]) {
    const db = DatabaseConnection.getMongoClient().db();
    
    // Check if user already completed this test
    const existingResult = await db.collection(TEST_RESULT_COLLECTION).findOne({
      userId: new ObjectId(userId),
      testId: new ObjectId(testId)
    });

    if (existingResult) {
      throw new AppError("Bạn đã hoàn thành bài thi này và không thể làm lại.", 400);
    }

    // 1. Fetch the test
    const test = await db.collection(TEST_COLLECTION).findOne({ _id: new ObjectId(testId) }) as Test;
    if (!test) throw new AppError("Test not found", 404);

    // 2. Grade each answer
    let correctCount = 0;
    const gradedAnswers: UserAnswer[] = test.questions.map((q) => {
      const userAnswer = userAnswers.find((ua) => ua.questionId === q.id);
      const isCorrect = userAnswer ? (userAnswer.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) : false;
      if (isCorrect) correctCount++;
      
      return {
        questionId: q.id,
        answer: userAnswer?.answer || "",
        isCorrect
      };
    });

    // 3. Calculate score and XP
    const score = (correctCount / test.questions.length) * 100;
    
    // Always award XP if score is 80% or higher (since they can only do it once)
    let totalXPEarned = 0;
    if (score >= 80) {
      const baseXP = 50; // Base XP for passing
      const accuracyXP = score * 1; // e.g. 100% score = 100 XP bonus
      totalXPEarned = Math.round(baseXP + accuracyXP);
    }

    // 4. Save Test Result
    const testResult: TestResult = {
      userId: new ObjectId(userId),
      testId: new ObjectId(testId),
      totalQuestions: test.questions.length,
      correctCount,
      score: Math.round(score),
      xpEarned: totalXPEarned,
      answers: gradedAnswers,
      completedAt: new Date()
    };

    const inserted = await db.collection(TEST_RESULT_COLLECTION).insertOne(testResult);
    
    // 5. Update User XP and Level
    const updatedUser = await progressionService.addXP(userId, totalXPEarned);

    return {
      resultId: inserted.insertedId,
      score: Math.round(score),
      correctCount,
      totalQuestions: test.questions.length,
      xpEarned: totalXPEarned,
      newLevel: updatedUser?.level,
      newTotalXP: updatedUser?.points
    };
  }
}

