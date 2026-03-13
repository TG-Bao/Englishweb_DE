import bcrypt from "bcryptjs";
import { connectDb } from "./config/db";
import { Database } from "./config/Database";
import { UserDocument, USER_COLLECTION } from "./models/User";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "./models/Vocabulary";
import { QuizDocument, QUIZ_COLLECTION } from "./models/Quiz";
import { TopicDocument, TOPIC_COLLECTION } from "./models/Topic";
import { GrammarDocument, GRAMMAR_COLLECTION } from "./models/Grammar";
import { QuestionDocument, QUESTION_COLLECTION } from "./models/Question";
import { LevelDocument, LEVEL_COLLECTION } from "./models/Level";

const seed = async () => {
  await connectDb();
  const db = Database.getInstance();

  const users = db.getCollection<UserDocument>(USER_COLLECTION);
  const topics = db.getCollection<TopicDocument>(TOPIC_COLLECTION);
  const vocabs = db.getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);
  const grammars = db.getCollection<GrammarDocument>(GRAMMAR_COLLECTION);
  const quizzes = db.getCollection<QuizDocument>(QUIZ_COLLECTION);
  const questions = db.getCollection<QuestionDocument>(QUESTION_COLLECTION);
  const levels = db.getCollection<LevelDocument>(LEVEL_COLLECTION);

  console.log("Clearing old data...");
  await topics.deleteMany({});
  await vocabs.deleteMany({});
  await grammars.deleteMany({});
  await quizzes.deleteMany({});
  await questions.deleteMany({});
  await levels.deleteMany({});
  
  // Admin user
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

  // Seeding Levels
  const levelData: LevelDocument[] = [
    { name: "A1", description: "Beginner", minPoints: 0, order: 1, isPublished: true, createdAt: new Date() },
    { name: "A2", description: "Elementary", minPoints: 100, order: 2, isPublished: true, createdAt: new Date() },
    { name: "B1", description: "Intermediate", minPoints: 300, order: 3, isPublished: true, createdAt: new Date() },
    { name: "B2", description: "Upper Intermediate", minPoints: 600, order: 4, isPublished: true, createdAt: new Date() },
    { name: "C1", description: "Advanced", minPoints: 1000, order: 5, isPublished: true, createdAt: new Date() },
    { name: "C2", description: "Proficiency", minPoints: 1500, order: 6, isPublished: true, createdAt: new Date() }
  ];
  await levels.insertMany(levelData);
  console.log("Seeded basic levels (A1 to C2)");

  // Seeding Topics
  const topicData: TopicDocument[] = [
    { title: "Family & Friends", description: "Vocabulary related to family members and relationships.", order: 1, level: "A1", isPublished: true } as TopicDocument,
    { title: "Food & Drinks", description: "Learn how to order food and talk about your favorite meals.", order: 2, level: "A1", isPublished: true } as TopicDocument,
    { title: "Travel & Holidays", description: "Essential vocabulary for traveling, booking hotels, and sightseeing.", order: 3, level: "A2", isPublished: true } as TopicDocument,
    { title: "Work & Career", description: "Professional vocabulary for the workplace and interviews.", order: 4, level: "B1", isPublished: true } as TopicDocument,
    { title: "Health & Fitness", description: "Talking about illnesses, going to the doctor, and staying fit.", order: 5, level: "B1", isPublished: true } as TopicDocument,
    { title: "Technology & Web", description: "Modern vocabulary related to the internet, gadgets, and software.", order: 6, level: "B2", isPublished: true } as TopicDocument,
  ];
  await topics.insertMany(topicData);
  
  const allTopics = await topics.find().toArray();
  const getTopic = (title: string) => allTopics.find(t => t.title === title)!;

  // Seeding Vocabulary
  const vocabData: VocabularyDocument[] = [
    // Family & Friends
    { topicId: getTopic("Family & Friends")._id!, word: "sibling", meaning: "a brother or sister", phonetic: "/ˈsɪb.lɪŋ/", example: "She has two siblings.", topic: "Family & Friends", level: "A1" } as VocabularyDocument,
    { topicId: getTopic("Family & Friends")._id!, word: "cousin", meaning: "the child of your aunt or uncle", phonetic: "/ˈkʌz.ən/", example: "My cousin lives in Canada.", topic: "Family & Friends", level: "A1" } as VocabularyDocument,
    { topicId: getTopic("Family & Friends")._id!, word: "nephew", meaning: "a son of your brother or sister", phonetic: "/ˈnef.juː/", example: "I bought a toy for my nephew.", topic: "Family & Friends", level: "A1" } as VocabularyDocument,
    { topicId: getTopic("Family & Friends")._id!, word: "niece", meaning: "a daughter of your brother or sister", phonetic: "/niːs/", example: "My niece is 5 years old.", topic: "Family & Friends", level: "A1" } as VocabularyDocument,
    
    // Food & Drinks
    { topicId: getTopic("Food & Drinks")._id!, word: "delicious", meaning: "having a very pleasant taste or smell", phonetic: "/dɪˈlɪʃ.əs/", example: "This cake is delicious!", topic: "Food & Drinks", level: "A1" } as VocabularyDocument,
    { topicId: getTopic("Food & Drinks")._id!, word: "beverage", meaning: "a drink of any type", phonetic: "/ˈbev.ər.ɪdʒ/", example: "What is your favorite beverage?", topic: "Food & Drinks", level: "A2" } as VocabularyDocument,
    { topicId: getTopic("Food & Drinks")._id!, word: "recipe", meaning: "a set of instructions telling you how to prepare and cook food", phonetic: "/ˈres.ɪ.pi/", example: "I need a good recipe for soup.", topic: "Food & Drinks", level: "A2" } as VocabularyDocument,
    
    // Travel & Holidays
    { topicId: getTopic("Travel & Holidays")._id!, word: "itinerary", meaning: "a detailed plan or route of a journey", phonetic: "/aɪˈtɪn.ər.ər.i/", example: "We will send you your itinerary soon.", topic: "Travel & Holidays", level: "B1" } as VocabularyDocument,
    { topicId: getTopic("Travel & Holidays")._id!, word: "accommodation", meaning: "a place to live, work, or stay in", phonetic: "/əˌkɒm.əˈdeɪ.ʃən/", example: "The hotel offers excellent accommodation.", topic: "Travel & Holidays", level: "B1" } as VocabularyDocument,
    { topicId: getTopic("Travel & Holidays")._id!, word: "souvenir", meaning: "something you buy or keep to help you remember a holiday", phonetic: "/ˌsuː.vənˈɪər/", example: "I bought this souvenir in Paris.", topic: "Travel & Holidays", level: "A2" } as VocabularyDocument,

    // Work & Career
    { topicId: getTopic("Work & Career")._id!, word: "colleague", meaning: "one of a group of people who work together", phonetic: "/ˈkɒl.iːɡ/", example: "I am having lunch with my colleagues.", topic: "Work & Career", level: "A2" } as VocabularyDocument,
    { topicId: getTopic("Work & Career")._id!, word: "resume", meaning: "a brief account of a person's education, qualifications, and previous experience", phonetic: "/ˈrez.juː.meɪ/", example: "Please send us your updated resume.", topic: "Work & Career", level: "B1" } as VocabularyDocument,
    { topicId: getTopic("Work & Career")._id!, word: "promotion", meaning: "the advancement of an employee within a company", phonetic: "/prəˈməʊ.ʃən/", example: "She worked hard to get a promotion.", topic: "Work & Career", level: "B1" } as VocabularyDocument,
  ];
  await vocabs.insertMany(vocabData);

  // Seeding Grammars
  const grammarData: GrammarDocument[] = [
    {
      level: "A1",
      title: "Present Simple (Hiện tại đơn)",
      description: "Thì hiện tại đơn diễn tả một thói quen, một hành động lặp đi lặp lại hoặc một sự thật hiển nhiên.\nThường đi kèm các trạng từ chỉ tần suất như: always, usually, often, sometimes, never.",
      structure: "(+) S + V(s/es) + O\n(-) S + do/does + not + V_inf\n(?) Do/Does + S + V_inf?",
      examples: ["I wake up early every day.", "The sun rises in the east.", "She goes to school by bus."],
      mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    } as GrammarDocument,
    {
      level: "A1",
      title: "Present Continuous (Hiện tại tiếp diễn)",
      description: "Diễn tả một hành động đang xảy ra ngay tại thời điểm nói hoặc một kế hoạch chắc chắn trong tương lai gần.",
      structure: "(+) S + am/is/are + V_ing\n(-) S + am/is/are + not + V_ing\n(?) Am/Is/Are + S + V_ing?",
      examples: ["I am studying English right now.", "They are playing football in the yard."],
      mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    } as GrammarDocument,
    {
      level: "A2",
      title: "Past Simple (Quá khứ đơn)",
      description: "Diễn tả hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ. Cần chú ý động từ bất quy tắc (Irregular verbs).",
      structure: "(+) S + V2/ed + O\n(-) S + did not + V_inf\n(?) Did + S + V_inf?",
      examples: ["I visited my grandparents yesterday.", "She went to the cinema last night."],
    } as GrammarDocument,
    {
      level: "B1",
      title: "Present Perfect (Hiện tại hoàn thành)",
      description: "Diễn tả hành động bắt đầu trong quá khứ, kéo dài đến hiện tại và có chể tiếp tục ở tương lai. Nhấn mạnh kết quả.",
      structure: "(+) S + have/has + V3/ed + O\n(-) S + have/has + not + V3/ed\n(?) Have/Has + S + V3/ed?",
      examples: ["I have lived here for 5 years.", "She has already finished her homework."],
    } as GrammarDocument,
    {
      level: "B1",
      title: "First Conditional (Câu điều kiện loại 1)",
      description: "Loại câu điều kiện sử dụng để diễn tả những sự việc có khả năng xảy ra ở hiện tại hoặc tương lai nếu điều kiện được đáp ứng.",
      structure: "If + S + V (hiện tại đơn), S + will + V_inf",
      examples: ["If it rains tomorrow, we will stay at home.", "If you study hard, you will pass the exam."],
    } as GrammarDocument,
    {
      level: "B2",
      title: "Passive Voice (Câu bị động)",
      description: "Sử dụng khi muốn nhấn mạnh đối tượng gánh chịu hành động thay vì người thực hiện hành động.",
      structure: "S + be + V3/ed + (by + O)",
      examples: ["The house was built in 1990.", "English is spoken all over the world."],
    } as GrammarDocument,
  ];
  await grammars.insertMany(grammarData);
  const allGrammars = await grammars.find().toArray();

  // Seeding Quizzes
  const quizData: QuizDocument[] = [
    { scopeType: "TOPIC", scopeId: getTopic("Family & Friends")._id!, title: "Review: Family & Friends", passScore: 70, isPublished: true } as QuizDocument,
    { scopeType: "TOPIC", scopeId: getTopic("Food & Drinks")._id!, title: "Review: Food & Drinks", passScore: 70, isPublished: true } as QuizDocument,
    { scopeType: "TOPIC", scopeId: getTopic("Work & Career")._id!, title: "Review: Work & Career", passScore: 80, isPublished: true } as QuizDocument,
    
    // Grammar quizzes
    { scopeType: "GRAMMAR", scopeId: allGrammars.find(g => g.title.includes("Present Simple"))!._id!, title: "Quiz: Present Simple", passScore: 100, isPublished: true } as QuizDocument,
    { scopeType: "GRAMMAR", scopeId: allGrammars.find(g => g.title.includes("Past Simple"))!._id!, title: "Quiz: Past Simple", passScore: 100, isPublished: true } as QuizDocument,
    { scopeType: "GRAMMAR", scopeId: allGrammars.find(g => g.title.includes("First Conditional"))!._id!, title: "Quiz: First Conditional", passScore: 100, isPublished: true } as QuizDocument,
  ];
  await quizzes.insertMany(quizData);
  const allQuizzes = await quizzes.find().toArray();

  // Seeding Questions
  const questionData: QuestionDocument[] = [];

  // Quiz: Family & Friends
  const familyQuizId = allQuizzes.find(q => q.title === "Review: Family & Friends")!._id!;
  questionData.push(
    { quizId: familyQuizId, sourceType: "VOCAB", question: "What does 'sibling' mean?", options: ["a brother or sister", "a parent", "a neighbor", "a pet"], correctAnswer: "a brother or sister", type: "MCQ" } as QuestionDocument,
    { quizId: familyQuizId, sourceType: "VOCAB", question: "Choose the correct meaning of 'cousin'.", options: ["a friend", "the child of your aunt or uncle", "a teacher", "a sibling"], correctAnswer: "the child of your aunt or uncle", type: "MCQ" } as QuestionDocument,
    { quizId: familyQuizId, sourceType: "VOCAB", question: "What is a 'nephew'?", options: ["a brother", "a son of your brother or sister", "a father", "a grandfather"], correctAnswer: "a son of your brother or sister", type: "MCQ" } as QuestionDocument,
  );

  // Quiz: Food & Drinks
  const foodQuizId = allQuizzes.find(q => q.title === "Review: Food & Drinks")!._id!;
  questionData.push(
    { quizId: foodQuizId, sourceType: "VOCAB", question: "Which word means 'having a very pleasant taste or smell'?", options: ["disgusting", "delicious", "terrible", "spicy"], correctAnswer: "delicious", type: "MCQ" } as QuestionDocument,
    { quizId: foodQuizId, sourceType: "VOCAB", question: "What is a basic word for 'drink'?", options: ["food", "beverage", "snack", "plate"], correctAnswer: "beverage", type: "MCQ" } as QuestionDocument,
  );

  // Quiz: Present Simple
  const psQuizId = allQuizzes.find(q => q.title === "Quiz: Present Simple")!._id!;
  questionData.push(
    { quizId: psQuizId, sourceType: "GRAMMAR", question: "Choose the correct sentence:", options: ["He go to school every day.", "He goes to school every day.", "He going to school every day.", "He is go to school every day."], correctAnswer: "He goes to school every day.", type: "MCQ" } as QuestionDocument,
    { quizId: psQuizId, sourceType: "GRAMMAR", question: "Fill in the blank: The sun ___ in the east.", options: ["rise", "rises", "rising", "is rising"], correctAnswer: "rises", type: "MCQ" } as QuestionDocument,
    { quizId: psQuizId, sourceType: "GRAMMAR", question: "Which adverb is often used with Present Simple?", options: ["Usually", "Yesterday", "Tomorrow", "Next week"], correctAnswer: "Usually", type: "MCQ" } as QuestionDocument,
  );

  // Quiz: Past Simple
  const pastQuizId = allQuizzes.find(q => q.title === "Quiz: Past Simple")!._id!;
  questionData.push(
    { quizId: pastQuizId, sourceType: "GRAMMAR", question: "Fill in the blank: I ___ my grandparents yesterday.", options: ["visit", "visiting", "visited", "visits"], correctAnswer: "visited", type: "MCQ" } as QuestionDocument,
    { quizId: pastQuizId, sourceType: "GRAMMAR", question: "Choose the correct negative form:", options: ["She no went to the cinema.", "She didn't went to the cinema.", "She didn't go to the cinema.", "She wasn't go to the cinema."], correctAnswer: "She didn't go to the cinema.", type: "MCQ" } as QuestionDocument,
  );

  // Quiz: First Conditional
  const condQuizId = allQuizzes.find(q => q.title === "Quiz: First Conditional")!._id!;
  questionData.push(
    { quizId: condQuizId, sourceType: "GRAMMAR", question: "Complete the sentence: If it rains tomorrow, we ___ at home.", options: ["stay", "will stay", "stayed", "would stay"], correctAnswer: "will stay", type: "MCQ" } as QuestionDocument,
    { quizId: condQuizId, sourceType: "GRAMMAR", question: "Find the error: If you will study hard, you will pass the exam.", options: ["will study -> study", "will pass -> pass", "study -> studying", "No error"], correctAnswer: "will study -> study", type: "MCQ" } as QuestionDocument,
  );

  await questions.insertMany(questionData);
  
  console.log("Seeded highly abundant learning data (Topics, Vocab, Grammar, Quizzes, Questions)!");
  console.log("Seed complete");
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
