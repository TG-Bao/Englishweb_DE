import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import { env } from "../../Config/env";

export class STTService {
  private openai: OpenAI | null = null;

  constructor() {
    if (env.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: env.openaiApiKey,
      });
    }
  }

  /**
   * Converts audio to WAV format for STT
   * Note: Requires ffmpeg to be installed on the system
   */
  async convertAudio(inputPath: string): Promise<string> {
    const outputPath = inputPath.replace(path.extname(inputPath), ".wav");
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("wav")
        .audioChannels(1)
        .audioFrequency(16000)
        .on("end", () => resolve(outputPath))
        .on("error", (err) => {
          console.error("FFMPEG Error:", err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  /**
   * Real STT implementation using OpenAI Whisper
   * Now includes automatic conversion to standard WAV if needed
   */
  async speechToText(audioPath: string, expectedText: string): Promise<string> {
    if (!this.openai) {
      console.warn(`STT ERROR: No OpenAI API key provided for ${audioPath}`);
      return ""; 
    }

    let processingPath = audioPath;
    let isConverted = false;

    try {
      // 1. Convert to standardized WAV if not already or if recommended
      // Whisper supports many formats, but 16kHz Mono WAV is most reliable for short clips
      if (!audioPath.endsWith(".wav")) {
        try {
          processingPath = await this.convertAudio(audioPath);
          isConverted = true;
        } catch (convErr) {
          console.error("Conversion failed, attempting with original file:", convErr);
          processingPath = audioPath;
        }
      }

      // 2. Transcribe
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(processingPath),
        model: "whisper-1",
        language: "en",
        prompt: expectedText // Use expected text as hint for better accuracy
      });

      return response.text;
    } catch (err: any) {
      console.error("OpenAI Whisper Error:", err);
      return "";
    } finally {
      // 3. Clean up the converted file if it was created
      if (isConverted && fs.existsSync(processingPath)) {
        try {
          fs.unlinkSync(processingPath);
        } catch (e) {
          console.error("Failed to delete temp wav file:", e);
        }
      }
    }
  }
}
