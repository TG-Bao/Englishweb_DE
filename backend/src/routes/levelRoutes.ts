import { Router } from "express";
import { LevelController } from "../controllers/LevelController";
import { LevelService } from "../services/LevelService";
import { LevelRepository } from "../repositories/LevelRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const levelRepo = new LevelRepository();
const levelService = new LevelService(levelRepo);
const levelController = new LevelController(levelService);

router.get("/", AuthMiddleware.authenticate, levelController.listPublished);
router.get("/all", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), levelController.listAll);
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), levelController.create);
router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), levelController.update);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]), levelController.remove);

export default router;
