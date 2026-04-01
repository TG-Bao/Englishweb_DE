import bcrypt from "bcryptjs";
import * as googleTTS from "google-tts-api";
import { ObjectId } from "mongodb";
import { DatabaseConnection } from "./apps/Database/Database";
import { User, USER_COLLECTION } from "./apps/Entity/User";
import { Vocabulary, VOCABULARY_COLLECTION } from "./apps/Entity/Vocabulary";
import { Quiz, QUIZ_COLLECTION } from "./apps/Entity/Quiz";
import { Topic, TOPIC_COLLECTION } from "./apps/Entity/Topic";
import { Question, QUESTION_COLLECTION } from "./apps/Entity/Question";
import { Level, LEVEL_COLLECTION } from "./apps/Entity/Level";
import { Grammar, GRAMMAR_COLLECTION } from "./apps/Entity/Grammar";
import { GrammarExercise, GRAMMAR_EXERCISE_COLLECTION } from "./apps/Entity/GrammarExercise";
import { ExerciseOption, EXERCISE_OPTION_COLLECTION } from "./apps/Entity/ExerciseOption";
import { Progress, PROGRESS_COLLECTION } from "./apps/Entity/Progress";
import { Lesson, LESSON_COLLECTION } from "./apps/Entity/Lesson";
import { Sentence, SENTENCE_COLLECTION } from "./apps/Entity/Sentence";
import { Test, TEST_COLLECTION } from "./apps/Entity/Test";

