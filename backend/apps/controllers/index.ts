import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import topicRoutes from "./topicRoutes";
import vocabularyRoutes from "./vocabularyRoutes";
import grammarRoutes from "./grammarRoutes";
import grammarExerciseRoutes from "./grammarExerciseRoutes";
import quizRoutes from "./quizRoutes";
import progressRoutes from "./progressRoutes";
import levelRoutes from "./levelRoutes";
import questionRoutes from "./questionRoutes";
import sentenceRoutes from "./sentenceRoutes";
import lessonRoutes from "./lessonRoutes";
import speakingRoutes from "./speakingRoutes";
import testRoutes from "./testRoutes";
import statisticRoutes from "./statisticRoutes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/topics", topicRoutes);
router.use("/vocabularies", vocabularyRoutes);
router.use("/grammars", grammarRoutes);
router.use("/grammar-exercises", grammarExerciseRoutes);
router.use("/quizzes", quizRoutes);
router.use("/progress", progressRoutes);
router.use("/levels", levelRoutes);
router.use("/questions", questionRoutes);
router.use("/sentences", sentenceRoutes);
router.use("/lessons", lessonRoutes);
router.use("/speaking", speakingRoutes);
router.use("/tests", testRoutes);
router.use("/statistics", statisticRoutes);


router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

export default router;
