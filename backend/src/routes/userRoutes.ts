import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// Tất cả các route đều yêu cầu đăng nhập + quyền Admin
router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]));

router.get("/stats/count", userController.getCount);
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
