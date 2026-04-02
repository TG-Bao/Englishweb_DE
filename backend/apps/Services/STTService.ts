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
   */
  async speechToText(audioPath: string, expectedText: string): Promise<string> {
    if (!this.openai) {
      console.warn(`STT ERROR: No OpenAI API key provided for ${audioPath}`);
      return ""; // Return empty to indicate failure
    }

    try {
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-1",
        language: "en"
      });

      return response.text;
    } catch (err: any) {
      console.error("OpenAI Whisper Error:", err);
      // Do not fallback to expected text!
      return "";
    }
  }
}
