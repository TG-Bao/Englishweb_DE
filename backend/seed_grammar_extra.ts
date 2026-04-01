import { ObjectId } from "mongodb";
import { DatabaseConnection } from "./apps/Database/Database";
import { Grammar, GRAMMAR_COLLECTION } from "./apps/Entity/Grammar";
import { GrammarExercise, GRAMMAR_EXERCISE_COLLECTION } from "./apps/Entity/GrammarExercise";
import { ExerciseOption, EXERCISE_OPTION_COLLECTION } from "./apps/Entity/ExerciseOption";

const seedGrammarExtra = async () => {
  const client = DatabaseConnection.getMongoClient();
  await client.connect();
  const db = client.db();

  console.log("Starting extra grammar seeding...");

  const extraGrammar: Grammar[] = [
    {
      level: "A1",
      title: "Từ để hỏi (Question Words: Wh-)",
      description: "Sử dụng Who, What, Where, When, Why, How để đặt câu hỏi.",
      examples: ["Who are you?", "Where do you live?", "What is your name?"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      level: "B1",
      title: "Câu tường thuật (Reported Speech) - Phần 1",
      description: "Cách kể lại lời nói của người khác. Lùi thì và thay đổi đại từ.",
      examples: ["He said that he was tired.", "She told me she liked music."],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      level: "B2",
      title: "Câu điều kiện loại 3 (Third Conditional)",
      description: "Giả thiết trái ngược với thực tế trong quá khứ. If + past perfect, would have + V3.",
      examples: ["If I had studied, I would have passed."],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      level: "C1",
      title: "Thức giả định (The Subjunctive Mood)",
      description: "Sử dụng với các động từ gợi ý, yêu cầu (suggest, insist, recommend...).",
      examples: ["I suggest that he study harder.", "It is essential that she be here."],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      level: "C2",
      title: "Đảo ngữ & Lược bỏ (Advanced Inversion & Ellipsis)",
      description: "Cấu trúc nhấn mạnh và lược bỏ từ ngữ trong văn phong trang trọng.",
      examples: ["Seldom have I seen such a disaster.", "Should you need help, let me know."],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const insertedGrammar = await db.collection<Grammar>(GRAMMAR_COLLECTION).insertMany(extraGrammar);
  console.log(`Inserted ${extraGrammar.length} new Grammar points.`);

  const exercises: { grammarId: ObjectId; question: string; type: "MCQ" | "FILL"; explanation: string; options: { content: string; isCorrect: boolean }[] }[] = [
    // A1: Question Words
    {
      grammarId: insertedGrammar.insertedIds[0],
      question: "___ is your favorite teacher?",
      type: "MCQ",
      explanation: "Dùng Who để hỏi về người.",
      options: [
        { content: "Who", isCorrect: true },
        { content: "What", isCorrect: false },
        { content: "Where", isCorrect: false }
      ]
    },
    {
      grammarId: insertedGrammar.insertedIds[0],
      question: "___ do you live?",
      type: "MCQ",
      explanation: "Dùng Where để hỏi về nơi chốn.",
      options: [
        { content: "Where", isCorrect: true },
        { content: "When", isCorrect: false },
        { content: "Why", isCorrect: false }
      ]
    },
    {
      grammarId: insertedGrammar.insertedIds[0],
      question: "___ is the time?",
      type: "FILL",
      explanation: "Dùng What để hỏi về thông tin vật/việc.",
      options: [{ content: "What", isCorrect: true }]
    },

    // B1: Reported Speech
    {
      grammarId: insertedGrammar.insertedIds[1],
      question: 'He said: "I am happy". -> He said that he ___ happy.',
      type: "MCQ",
      explanation: "Lùi thì từ hiện tại đơn thành quá khứ đơn.",
      options: [
        { content: "was", isCorrect: true },
        { content: "is", isCorrect: false },
        { content: "has been", isCorrect: false }
      ]
    },
    {
      grammarId: insertedGrammar.insertedIds[1],
      question: 'She said: "I will go". -> She said she ___ go.',
      type: "MCQ",
      explanation: "Lùi thì từ will thành would.",
      options: [
        { content: "would", isCorrect: true },
        { content: "will", isCorrect: false },
        { content: "shall", isCorrect: false }
      ]
    },

    // B2: Third Conditional
    {
      grammarId: insertedGrammar.insertedIds[2],
      question: "If I ___ (know) the truth, I would have told you.",
      type: "FILL",
      explanation: "Cấu trúc loại 3: If + had + V3.",
      options: [{ content: "had known", isCorrect: true }]
    },
    {
      grammarId: insertedGrammar.insertedIds[2],
      question: "If she had arrived earlier, she ___ the train.",
      type: "MCQ",
      explanation: "Cấu trúc loại 3: would have + V3.",
      options: [
        { content: "would have caught", isCorrect: true },
        { content: "would catch", isCorrect: false },
        { content: "had caught", isCorrect: false }
      ]
    },

    // C1: Subjunctive
    {
      grammarId: insertedGrammar.insertedIds[3],
      question: "I suggest that he ___ the room immediately.",
      type: "MCQ",
      explanation: "Thức giả định dùng động từ nguyên thể không chia.",
      options: [
        { content: "leave", isCorrect: true },
        { content: "leaves", isCorrect: false },
        { content: "left", isCorrect: false }
      ]
    },
    {
      grammarId: insertedGrammar.insertedIds[3],
      question: "It is vital that everyone ___ here on time.",
      type: "FILL",
      explanation: "Subjunctive with 'be'.",
      options: [{ content: "be", isCorrect: true }]
    },

    // C2: Advanced Inversion
    {
      grammarId: insertedGrammar.insertedIds[4],
      question: "Never ___ I seen such a beautiful sunrise.",
      type: "MCQ",
      explanation: "Đảo ngữ với Never đứng đầu câu.",
      options: [
        { content: "have", isCorrect: true },
        { content: "had", isCorrect: false },
        { content: "do", isCorrect: false }
      ]
    },
    {
      grammarId: insertedGrammar.insertedIds[4],
      question: "___ you need any further information, please contact us.",
      type: "FILL",
      explanation: "Đảo ngữ loại 1: Should S + V.",
      options: [{ content: "Should", isCorrect: true }]
    }
  ];

  for (const exData of exercises) {
    const { options, ...exercise } = exData;
    const insertedEx = await db.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION).insertOne({
      ...exercise,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const exOptions = options.map(opt => ({
      exerciseId: insertedEx.insertedId,
      content: opt.content,
      isCorrect: opt.isCorrect,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await db.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION).insertMany(exOptions);
  }

  console.log(`Successfully added ${exercises.length} exercises and their options.`);
  console.log("Grammar seeding complete!");
  process.exit(0);
};

seedGrammarExtra().catch(err => {
  console.error("Grammar seeding failed:", err);
  process.exit(1);
});
