import * as googleTTS from "google-tts-api";

export class TTSService {
  async textToSpeech(text: string, language: string = "en"): Promise<string> {
    try {
      // Tải trực tiếp âm thanh dạng chuỗi Base64 ở Backend để tránh việc
      // Google chặn request (lỗi lưu lượng bất thường) khi gọi trực tiếp từ thẻ <audio> ở Frontend
      const base64Audio = await googleTTS.getAudioBase64(text, {
        lang: language,
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });
      
      return `data:audio/mp3;base64,${base64Audio}`;
    } catch (error) {
      console.error("Google TTS Error:", error);
      throw error;
    }
  }
}
