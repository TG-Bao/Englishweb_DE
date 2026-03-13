import bcrypt from "bcryptjs";
import { connectDb } from "./config/db";
import { Database } from "./config/Database";
import { UserDocument, USER_COLLECTION } from "./models/User";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "./models/Vocabulary";
import { QuizDocument, QUIZ_COLLECTION } from "./models/Quiz";
import { TopicDocument, TOPIC_COLLECTION } from "./models/Topic";
import { QuestionDocument, QUESTION_COLLECTION } from "./models/Question";
import { LevelDocument, LEVEL_COLLECTION } from "./models/Level";
import { GrammarExerciseDocument, GRAMMAR_EXERCISE_COLLECTION } from "./models/GrammarExercise";
import { ExerciseOptionDocument, EXERCISE_OPTION_COLLECTION } from "./models/ExerciseOption";

const seed = async () => {
  await connectDb();
  const db = Database.getInstance();

  const users = db.getCollection<UserDocument>(USER_COLLECTION);
  const topics = db.getCollection<TopicDocument>(TOPIC_COLLECTION);
  const vocabs = db.getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);
  const quizzes = db.getCollection<QuizDocument>(QUIZ_COLLECTION);
  const questions = db.getCollection<QuestionDocument>(QUESTION_COLLECTION);
  const levels = db.getCollection<LevelDocument>(LEVEL_COLLECTION);
  const grammarExercises = db.getCollection<GrammarExerciseDocument>(GRAMMAR_EXERCISE_COLLECTION);
  const exerciseOptions = db.getCollection<ExerciseOptionDocument>(EXERCISE_OPTION_COLLECTION);

  // 1. Seed Admin User
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123";
  const existingAdmin = await users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await users.insertOne({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN"
    } as UserDocument);
    console.log("Created admin user: admin@example.com / Admin123");
  }

  // 2. Seed Levels
  if (await levels.countDocuments() === 0) {
    await levels.insertMany([
      { name: "A1", description: "Beginner", minPoints: 0, order: 1, isPublished: true, createdAt: new Date() },
      { name: "A2", description: "Elementary", minPoints: 100, order: 2, isPublished: true, createdAt: new Date() },
      { name: "B1", description: "Intermediate", minPoints: 300, order: 3, isPublished: true, createdAt: new Date() },
      { name: "B2", description: "Upper Intermediate", minPoints: 600, order: 4, isPublished: true, createdAt: new Date() },
      { name: "C1", description: "Advanced", minPoints: 1000, order: 5, isPublished: true, createdAt: new Date() },
      { name: "C2", description: "Proficiency", minPoints: 1500, order: 6, isPublished: true, createdAt: new Date() }
    ]);
    console.log("Seeded basic levels");
  }

  // 3. Seed Topics (Integrated Grammar Theory)
  const topicData = [
    { 
      title: "Possessive Pronouns", 
      theory: "Use my, your, his, her, our, their to show ownership.",
      examples: ["This is my brother.", "Their house is big."],
      order: 1, level: "A1", isPublished: true 
    },
    { 
      title: "Present Simple", 
      theory: "Use present simple for habits and routines.",
      examples: ["I wake up early.", "She goes to school."],
      order: 2, level: "A2", isPublished: true 
    },
    { 
      title: "Family", 
      description: "Learn vocabulary about family.", 
      order: 3, level: "A2", isPublished: true 
    }
  ];

  for (const t of topicData) {
    await topics.updateOne(
      { title: t.title },
      { $set: { ...t, updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log("Ensured topics exist with theory and examples");

  const allTopics = await topics.find().toArray();
  const familyTopic = allTopics.find(t => t.title === "Family")!;
  const presentSimpleTopic = allTopics.find(t => t.title === "Present Simple")!;

  // 4. Seed Vocabulary
  if (await vocabs.countDocuments() === 0) {
    await vocabs.insertMany([
      { topicId: familyTopic._id!, word: "sibling", meaning: "brother or sister", level: "A2", topic: "Family" },
      { topicId: familyTopic._id!, word: "cousin", meaning: "child of aunt/uncle", level: "A2", topic: "Family" }
    ] as VocabularyDocument[]);
    console.log("Seeded vocabulary");
  }

  // 5. Seed Grammar Exercises
  if (await grammarExercises.countDocuments() === 0) {
    // MCQ Example
    const ex1 = await grammarExercises.insertOne({
      topicId: presentSimpleTopic._id!,
      question: "She ___ (brush) her teeth twice a day.",
      type: "MCQ",
      explanation: "Chủ ngữ 'She' là ngôi thứ 3 số ít, động từ brush kết thúc bằng 'sh' nên thêm 'es'.",
      createdAt: new Date()
    });
    await exerciseOptions.insertMany([
      { exerciseId: ex1.insertedId, content: "brush", isCorrect: false },
      { exerciseId: ex1.insertedId, content: "brushes", isCorrect: true },
      { exerciseId: ex1.insertedId, content: "brushing", isCorrect: false }
    ] as ExerciseOptionDocument[]);

    // FILL Example
    const ex2 = await grammarExercises.insertOne({
      topicId: presentSimpleTopic._id!,
      question: "They ___ (not/like) coffee.",
      type: "FILL",
      explanation: "Phủ định với 'They' dùng 'do not' hoặc 'don't'.",
      createdAt: new Date()
    });
    await exerciseOptions.insertOne({
      exerciseId: ex2.insertedId,
      content: "don't like",
      isCorrect: true
    } as ExerciseOptionDocument);

    console.log("Seeded grammar exercises");
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
