import { Db, ObjectId } from "mongodb";
import { ProgressRepository } from "../Repository/ProgressRepository";
import { STTService } from "./STTService";
import { ComparisonService } from "./ComparisonService";
import { DatabaseConnection } from "../Database/Database";
import { SENTENCE_COLLECTION } from "../Entity/Sentence";
import { ProgressionService } from "./ProgressionService";

const progressionService = new ProgressionService();

export class SpeakingService {
  private database: Db;
  private progressRepository: ProgressRepository;
  private sttService: STTService;

  constructor() {
    this.database = DatabaseConnection.getMongoClient().db();
    this.progressRepository = new ProgressRepository(this.database);
    this.sttService = new STTService();
  }

  async processSpeaking(
    userId: string, 
    sentenceId: string, 
    audioPath: string, 
    expectedText: string,
    browserTranscript?: string
  ) {
    let transcript = browserTranscript || "";

    const sentence = await this.database.collection(SENTENCE_COLLECTION).findOne({ _id: new ObjectId(sentenceId) });
    const lessonId = sentence?.lesson_id || new ObjectId();

    if (!transcript || transcript.length < expectedText.length * 0.5) {
      transcript = await this.sttService.speechToText(audioPath, expectedText);
    }

    const score = ComparisonService.calculateSimilarity(expectedText, transcript);

    const speakingEntry = {
      sentenceId: new ObjectId(sentenceId),
      lessonId: lessonId,
      audioUrl: audioPath,
      expected: expectedText,
      transcript: transcript,
      accuracy: score,
      isCompleted: true,
      recordedAt: new Date()
    };

    const progress = await this.progressRepository.getByUserId(userId);
    
    // XP Logic: 5 XP per first-time successful sentence (>= 80%)
    let xpAwarded = 0;
    const isNewMastery = score >= 80 && !(progress?.speakingProgress || []).some((p: any) => String(p.sentenceId) === String(sentenceId) && p.accuracy >= 80);
    
    if (isNewMastery) {
      xpAwarded = 5; 
    }

    if (!progress) {
      await this.progressRepository.upsert(userId, {
        userId: new ObjectId(userId),
        speakingProgress: [speakingEntry],
        updatedAt: new Date()
      });
    } else {
      const others = (progress.speakingProgress || []).filter((p: any) => String(p.sentenceId) !== String(sentenceId));
      const currentAttempts = (progress.speakingProgress || []).filter((p: any) => String(p.sentenceId) === String(sentenceId));
      const updatedAttempts = [speakingEntry, ...currentAttempts].slice(0, 4);
      
      await this.progressRepository.upsert(userId, {
        speakingProgress: [...updatedAttempts, ...others],
        updatedAt: new Date()
      });
    }

    let updatedUser = null;
    if (xpAwarded > 0) {
      updatedUser = await progressionService.addXP(userId, xpAwarded);
    }

    return {
      expected: expectedText,
      transcript: transcript,
      score: score,
      xpEarned: xpAwarded,
      newLevel: updatedUser?.level,
      newTotalXP: updatedUser?.points
    };
  }

  async getProgress(userId: string) {
    const progress = await this.progressRepository.getByUserId(userId);
    return progress?.speakingProgress || [];
  }
}

