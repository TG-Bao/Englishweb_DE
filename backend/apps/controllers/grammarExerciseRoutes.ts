import { Router } from "express";
import { GrammarExerciseController } from "./GrammarExerciseController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();
const ctrl = new GrammarExerciseController();

router.get("/", AuthMiddleware.authenticate, ctrl.listByGrammar);
router.post("/submit", AuthMiddleware.authenticate, ctrl.submit);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), ctrl.create);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), ctrl.delete);

export default router;
