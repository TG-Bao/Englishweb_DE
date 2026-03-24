import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export class STTService {
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
   * MOCK STT implementation for now
   * In production, you would use OpenAI Whisper or Google Speech-to-Text
   */
  async speechToText(audioPath: string, expectedText: string): Promise<string> {
    // REAL implementation would use OpenAI Whisper or Google Speech-to-Text.
    // Since we are looking for a FREE option, we prefer Browser's Web Speech API from the frontend.
    console.warn(`STT FALLBACK: Returning expected text because no API key is provided for ${audioPath}`);
    return expectedText; 
  }
}
