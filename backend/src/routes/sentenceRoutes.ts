import { Router } from "express";
import { SentenceController } from "../controllers/SentenceController";
import { SentenceService } from "../services/SentenceService";
import { SentenceRepository } from "../repositories/SentenceRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const sentenceRepo = new SentenceRepository();
const sentenceService = new SentenceService(sentenceRepo);
const sentenceController = new SentenceController(sentenceService);

router.get("/", sentenceController.listSentences);
router.get("/:id", sentenceController.getSentenceById);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.createSentence);
router.put("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.updateSentence);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), sentenceController.deleteSentence);

export default router;
