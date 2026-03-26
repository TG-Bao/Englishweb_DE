import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";
import path from "path";
import fs from "fs";
import { ObjectId } from "mongodb";
import { DatabaseConnection } from "../Database/Database";
import { PROGRESS_COLLECTION } from "../Entity/Progress";
import { SENTENCE_COLLECTION } from "../Entity/Sentence";
import { SpeakingService } from "../Services/SpeakingService";

export class SpeakingController {
  private speakingService: SpeakingService;

  constructor() {
    this.speakingService = new SpeakingService();
  }

  /**
   * API POST /api/speaking
   * Accepts audio, userId, sentenceId
   */
  processSpeaking = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sentenceId, userId, browserTranscript } = req.body;
    const file = req.file;

    if (!file) {
      return next(new AppError("No audio file provided", 400));
    }

    if (!userId || !sentenceId || !ObjectId.isValid(userId) || !ObjectId.isValid(sentenceId)) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return next(new AppError("A valid userId and sentenceId are required", 400));
    }

    try {
      const db = DatabaseConnection.getMongoClient().db();
      
      // Get sentence info to find expected text
      const sentence = await db.collection(SENTENCE_COLLECTION).findOne({ _id: new ObjectId(sentenceId) }) as any;
      if (!sentence) {
        return next(new AppError("Sentence not found", 404));
      }
      const expectedText = sentence.text;

      const finalUrlPath = `/uploads/speaking/${file.filename}`;
      
      const result = await this.speakingService.processSpeaking(
        userId,
        sentenceId,
        finalUrlPath,
        expectedText,
        browserTranscript
      );

      return res.status(201).json({
        success: true,
        data: {
          ...result,
          fileUrl: finalUrlPath
        },
        message: "Speaking practice processed successfully"
      });

    } catch (err: any) {
      console.error("Speaking process error:", err);
      return next(new AppError(err.message, 500));
    }
  });

  /**
   * API GET /api/speaking/progress/:userId
   */
  getSpeakingProgress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    if (!userId || !ObjectId.isValid(userId)) {
      return next(new AppError("Valid User ID is required", 400));
    }

    const progress = await this.speakingService.getProgress(userId);
    return sendSuccess(res, progress);
  });
}
