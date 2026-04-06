import { Router } from "express";
import { AuthController } from "./AuthController";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.post("/register", (req, res, next) => new AuthController().register(req, res, next));
router.post("/login", (req, res, next) => new AuthController().login(req, res, next));
router.patch("/profile", AuthMiddleware.authenticate, (req, res, next) => new AuthController().updateProfile(req, res, next));
router.post("/change-password", AuthMiddleware.authenticate, (req, res, next) => new AuthController().changePassword(req, res, next));

export default router;
