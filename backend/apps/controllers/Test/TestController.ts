import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { TestService } from "../../Services/TestService";
import { DatabaseConnection } from "../../Database/Database";
import { TEST_COLLECTION } from "../../Entity/Test";
import { ObjectId } from "mongodb";
import { AppError } from "../../utils/AppError";

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
    
    // If userId provided, check status
    if (userId) {
      const results = await db.collection("test_results").find({
        userId: new ObjectId(userId as string)
      }).toArray();
      
      const passedTestIds = new Set(results.filter(r => r.score >= 80).map(r => r.testId.toString()));
      const completedTestIds = new Set(results.map(r => r.testId.toString()));
      
      const enrichedTests = tests.map(t => ({
        ...t,
        passed: passedTestIds.has(t._id.toString()),
        completed: completedTestIds.has(t._id.toString())
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

  /**
   * POST /api/tests
   */
  createTest = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, level, questions, timeLimit } = req.body;
    if (!title || !description || !level || !questions) {
      throw new AppError("title, description, level, and questions are required", 400);
    }

    const test = {
      title,
      description,
      level,
      questions,
      timeLimit: timeLimit || 20,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = DatabaseConnection.getMongoClient().db();
    const result = await db.collection(TEST_COLLECTION).insertOne(test);

    return sendSuccess(res, { _id: result.insertedId, ...test }, 201, "Tạo đề thi thành công");
  });

  /**
   * PATCH /api/tests/:id
   */
  updateTest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, level, questions, timeLimit } = req.body;

    const updates: any = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (level !== undefined) updates.level = level;
    if (questions !== undefined) updates.questions = questions;
    if (timeLimit !== undefined) updates.timeLimit = timeLimit;

    const db = DatabaseConnection.getMongoClient().db();
    const result = await db.collection(TEST_COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) throw new AppError("Test not found", 404);

    const updatedTest = await db.collection(TEST_COLLECTION).findOne({ _id: new ObjectId(id) });
    return sendSuccess(res, updatedTest, 200, "Cập nhật đề thi thành công");
  });

  /**
   * DELETE /api/tests/:id
   */
  deleteTest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = DatabaseConnection.getMongoClient().db();
    const result = await db.collection(TEST_COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new AppError("Test not found", 404);

    return sendSuccess(res, null, 200, "Huỷ đề thi thành công");
  });
}
