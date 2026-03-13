import bcrypt from "bcryptjs";
import { connectDb } from "./config/db";
import { Database } from "./config/Database";
import { UserDocument, USER_COLLECTION } from "./models/User";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "./models/Vocabulary";
import { QuizDocument, QUIZ_COLLECTION } from "./models/Quiz";
import { TopicDocument, TOPIC_COLLECTION } from "./models/Topic";
import { QuestionDocument, QUESTION_COLLECTION } from "./models/Question";
import { LevelDocument, LEVEL_COLLECTION } from "./models/Level";
import { GrammarDocument, GRAMMAR_COLLECTION } from "./models/Grammar";
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
  const grammars = db.getCollection<GrammarDocument>(GRAMMAR_COLLECTION);

  console.log("Cleaning old data...");
  await Promise.all([
    users.deleteMany({}),
    topics.deleteMany({}),
    vocabs.deleteMany({}),
    grammars.deleteMany({}),
    quizzes.deleteMany({}),
    questions.deleteMany({}),
    levels.deleteMany({}),
    grammarExercises.deleteMany({}),
    exerciseOptions.deleteMany({})
  ]);

  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash("Admin123", 10);
  await users.insertOne({
    name: "Admin",
    email: "admin@example.com",
    password: adminPassword,
    role: "ADMIN",
    isActive: true,
    createdAt: new Date()
  } as UserDocument);
  console.log("Admin created: admin@example.com / Admin123");

  // 2. Seed Levels
  const levelData: LevelDocument[] = [
    { name: "A1", description: "Beginner", minPoints: 0, order: 1, isPublished: true, createdAt: new Date() },
    { name: "A2", description: "Elementary", minPoints: 100, order: 2, isPublished: true, createdAt: new Date() },
    { name: "B1", description: "Intermediate", minPoints: 300, order: 3, isPublished: true, createdAt: new Date() }
  ];
  await levels.insertMany(levelData);
  console.log("Levels created");

  // 3. Seed Grammar (Lý Thuyết)
  await grammars.insertMany([
    {
      level: "A1",
      title: "Possessive Pronouns",
      description: "Sử dụng my, your, his, her, our, their để chỉ sự sở hữu.",
      examples: ["This is my brother.", "Their house is big."],
      createdAt: new Date()
    } as GrammarDocument,
    {
      level: "A2",
      title: "Present Simple",
      description: "Thì hiện tại đơn dùng để diễn tả thói quen, lịch trình và sự thật hiển nhiên.",
      examples: ["I wake up early.", "She goes to school."],
      createdAt: new Date()
    } as GrammarDocument
  ]);
  console.log("Grammar lessons created");

  // 4. Seed Topics
  const topicData = [
    { title: "Family", description: "Từ vựng về thành viên trong gia đình", order: 1, level: "A1", isPublished: true, createdAt: new Date() },
    { title: "Travel", description: "Các cụm từ hữu ích khi đi du lịch", order: 2, level: "B1", isPublished: true, createdAt: new Date() },
    { title: "Present Simple - Practice", description: "Bài tập: Thì hiện tại đơn", order: 3, level: "A1", isPublished: true, createdAt: new Date() },
    { title: "Past Simple - Practice", description: "Bài tập: Thì quá khứ đơn", order: 4, level: "A2", isPublished: true, createdAt: new Date() }
  ];
  const topicResults = await topics.insertMany(topicData as TopicDocument[]);
  const familyTopicId = topicResults.insertedIds[0];
  const travelTopicId = topicResults.insertedIds[1];
  const presentSimpleTopicId = topicResults.insertedIds[2];
  const pastSimpleTopicId = topicResults.insertedIds[3];
  console.log("Topics created");

  // 5. Seed Vocabulary
  await vocabs.insertMany([
    { 
      topicId: familyTopicId, 
      word: "mother", 
      meaning: "mẹ", 
      definitionVi: "Người phụ nữ sinh ra và nuôi dưỡng một người (theo cách gọi kính trọng)",
      phonetic: "/ˈmʌð.ɚ/",
      example: "My mother is a teacher.",
      exampleVi: "Mẹ tôi là một giáo viên.",
      level: "A1", 
      topic: "Family", 
      createdAt: new Date() 
    },
    { 
      topicId: familyTopicId, 
      word: "father", 
      meaning: "bố", 
      definitionVi: "Người đàn ông sinh ra và nuôi dưỡng một người",
      phonetic: "/ˈfɑː.ðɚ/",
      example: "His father works in a bank.",
      exampleVi: "Bố anh ấy làm việc ở ngân hàng.",
      level: "A1", 
      topic: "Family", 
      createdAt: new Date() 
    },
    { 
      topicId: travelTopicId, 
      word: "passport", 
      meaning: "hộ chiếu", 
      definitionVi: "Tài liệu do chính phủ cấp xác nhận danh tính và quốc tịch",
      phonetic: "/ˈpæspɔːrt/",
      example: "Please show your passport at the check-in desk.",
      exampleVi: "Vui lòng xuất trình hộ chiếu của bạn tại bàn làm thủ tục.",
      level: "B1", 
      topic: "Travel", 
      createdAt: new Date() 
    }
  ] as VocabularyDocument[]);
  console.log("Vocabulary created");

  // 6. Seed Grammar Exercises
  // Exercise 1: Present Simple MCQ
  const ex1 = await grammarExercises.insertOne({
    topicId: presentSimpleTopicId,
    question: "He ___ breakfast at 7 AM every day.",
    type: "MCQ",
    explanation: "With 'He/She/It', we add 's' or 'es' to the verb in Present Simple.",
    createdAt: new Date()
  });
  await exerciseOptions.insertMany([
    { exerciseId: ex1.insertedId, content: "eat", isCorrect: false, createdAt: new Date() },
    { exerciseId: ex1.insertedId, content: "eats", isCorrect: true, createdAt: new Date() },
    { exerciseId: ex1.insertedId, content: "eating", isCorrect: false, createdAt: new Date() }
  ] as ExerciseOptionDocument[]);

  // Exercise 2: Present Simple FILL
  const ex2 = await grammarExercises.insertOne({
    topicId: presentSimpleTopicId,
    question: "Do they ___ (like) music?",
    type: "FILL",
    explanation: "In questions with 'Do', the main verb remains in base form.",
    createdAt: new Date()
  });
  await exerciseOptions.insertOne({
    exerciseId: ex2.insertedId,
    content: "like",
    isCorrect: true,
    createdAt: new Date()
  } as ExerciseOptionDocument);

  // Exercise 3: Past Simple MCQ
  const ex3 = await grammarExercises.insertOne({
    topicId: pastSimpleTopicId,
    question: "We ___ to the cinema last night.",
    type: "MCQ",
    explanation: "The past simple of 'go' is 'went'.",
    createdAt: new Date()
  });
  await exerciseOptions.insertMany([
    { exerciseId: ex3.insertedId, content: "go", isCorrect: false, createdAt: new Date() },
    { exerciseId: ex3.insertedId, content: "went", isCorrect: true, createdAt: new Date() },
    { exerciseId: ex3.insertedId, content: "gone", isCorrect: false, createdAt: new Date() }
  ] as ExerciseOptionDocument[]);

  console.log("Grammar exercises created");

  console.log("Seed finished successfully!");
  process.exit(0);
};

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
