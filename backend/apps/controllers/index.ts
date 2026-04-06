import { Router } from "express";
import authRoutes from "./Auth/authRoutes";
import userRoutes from "./User/userRoutes";
import topicRoutes from "./Topic/topicRoutes";
import vocabularyRoutes from "./Vocabulary/vocabularyRoutes";
import grammarRoutes from "./Grammar/grammarRoutes";
import grammarExerciseRoutes from "./Grammar/grammarExerciseRoutes";
import quizRoutes from "./Quiz/quizRoutes";
import progressRoutes from "./Progress/progressRoutes";
import levelRoutes from "./Level/levelRoutes";
import questionRoutes from "./Question/questionRoutes";
import sentenceRoutes from "./Sentence/sentenceRoutes";
import lessonRoutes from "./Lesson/lessonRoutes";
import speakingRoutes from "./Speaking/speakingRoutes";
import testRoutes from "./Test/testRoutes";
import statisticRoutes from "./Statistics/statisticRoutes";


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
