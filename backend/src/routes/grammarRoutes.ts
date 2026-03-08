import { Router } from "express";
import { GrammarController } from "../controllers/GrammarController";
import { GrammarService } from "../services/GrammarService";
import { GrammarRepository } from "../repositories/GrammarRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const grammarService = new GrammarService(new GrammarRepository());
const grammarController = new GrammarController(grammarService);

router.get("/level/:level", AuthMiddleware.authenticate, grammarController.listByLevel);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), grammarController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), grammarController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), grammarController.remove);

export default router;
