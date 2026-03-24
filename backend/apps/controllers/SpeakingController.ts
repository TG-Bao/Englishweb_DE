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
import { STTService } from "../Services/STTService";
import { ComparisonService } from "../Services/ComparisonService";

const sttService = new STTService();


export class SpeakingController {
  /**
   * API POST /api/speaking
   * Accepts audio, userId, sentenceId
   */
  processSpeaking = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sentenceId, userId } = req.body;
    const file = req.file;

    if (!file) {
      return next(new AppError("No audio file provided", 400));
    }

    if (!userId || !sentenceId) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return next(new AppError("userId and sentenceId are required", 400));
    }

    const finalUrlPath = `/static/uploads/${userId}/${file.filename}`;
    const absoluteFilePath = file.path;

    try {
      const db = DatabaseConnection.getMongoClient().db();
      
      // Get sentence info to find lessonId and expected text
      const sentence = await db.collection(SENTENCE_COLLECTION).findOne({ _id: new ObjectId(sentenceId) }) as any;
      if (!sentence) {
        return next(new AppError("Sentence not found", 404));
      }
      const lessonId = sentence.lesson_id;
      const expectedText = sentence.text;

      // ----- SPEECH-TO-TEXT PROCESSING -----
      let transcript = "";
      let accuracy = 0;
      let processedAudioPath = absoluteFilePath;

      // Prefer transcript from browser (it's FREE and highly accurate for English)
      if (req.body.browserTranscript) {
        transcript = req.body.browserTranscript;
        console.log("Using browserTranscript from frontend:", transcript);
      } else {
        // Fallback to Server STT (e.g. OpenAI)
        transcript = await sttService.speechToText(processedAudioPath, expectedText);
      }

      // 3. Compare with correct answer

      accuracy = ComparisonService.calculateSimilarity(transcript, expectedText);

      // ----- DATABASE PERSISTENCE -----
      const speakingEntry = {
        sentenceId: new ObjectId(sentenceId),
        lessonId: lessonId || null,
        audioUrl: finalUrlPath,
        transcript: transcript,
        accuracy: accuracy,
        isCompleted: true,
        recordedAt: new Date()
      };

      // Upsert progress document and add/update speaking entry
      await db.collection(PROGRESS_COLLECTION).updateOne(
        { userId: new ObjectId(userId) },
        { 
          $set: { updatedAt: new Date() },
          $pull: { speakingProgress: { sentenceId: new ObjectId(sentenceId) } } as any
        },
        { upsert: true }
      );

      await db.collection(PROGRESS_COLLECTION).updateOne(
        { userId: new ObjectId(userId) },
        { 
          $push: { speakingProgress: speakingEntry } as any
        }
      );

      return sendSuccess(res, {
        fileUrl: finalUrlPath,
        userId,
        sentenceId,
        transcript,
        accuracy
      }, 201, "Audio uploaded, transcribed and compared successfully");

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
    
    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    const db = DatabaseConnection.getMongoClient().db();
    const progress = await db.collection(PROGRESS_COLLECTION).findOne({ userId: new ObjectId(userId) });

    return sendSuccess(res, progress?.speakingProgress || []);
  });
}
