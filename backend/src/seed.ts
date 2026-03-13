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
  const grammarResults = await grammars.insertMany([
    {
      level: "A1",
      title: "Possessive Pronouns",
      description: "Sử dụng my, your, his, her, our, their để chỉ sự sở hữu.",
      examples: ["This is my brother.", "Their house is big."],
      createdAt: new Date()
    } as GrammarDocument,
    {
      level: "A2",
      title: "First Conditional",
      description: "Câu điều kiện loại 1 dùng để diễn tả một sự việc có thể xảy ra ở hiện tại hoặc tương lai nếu điều kiện được đáp ứng: If + S + V(s/es), S + will + V.",
      examples: ["If it rains, we will stay at home.", "She will pass the exam if she studies hard."],
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
  const firstConditionalGrammarId = grammarResults.insertedIds[1];
  const presentSimpleGrammarId = grammarResults.insertedIds[2];
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
    grammarId: presentSimpleGrammarId,
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
    grammarId: presentSimpleGrammarId,
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
    grammarId: presentSimpleGrammarId,
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

  // Exercise 4: First Conditional MCQ (Dễ)
  const ex4 = await grammarExercises.insertOne({
    grammarId: firstConditionalGrammarId,
    question: "If it ___, I will stay at home.",
    type: "MCQ",
    explanation: "Mệnh đề 'If' trong câu điều kiện loại 1 dùng thì hiện tại đơn (rains).",
    createdAt: new Date()
  });
  await exerciseOptions.insertMany([
    { exerciseId: ex4.insertedId, content: "rain", isCorrect: false, createdAt: new Date() },
    { exerciseId: ex4.insertedId, content: "rains", isCorrect: true, createdAt: new Date() },
    { exerciseId: ex4.insertedId, content: "will rain", isCorrect: false, createdAt: new Date() }
  ] as ExerciseOptionDocument[]);

  // Exercise 5: First Conditional MCQ (Đảo mệnh đề)
  const ex5 = await grammarExercises.insertOne({
    grammarId: firstConditionalGrammarId,
    question: "She will go to the party if she ___ early.",
    type: "MCQ",
    explanation: "Tương tự, mệnh đề 'if' vẫn phải dùng hiện tại đơn (finishes) dù nó đứng ở vế sau.",
    createdAt: new Date()
  });
  await exerciseOptions.insertMany([
    { exerciseId: ex5.insertedId, content: "finishes", isCorrect: true, createdAt: new Date() },
    { exerciseId: ex5.insertedId, content: "finish", isCorrect: false, createdAt: new Date() },
    { exerciseId: ex5.insertedId, content: "will finish", isCorrect: false, createdAt: new Date() }
  ] as ExerciseOptionDocument[]);

  // Exercise 6: First Conditional FILL (Điền động từ khuyết thiếu)
  const ex6 = await grammarExercises.insertOne({
    grammarId: firstConditionalGrammarId,
    question: "If you eat too much, you ___ get fat.",
    type: "FILL",
    explanation: "Mệnh đề chính dùng 'will' để chỉ kết quả tương lai.",
    createdAt: new Date()
  });
  await exerciseOptions.insertOne({
    exerciseId: ex6.insertedId,
    content: "will",
    isCorrect: true,
    createdAt: new Date()
  } as ExerciseOptionDocument);

  // Exercise 7: First Conditional FILL (Phủ định)
  const ex7 = await grammarExercises.insertOne({
    grammarId: firstConditionalGrammarId,
    question: "If he ___ (not/call) me, I will be sad.",
    type: "FILL",
    explanation: "Phủ định hiện tại đơn của 'he' là 'doesn't call' hoặc 'does not call'.",
    createdAt: new Date()
  });
  await exerciseOptions.insertOne({
    exerciseId: ex7.insertedId,
    content: "doesn't call",
    isCorrect: true,
    createdAt: new Date()
  } as ExerciseOptionDocument);

  // Exercise 8: First Conditional MCQ (Dấu hiệu Unless)
  const ex8 = await grammarExercises.insertOne({
    grammarId: firstConditionalGrammarId,
    question: "___ you hurry up, we will miss the train.",
    type: "MCQ",
    explanation: "'Unless' = 'If not', mang nghĩa 'Trừ khi bạn nhanh lên...'",
    createdAt: new Date()
  });
  await exerciseOptions.insertMany([
    { exerciseId: ex8.insertedId, content: "If", isCorrect: false, createdAt: new Date() },
    { exerciseId: ex8.insertedId, content: "Unless", isCorrect: true, createdAt: new Date() },
    { exerciseId: ex8.insertedId, content: "When", isCorrect: false, createdAt: new Date() }
  ] as ExerciseOptionDocument[]);

  console.log("Mock First Conditional Grammar Exercises created");

  console.log("Seed finished successfully!");
  process.exit(0);
};

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
