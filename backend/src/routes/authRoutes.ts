import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/profile", AuthMiddleware.authenticate, authController.updateProfile);
router.post("/change-password", AuthMiddleware.authenticate, authController.changePassword);

export default router;
