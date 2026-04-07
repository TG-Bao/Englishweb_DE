import { Router } from "express";
import { SpeakingController } from "./SpeakingController";
import { uploadAudio } from "../../middleware/uploadMiddleware";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new SpeakingController();

/**
 * POST /api/speaking
 * Handles audio file upload for speaking exercises
 */
router.post("/", AuthMiddleware.authenticate, uploadAudio.single("audio"), (req, res, next) => {
  controller.processSpeaking(req, res, next);
});

router.get("/progress/:userId", AuthMiddleware.authenticate, (req, res, next) => {
  controller.getSpeakingProgress(req, res, next);
});

export default router;