const seed = async () => {
  const client = DatabaseConnection.getMongoClient();
  await client.connect();
  const db = client.db();

  const collections = [
    { name: USER_COLLECTION, coll: db.collection<User>(USER_COLLECTION) },
    { name: TOPIC_COLLECTION, coll: db.collection<Topic>(TOPIC_COLLECTION) },
    { name: VOCABULARY_COLLECTION, coll: db.collection<Vocabulary>(VOCABULARY_COLLECTION) },
    { name: QUIZ_COLLECTION, coll: db.collection<Quiz>(QUIZ_COLLECTION) },
    { name: QUESTION_COLLECTION, coll: db.collection<Question>(QUESTION_COLLECTION) },
    { name: LEVEL_COLLECTION, coll: db.collection<Level>(LEVEL_COLLECTION) },
    { name: LESSON_COLLECTION, coll: db.collection<Lesson>(LESSON_COLLECTION) },
    { name: GRAMMAR_EXERCISE_COLLECTION, coll: db.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION) },
    { name: EXERCISE_OPTION_COLLECTION, coll: db.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION) },
    { name: GRAMMAR_COLLECTION, coll: db.collection<Grammar>(GRAMMAR_COLLECTION) },
    { name: PROGRESS_COLLECTION, coll: db.collection<Progress>(PROGRESS_COLLECTION) },
    { name: SENTENCE_COLLECTION, coll: db.collection<Sentence>(SENTENCE_COLLECTION) },
    { name: TEST_COLLECTION, coll: db.collection<Test>(TEST_COLLECTION) },
  ];

  console.log("Cleaning old data...");
  await Promise.all(collections.map(c => c.coll.deleteMany({})));

  // 1. Seed Levels (A1-C2)
  const levelData: Level[] = [
    { name: "A1", description: "Beginner - Cơ bản", minPoints: 0, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "A2", description: "Elementary - Sơ cấp", minPoints: 1000, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "B1", description: "Intermediate - Trung cấp", minPoints: 3000, order: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "B2", description: "Upper Intermediate - Trung cao cấp", minPoints: 5000, order: 4, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "C1", description: "Advanced - Cao cấp", minPoints: 7000, order: 5, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "C2", description: "Proficient - Thành thạo", minPoints: 10000, order: 6, isPublished: true, createdAt: new Date(), updatedAt: new Date() }
  ];

  await db.collection<Level>(LEVEL_COLLECTION).insertMany(levelData);
  console.log(`Created ${levelData.length} Levels`);

  const levels = await db.collection<Level>(LEVEL_COLLECTION).find().toArray();

  // 2. Seed Users
  const password = await bcrypt.hash("Admin123", 10);
  const userPassword = await bcrypt.hash("User123", 10);
  
  const adminId = new ObjectId("65f2a1b1c2d3e4f5a6b7c8d9");
  const userId = new ObjectId("65f2a1b1c2d3e4f5a6b7c8da");

  await db.collection<User>(USER_COLLECTION).insertMany([
    {
      _id: adminId,
      name: "Trần Quản Trị",
      email: "admin@example.com",
      password: password,
      role: "ADMIN",
      isActive: true,
      points: 10000,
      totalTopicsLearned: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: userId,
      name: "Nguyễn Học Viên",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
      level: "A1",
      targetLevel: "B2",
      gender: "MALE",
      isActive: true,
      points: 120,
      totalTopicsLearned: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as User[]);
  console.log("Created Admin and Test User");

  // 3. Seed Grammar
  const grammarData: Grammar[] = [
    // A1
    { level: "A1", title: "Thì Hiện tại Đơn (Present Simple) - Động từ To be", description: "Sử dụng 'am/is/are' để nói về trạng thái, nghề nghiệp, tuổi tác hoặc sự thật hiển nhiên.", examples: ["I am a student.", "She is happy.", "They are from Vietnam."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A1", title: "Thì Hiện tại Đơn (Present Simple) - Động từ thường", description: "Nói về thói quen hoặc sự thật hiển nhiên. Thêm 's/es' với ngôi thứ ba số ít.", examples: ["I work everyday.", "He runs fast."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A1", title: "Đại từ nhân xưng & Tính từ sở hữu", description: "I/my, you/your, he/his...", examples: ["I love my family.", "He has his pen."], createdAt: new Date(), updatedAt: new Date() },
    // A2
    { level: "A2", title: "Thì Hiện tại Tiếp diễn (Present Continuous)", description: "Diễn tả hành động đang diễn ra. S + am/is/are + V-ing.", examples: ["I am reading.", "They are dancing."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A2", title: "Thì Quá khứ Đơn (Past Simple)", description: "Hành động đã kết thúc trong quá khứ.", examples: ["I saw him yesterday.", "We played cards."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A2", title: "So sánh hơn (Comparative Adjectives)", description: "So sánh 2 đối tượng. Thêm -er hoặc use 'more'.", examples: ["He is taller than me.", "This is more expensive."], createdAt: new Date(), updatedAt: new Date() },
    // B1
    { level: "B1", title: "Thì Hiện tại Hoàn thành (Present Perfect)", description: "S + have/has + V3/ed.", examples: ["I have lived here for ages.", "Has she left yet?"], createdAt: new Date(), updatedAt: new Date() },
    { level: "B1", title: "Câu điều kiện loại 1 (First Conditional)", description: "If + HTĐ, Tương lai đơn.", examples: ["If it rains, I will stay home."], createdAt: new Date(), updatedAt: new Date() },
    { level: "B1", title: "Động từ khuyết thiếu (Modal Verbs: Can, Could, May, Must...)", description: "Diễn tả khả năng, sự cho phép, nghĩa vụ.", examples: ["You must stop here.", "Can you help me?"], createdAt: new Date(), updatedAt: new Date() },
    // B2
    { level: "B2", title: "Mệnh đề quan hệ (Relative Clauses)", description: "Who, which, that...", examples: ["The girl who is singing is my sister."], createdAt: new Date(), updatedAt: new Date() },
    { level: "B2", title: "Câu bị động (Passive Voice)", description: "Be + V3/ed.", examples: ["The cake was eaten by him."], createdAt: new Date(), updatedAt: new Date() },
    { level: "B2", title: "Câu điều kiện loại 2 (Second Conditional)", description: "If + QKĐ, would + V.", examples: ["If I were you, I would buy that."], createdAt: new Date(), updatedAt: new Date() },
    // C1
    { level: "C1", title: "Đảo ngữ (Inversion)", description: "Nhấn mạnh bằng cách đảo trợ động từ.", examples: ["Never have I seen such a beauty."], createdAt: new Date(), updatedAt: new Date() },
    { level: "C1", title: "Câu điều kiện hỗn hợp (Mixed Conditionals)", description: "Giả thiết trái quá khứ, kết quả trái hiện tại.", examples: ["If I had worked harder, I would be rich now."], createdAt: new Date(), updatedAt: new Date() }
  ];
  const grammarResults = await db.collection<Grammar>(GRAMMAR_COLLECTION).insertMany(grammarData);
  const a1G1 = grammarResults.insertedIds[0];
  const a1G2 = grammarResults.insertedIds[1];
  const b1G1 = grammarResults.insertedIds[6];
  console.log(`Created ${grammarData.length} Grammar Points`);

  // 4. Seed Topics
  const topicData: Topic[] = [
    // A1
    { title: "Gia đình (Family)", description: "Từ vựng về thành viên gia đình.", theory: "Học cách giới thiệu người thân.", examples: ["My mother is kind.", "I have 2 brothers."], order: 1, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Động vật (Animals)", description: "Thú cưng và động vật hoang dã.", theory: "Miêu tả con vật yêu thích.", examples: ["Cats are cute.", "Lions are dangerous."], order: 2, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Nhà cửa (Home)", description: "Các phòng và nội thất.", theory: "Miêu tả nơi ở.", examples: ["My house is big.", "I love my bedroom."], order: 3, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    // A2
    { title: "Du lịch (Travel)", description: "Phương tiện và địa danh.", theory: "Cách hỏi đường và đặt tour.", examples: ["I travel by train.", "Where is the hotel?"], order: 1, level: "A2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Mùa & Thời tiết (Seasons & Weather)", description: "4 mùa và các hiện tượng.", theory: "Hỏi về thời tiết.", examples: ["It is sunny today.", "Winter is cold."], order: 2, level: "A2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    // B1
    { title: "Công việc (Jobs)", description: "Nghề nghiệp và văn phòng.", theory: "Nói về sự nghiệp.", examples: ["I am a designer.", "She works in a bank."], order: 1, level: "B1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Sức khỏe (Health)", description: "Bộ phận cơ thể và bệnh tật.", theory: "Đi khám bác sĩ.", examples: ["I have a headache.", "Take this medicine."], order: 2, level: "B1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    // B2
    { title: "Môi trường (Environment)", description: "Ô nhiễm và bảo vệ hành tinh.", theory: "Thảo luận biến đổi khí hậu.", examples: ["Recycle more plastic.", "Reduce CO2 emissions."], order: 1, level: "B2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Xã hội (Society)", description: "Vấn đề xã hội đương đại.", theory: "Bày tỏ quan điểm.", examples: ["Equality is important.", "Education changes lives."], order: 2, level: "B2", isPublished: true, createdAt: new Date(), updatedAt: new Date() }
  ];
  const topicResults = await db.collection<Topic>(TOPIC_COLLECTION).insertMany(topicData);
  const tFamily = topicResults.insertedIds[0];
  const tAnimals = topicResults.insertedIds[1];
  const tHome = topicResults.insertedIds[2];
  console.log(`Created ${topicData.length} Topics`);

  // 5. Seed Vocabulary
  const vocabData: Vocabulary[] = [
    // Family
    { topicId: tFamily, word: "Mother", meaning: "Mẹ", definitionVi: "Người phụ nữ sinh ra bạn.", phonetic: "/ˈmʌðər/", example: "My mother is kind.", exampleVi: "Mẹ tôi thật tử tế.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Father", meaning: "Cha", definitionVi: "Người đàn ông sinh ra bạn.", phonetic: "/ˈfɑːðər/", example: "My father is tall.", exampleVi: "Cha tôi cao.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Sister", meaning: "Chị/em gái", definitionVi: "Con gái cùng cha mẹ.", phonetic: "/ˈsɪstər/", example: "I have one sister.", exampleVi: "Tôi có một chị gái.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Brother", meaning: "Anh/em trai", definitionVi: "Con trai cùng cha mẹ.", phonetic: "/ˈbrʌðər/", example: "He is my brother.", exampleVi: "Cậu ấy là em trai tôi.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Son", meaning: "Con trai", definitionVi: "Đứa con là nam.", phonetic: "/sʌn/", example: "He is a good son.", exampleVi: "Cậu ấy là một đứa con ngoan.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Daughter", meaning: "Con gái", definitionVi: "Đứa con là nữ.", phonetic: "/ˈdɔːtər/", example: "She is my daughter.", exampleVi: "Nó là con gái tôi.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Grandma", meaning: "Bà", definitionVi: "Mẹ của cha/mẹ.", phonetic: "/ˈɡrænmɑː/", example: "Grandma loves me.", exampleVi: "Bà rất yêu tôi.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Grandpa", meaning: "Ông", definitionVi: "Cha của cha/mẹ.", phonetic: "/ˈɡrænpɑː/", example: "Grandpa is old.", exampleVi: "Ông đã già rồi.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Uncle", meaning: "Chú/Bác trai", definitionVi: "Anh/em trai của cha/mẹ.", phonetic: "/ˈʌŋkl/", example: "My uncle is a pilot.", exampleVi: "Chú tôi là phi công.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamily, word: "Aunt", meaning: "Cô/Dì", definitionVi: "Chị/em gái của cha/mẹ.", phonetic: "/ɑːnt/", example: "My aunt lives in UK.", exampleVi: "Dì tôi sống ở Anh.", topic: "Family", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },

    // Animals
    { topicId: tAnimals, word: "Dog", meaning: "Chó", definitionVi: "Thú cưng trung thành.", phonetic: "/dɒɡ/", example: "I have a small dog.", exampleVi: "Tôi có một con chó nhỏ.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Cat", meaning: "Mèo", definitionVi: "Thú cưng bắt chuột.", phonetic: "/kæt/", example: "The cat is sleeping.", exampleVi: "Con mèo đang ngủ.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Bird", meaning: "Chim", definitionVi: "Động vật có cánh.", phonetic: "/bɜːrd/", example: "Birds can fly.", exampleVi: "Chim biết bay.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Fish", meaning: "Cá", definitionVi: "Sống dưới nước.", phonetic: "/fɪʃ/", example: "Deep sea fish.", exampleVi: "Cá biển sâu.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Lion", meaning: "Sư tử", definitionVi: "Chúa sơn lâm.", phonetic: "/ˈlaɪən/", example: "Lions hunt together.", exampleVi: "Sư tử săn mồi cùng nhau.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Tiger", meaning: "Hổ", definitionVi: "Động vật có vằn.", phonetic: "/ˈtaɪɡər/", example: "Tigers are strong.", exampleVi: "Hổ rất khỏe.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Elephant", meaning: "Voi", definitionVi: "Động vật to lớn.", phonetic: "/ˈelɪfənt/", example: "Voi có vòi dài.", exampleVi: "Voi có vòi dài.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Monkey", meaning: "Khỉ", definitionVi: "Leo trèo giỏi.", phonetic: "/ˈmʌŋki/", example: "Monkeys like bananas.", exampleVi: "Khỉ thích chuối.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Horse", meaning: "Ngựa", definitionVi: "Chạy nhanh.", phonetic: "/hɔːrs/", example: "I like riding horses.", exampleVi: "Tôi thích cưỡi ngựa.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimals, word: "Rabbit", meaning: "Thỏ", definitionVi: "Tai dài, nhảy.", phonetic: "/ˈræbɪt/", example: "The rabbit is eating.", exampleVi: "Con thỏ đang ăn.", topic: "Animals", level: "A1", learned: 0, createdAt: new Date(), updatedAt: new Date() }
  ];
  await db.collection<Vocabulary>(VOCABULARY_COLLECTION).insertMany(vocabData);
  console.log(`Created ${vocabData.length} Vocabulary Items`);

  // 6. Seed Speaking Lessons & Sentences
  const spLessons: Lesson[] = [
    { title: "Chào hỏi cơ bản", description: "Học cách chào hỏi tự nhiên.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", level_id: levels[0]._id!, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Giới thiệu bản thân", description: "Tên, tuổi, quê quán.", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24", level_id: levels[0]._id!, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Đặt món ăn", description: "Tại nhà hàng hoặc quán cafe.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", level_id: levels[1]._id!, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Câu hỏi phỏng vấn", description: "Chuẩn bị cho sự nghiệp.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e", level_id: levels[2]._id!, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ];
  const spResults = await db.collection<Lesson>(LESSON_COLLECTION).insertMany(spLessons);
  console.log(`Created ${spLessons.length} Speaking Lessons`);

  const generateGroupSentences = async (lessonId: ObjectId, texts: string[]) => {
    const data: Sentence[] = [];
    for (let i = 0; i < texts.length; i++) {
        const base64Audio = await googleTTS.getAudioBase64(texts[i], { lang: "en", slow: false, host: "https://translate.google.com" });
        data.push(new Sentence({
            lesson_id: lessonId,
            text: texts[i],
            order: i + 1,
            audio_url: `data:audio/mp3;base64,${base64Audio}`,
            type: i % 2 === 0 ? "speaking" : "listening"
        }));
    }
    await db.collection<Sentence>(SENTENCE_COLLECTION).insertMany(data as any[]);
  };

  console.log("Generating Audio (this may take a minute)...");
  await generateGroupSentences(spResults.insertedIds[0], [
    "Hello", "Hi there", "Good morning", "How are you?", "I am fine", 
    "How is it going?", "What is up?", "Nice to meet you", "Have a nice day", "Goodbye",
    "See you later", "Take care", "Good evening", "Long time no see", "Welcome",
    "It is a pleasure", "Glad to see you", "How have you been?", "Not bad", "Fine, thanks"
  ]);

  await generateGroupSentences(spResults.insertedIds[1], [
    "My name is John", "I am 20 years old", "I live in Hanoi", "I love sports", "He is my friend",
    "She likes music", "They are from Japan", "This is my house", "I study English", "We are students",
    "What do you do?", "I am a teacher", "I like cooking", "My favorite color is blue", "I have a cat",
    "She has a dog", "My birthday is in June", "I like pizza", "Nice to hear that", "Tell me more"
  ]);
  console.log("Sentences with Audio generated.");

  // 7. Seed Grammar Exercises
  const gExData: GrammarExercise[] = [
    { grammarId: a1G1, question: "I ___ happy.", type: "MCQ", explanation: "I đi với am.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1G1, question: "They ___ playing.", type: "MCQ", explanation: "They đi với are.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1G2, question: "He ___ fast.", type: "FILL", explanation: "Run thêm s cho ngôi thứ 3 số ít.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: b1G1, question: "I have ___ home.", type: "MCQ", explanation: "V3 của go là gone.", createdAt: new Date(), updatedAt: new Date() }
  ];
  const gExResults = await db.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION).insertMany(gExData);
  
  const optData: ExerciseOption[] = [
    { exerciseId: gExResults.insertedIds[0], content: "am", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[0], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[1], content: "are", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[1], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[2], content: "runs", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[3], content: "gone", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[3], content: "went", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION).insertMany(optData);
  console.log(`Created Grammar Exercises & Options`);

  // 8. Seed Quizzes
  const quizData: Quiz[] = [
    { scopeType: "TOPIC", scopeId: tFamily, title: "Kiểm tra chủ đề Gia Đình", passScore: 80, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { scopeType: "TOPIC", scopeId: tAnimals, title: "Kiểm tra chủ đề Động Vật", passScore: 80, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ];
  const quizResults = await db.collection<Quiz>(QUIZ_COLLECTION).insertMany(quizData);
  
  const qData: Question[] = [
    { quizId: quizResults.insertedIds[0], sourceType: "VOCAB", question: "Mẹ tiếng Anh là gì?", options: ["Mother", "Father", "Sister"], correctAnswer: "Mother", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: quizResults.insertedIds[1], sourceType: "VOCAB", question: "Tiger là con gì?", options: ["Hổ", "Sư tử", "Mèo"], correctAnswer: "Hổ", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection<Question>(QUESTION_COLLECTION).insertMany(qData);

  // 9. Seed Comprehensive Tests (Merged from seed_tests.ts & Expanded)
  const testData: any[] = [
    {
      title: "Bài kiểm tra tổng hợp A1 - Midterm",
      description: "Tổng hợp kiến thức cơ bản A1: Số đếm, Gia đình, To-be.",
      level: "A1",
      questions: [
        { id: "a1-1", question: "I ___ a student.", type: "MCQ", options: ["am", "is", "are"], correctAnswer: "am" },
        { id: "a1-2", question: "My mother's sister is my ___.", type: "MCQ", options: ["Aunt", "Uncle", "Niece"], correctAnswer: "Aunt" },
        { id: "a1-3", question: "Where ___ you from?", type: "FILL", correctAnswer: "are" },
      ],
      timeLimit: 15, createdAt: new Date(), updatedAt: new Date()
    },
    {
      title: "Bài kiểm tra A2 - Giao tiếp cơ bản",
      description: "Kiểm tra thì quá khứ đơn và hiện tại tiếp diễn.",
      level: "A2",
      questions: [
        { id: "a2-1", question: "Look! They ___ football.", type: "MCQ", options: ["play", "are playing", "played"], correctAnswer: "are playing" },
        { id: "a2-2", question: "I ___ to the cinema yesterday.", type: "MCQ", options: ["go", "went", "gone"], correctAnswer: "went" },
        { id: "a2-3", question: "He is ___ than me.", type: "FILL", correctAnswer: "taller" },
      ],
      timeLimit: 20, createdAt: new Date(), updatedAt: new Date()
    },
    {
        title: "B1 Mastery Test - Level 1",
        description: "Kiểm tra toàn diện trình độ B1: Present Perfect, Modal verbs.",
        level: "B1",
        questions: [
          { id: "b1-1", question: "I have ___ home.", type: "MCQ", options: ["go", "went", "gone"], correctAnswer: "gone" },
          { id: "b1-2", question: "You ___ smoke here.", type: "MCQ", options: ["must not", "can", "may"], correctAnswer: "must not" },
          { id: "b1-3", question: "If it rains, she ___ at home.", type: "FILL", correctAnswer: "will stay" },
        ],
        timeLimit: 30, createdAt: new Date(), updatedAt: new Date()
    }
  ];
  await db.collection(TEST_COLLECTION).insertMany(testData);
  console.log(`Created ${testData.length} Comprehensive Tests`);

  console.log("\n==================================");
  console.log("🎉 SEED FINISHED SUCCESSFULLY!");
  console.log("==================================");
  
  process.exit(0);
};

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
