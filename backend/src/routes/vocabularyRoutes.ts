import { Router } from "express";
import { VocabularyController } from "../controllers/VocabularyController";
import { VocabularyService } from "../services/VocabularyService";
import { VocabularyRepository } from "../repositories/VocabularyRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const vocabRepo = new VocabularyRepository();
const vocabService = new VocabularyService(vocabRepo);
const vocabController = new VocabularyController(vocabService);

router.get("/", AuthMiddleware.authenticate, vocabController.list);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), vocabController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), vocabController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), vocabController.remove);

export default router;
