import { Router } from "express";
import { UserController } from "./UserController";
import { AuthMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize(["ADMIN"]));

router.get("/stats/count", (req, res, next) => new UserController().getCount(req, res, next));
router.get("/", (req, res, next) => new UserController().getAll(req, res, next));
router.get("/:id", (req, res, next) => new UserController().getOne(req, res, next));
router.patch("/:id", (req, res, next) => new UserController().update(req, res, next));
router.delete("/:id", (req, res, next) => new UserController().remove(req, res, next));

export default router;
