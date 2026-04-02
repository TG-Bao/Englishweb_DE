import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { AppError } from "../utils/AppError";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const userId = req.body.userId || "anonymous";
    const uploadPath = path.join(__dirname, "../../public/uploads", userId);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const fileName = `${timestamp}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [".wav", ".mp3", ".m4a", ".webm"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError("Only .wav, .mp3, .m4a and .webm files are allowed", 400) as any);
  }
};

export const uploadAudio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
