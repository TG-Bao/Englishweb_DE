import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { TestService } from "../Services/TestService";
import { DatabaseConnection } from "../Database/Database";
import { TEST_COLLECTION } from "../Entity/Test";
import { ObjectId } from "mongodb";
import { AppError } from "../utils/AppError";

const testService = new TestService();

export class TestController {
  /**
   * GET /api/tests?level=A1
   */
  getAllTests = asyncHandler(async (req: Request, res: Response) => {
    const { level, userId } = req.query;
    const filter: any = {};
    if (level) filter.level = level;

    const db = DatabaseConnection.getMongoClient().db();
    const tests = await db.collection(TEST_COLLECTION).find(filter).toArray();
    
    // If userId provided, check passed status
    if (userId) {
      const results = await db.collection("test_results").find({
        userId: new ObjectId(userId as string),
        score: { $gte: 80 }
      }).toArray();
      
      const passedTestIds = new Set(results.map(r => r.testId.toString()));
      
      const enrichedTests = tests.map(t => ({
        ...t,
        passed: passedTestIds.has(t._id.toString())
      }));
      
      return sendSuccess(res, enrichedTests);
    }
    
    return sendSuccess(res, tests);
  });


  /**
   * GET /api/tests/:id
   */
  getTestById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = DatabaseConnection.getMongoClient().db();
    const test = await db.collection(TEST_COLLECTION).findOne({ _id: new ObjectId(id) });
    
    if (!test) throw new AppError("Test not found", 404);
    return sendSuccess(res, test);
  });

  /**
   * POST /api/tests/:id/submit
   */
  submitTest = asyncHandler(async (req: Request, res: Response) => {
    const { id: testId } = req.params;
    const { userId, answers } = req.body;

    if (!userId || !answers) {
      throw new AppError("userId and answers are required", 400);
    }

    const result = await testService.submitTest(userId, testId, answers);
    
    return sendSuccess(res, result, 201, "Test submitted successfully");
  });
}
