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
import { Sentence, SENTENCE_COLLECTION } from "./apps/Entity/Sentence";
import { Lesson, LESSON_COLLECTION } from "./apps/Entity/Lesson";

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
    { name: GRAMMAR_EXERCISE_COLLECTION, coll: db.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION) },
    { name: EXERCISE_OPTION_COLLECTION, coll: db.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION) },
    { name: GRAMMAR_COLLECTION, coll: db.collection<Grammar>(GRAMMAR_COLLECTION) },
    { name: PROGRESS_COLLECTION, coll: db.collection<Progress>(PROGRESS_COLLECTION) },
    { name: SENTENCE_COLLECTION, coll: db.collection<Sentence>(SENTENCE_COLLECTION) },
    { name: LESSON_COLLECTION, coll: db.collection<Lesson>(LESSON_COLLECTION) },
  ];

  console.log("Cleaning old data...");
  await Promise.all(collections.map(c => c.coll.deleteMany({})));

  // 1. Seed Levels (A1-C2)
  const levelData: Level[] = [
    { name: "A1", description: "Beginner - Cơ bản", minPoints: 0, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "A2", description: "Elementary - Sơ cấp", minPoints: 500, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "B1", description: "Intermediate - Trung cấp", minPoints: 1500, order: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "B2", description: "Upper Intermediate - Trung cao cấp", minPoints: 3000, order: 4, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "C1", description: "Advanced - Cao cấp", minPoints: 5000, order: 5, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: "C2", description: "Proficient - Thành thạo", minPoints: 8000, order: 6, isPublished: true, createdAt: new Date(), updatedAt: new Date() }
  ];
  await db.collection<Level>(LEVEL_COLLECTION).insertMany(levelData);
  console.log(`Created ${levelData.length} Levels`);

  const levels = await db.collection<Level>(LEVEL_COLLECTION).find().toArray();
  const a1LevelId = levels.find(l => l.name === 'A1')!._id!;
  const a2LevelId = levels.find(l => l.name === 'A2')!._id!;
  const b1LevelId = levels.find(l => l.name === 'B1')!._id!;

  // 2. Seed Users
  const password = await bcrypt.hash("Admin123", 10);
  const userPassword = await bcrypt.hash("User123", 10);
  
  const adminId = new ObjectId();
  const userId = new ObjectId();
  const advancedUserId = new ObjectId();

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
    },
    {
      _id: advancedUserId,
      name: "Lê Cao Cấp",
      email: "pro@example.com",
      password: userPassword,
      role: "USER",
      level: "C1",
      targetLevel: "C2",
      gender: "FEMALE",
      isActive: true,
      points: 5400,
      totalTopicsLearned: 42,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as User[]);
  console.log("Created Admin and 2 Users");

  // 3. Seed Grammar
  const grammarData: Grammar[] = [
    // A1
    { level: "A1", title: "Thì Hiện tại Đơn (Present Simple) - Động từ To be", description: "Sử dụng 'am/is/are' để nói về trạng thái, nghề nghiệp, tuổi tác hoặc sự thật hiển nhiên.", examples: ["I am a student.", "She is very happy today.", "They are from Vietnam."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A1", title: "Đại từ sở hữu (Possessive Pronouns)", description: "Thể hiện sự sở hữu: my, your, his, her, its, our, their.", examples: ["This is my book.", "Is that your car?", "Their house is beautiful."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A1", title: "Thì Hiện tại Đơn (Present Simple) - Động từ thường", description: "Nói về thói quen, hành động lặp đi lặp lại hoặc sự thật hiển nhiên. Thêm 's/es' với ngôi thứ ba số ít.", examples: ["I wake up at 7 AM everyday.", "He plays football on Sundays.", "The sun rises in the east."], createdAt: new Date(), updatedAt: new Date() },
    // A2
    { level: "A2", title: "Thì Hiện tại Tiếp diễn (Present Continuous)", description: "Diễn tả hành động đang diễn ra tại thời điểm nói hoặc xung quanh thời điểm nói. Cấu trúc: S + am/is/are + V-ing.", examples: ["I am reading a book right now.", "They are studying for the exam this week."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A2", title: "Danh từ đếm được và không đếm được (Countable & Uncountable Nouns)", description: "Sử dụng some/any, much/many, a lot of/lots of tùy thuộc vào loại danh từ.", examples: ["I need some water.", "Do you have any apples?", "There aren't many people here."], createdAt: new Date(), updatedAt: new Date() },
    { level: "A2", title: "Thì Quá khứ Đơn (Past Simple)", description: "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ. Sử dụng động từ cột 2 hoặc thêm -ed.", examples: ["I visited Paris last year.", "She didn't go to school yesterday."], createdAt: new Date(), updatedAt: new Date() },
    // B1
    { level: "B1", title: "Thì Hiện tại Hoàn thành (Present Perfect)", description: "Diễn tả hành động đã xảy ra ở một thời điểm không xác định trong quá khứ hoặc bắt đầu từ quá khứ kéo dài đến hiện tại. Cấu trúc: S + have/has + V3/ed.", examples: ["I have lived here for 5 years.", "She has just finished her homework."], createdAt: new Date(), updatedAt: new Date() },
    { level: "B1", title: "Câu điều kiện loại 1 (First Conditional)", description: "Diễn tả một điều kiện có thể xảy ra trong tương lai. Cấu trúc: If + S + V(htđ), S + will + V(nt).", examples: ["If it rains, we will stay at home.", "I will help you if I have time."], createdAt: new Date(), updatedAt: new Date() },
    // B2
    { level: "B2", title: "Mệnh đề quan hệ (Relative Clauses)", description: "Sử dụng who, whom, which, that, whose để bổ nghĩa cho danh từ đứng trước.", examples: ["The man who is wearing a black hat is my uncle.", "This is the book that I told you about."], createdAt: new Date(), updatedAt: new Date() },
    { level: "B2", title: "Câu bị động (Passive Voice)", description: "Nhấn mạnh vào hành động hoặc đối tượng chịu tác động. Cấu trúc: S + be + V3/ed.", examples: ["The house was built in 1990.", "Mistakes have been made."], createdAt: new Date(), updatedAt: new Date() },
    // C1
    { level: "C1", title: "Đảo ngữ (Inversion)", description: "Đưa trợ động từ lên trước chủ ngữ để nhấn mạnh, thường đi kèm với các từ phủ định hoặc bán phủ định.", examples: ["Never have I ever seen such a beautiful sunset.", "Hardly had we arrived when it started to rain."], createdAt: new Date(), updatedAt: new Date() },
    { level: "C1", title: "Câu điều kiện hỗn hợp (Mixed Conditionals)", description: "Kết hợp câu điều kiện loại 2 và 3, diễn tả giả thiết trái ngược quá khứ dẫn đến kết quả trái ngược hiện tại (hoặc ngược lại).", examples: ["If I had studied harder, I would be a doctor now.", "If she didn't love him, she wouldn't have married him."], createdAt: new Date(), updatedAt: new Date() }
  ];
  const grammarResults = await db.collection<Grammar>(GRAMMAR_COLLECTION).insertMany(grammarData);
  const a1Grammar1Id = grammarResults.insertedIds[0];
  const a2Grammar3Id = grammarResults.insertedIds[5]; // Past simple
  const b1Grammar1Id = grammarResults.insertedIds[6]; // Present Perfect
  console.log(`Created ${grammarData.length} Grammar Points`);

  // 4. Seed Topics
  const topicData: Topic[] = [
    // A1 Topics
    { title: "Gia đình và Bạn bè (Family & Friends)", description: "Từ vựng cơ bản về các thành viên trong gia đình và các mối quan hệ.", theory: "Học cách giới thiệu và miêu tả sơ lược về thành viên gia đình.", examples: ["I have a big family.", "My best friend is Mary."], order: 1, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Động vật (Animals)", description: "Tên các loài động vật nuôi và thú hoang dã thông dụng.", theory: "Cách gọi tên động vật và một số đặc điểm cơ bản.", examples: ["My dog is very smart.", "Elephants are large animals."], order: 2, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Đồ ăn và Thức uống (Food & Drinks)", description: "Các từ vựng về bữa ăn, nguyên liệu và đồ uống quen thuộc.", theory: "Cách gọi món và nói về sở thích ăn uống.", examples: ["I like eating pizza.", "I drink milk every morning."], order: 3, level: "A1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    
    // A2 Topics
    { title: "Du lịch và Kỳ nghỉ (Travel & Holidays)", description: "Các phương tiện giao thông, địa điểm du lịch và kỳ nghỉ.", theory: "Từ vựng dùng ở bến xe, sân bay, khách sạn.", examples: ["We booked a flight to Paris.", "The hotel was very comfortable."], order: 1, level: "A2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Sức khỏe và Y tế (Health & Medical)", description: "Các triệu chứng bệnh cơ bản và từ vựng tại phòng khám.", theory: "Cách diễn đạt khi bị ốm hoặc khi gặp bác sĩ.", examples: ["I have a terrible headache.", "The doctor prescribed some medicine."], order: 2, level: "A2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    
    // B1 Topics
    { title: "Công việc và Nghề nghiệp (Work & Professions)", description: "Từ vựng nơi công sở, chức danh và phỏng vấn xin việc.", theory: "Mô tả công việc và các trách nhiệm.", examples: ["She works as a software engineer.", "He was promoted to manager last month."], order: 1, level: "B1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Giáo dục (Education)", description: "Trường học, đại học, môn học và thi cử.", theory: "Nói về kinh nghiệm học tập và bằng cấp.", examples: ["I graduated from university in 2020.", "The final exam is next week."], order: 2, level: "B1", isPublished: true, createdAt: new Date(), updatedAt: new Date() },

    // B2 Topics
    { title: "Môi trường (Environment)", description: "Biến đổi khí hậu, tái chế và bảo vệ tự nhiên.", theory: "Thảo luận về các vấn đề toàn cầu.", examples: ["Global warming is a serious issue.", "We should reduce carbon footprint."], order: 1, level: "B2", isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    
    // C1 Topics
    { title: "Công nghệ Tương lai (Future Technology)", description: "AI, không gian lượng tử, và đột phá khoa học.", theory: "Từ vựng công nghệ chuyên sâu và xu hướng.", examples: ["Artificial intelligence will revolutionize industries.", "Quantum computing poses new cryptographic challenges."], order: 1, level: "C1", isPublished: true, createdAt: new Date(), updatedAt: new Date() }
  ];
  const topicResults = await db.collection<Topic>(TOPIC_COLLECTION).insertMany(topicData);
  const tFamilyA1 = topicResults.insertedIds[0];
  const tAnimalsA1 = topicResults.insertedIds[1];
  const tFoodA1 = topicResults.insertedIds[2];
  const tTravelA2 = topicResults.insertedIds[3];
  const tWorkB1 = topicResults.insertedIds[5];
  const tTechC1 = topicResults.insertedIds[8];
  console.log(`Created ${topicData.length} Topics`);

  // 4.5. Seed Lessons
  const lessonData: Omit<Lesson, '_id'>[] = [
    { title: "Chào hỏi cơ bản", image: "https://i.imgur.com/CJjS4fC.png", level_id: a1LevelId, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Hỏi và trả lời thông tin cá nhân", image: "https://i.imgur.com/CJjS4fC.png", level_id: a1LevelId, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Các hoạt động hàng ngày", image: "https://i.imgur.com/CJjS4fC.png", level_id: a2LevelId, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Tại sân bay", image: "https://i.imgur.com/CJjS4fC.png", level_id: a2LevelId, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { title: "Nói về công việc", image: "https://i.imgur.com/CJjS4fC.png", level_id: b1LevelId, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ];
  const lessonResults = await db.collection<Lesson>(LESSON_COLLECTION).insertMany(lessonData as any[]);
  const lesson1Id = lessonResults.insertedIds[0];
  const lesson2Id = lessonResults.insertedIds[1];
  const lesson3Id = lessonResults.insertedIds[2];
  const lesson4Id = lessonResults.insertedIds[3];
  const lesson5Id = lessonResults.insertedIds[4];
  console.log(`Created ${lessonData.length} Lessons`);

  // 5. Seed Vocabulary
  const vocabData: Vocabulary[] = [
    // Family A1
    { topicId: tFamilyA1, word: "Mother", meaning: "Mẹ", definitionVi: "Người phụ nữ sinh ra bạn.", phonetic: "/ˈmʌðər/", example: "My mother is a doctor.", exampleVi: "Mẹ tôi là một bác sĩ.", topic: "Family & Friends", level: "A1", learned: 15, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamilyA1, word: "Father", meaning: "Cha/Bố", definitionVi: "Người đàn ông sinh ra bạn.", phonetic: "/ˈfɑːðər/", example: "My father loves cooking.", exampleVi: "Bố tôi thích nấu ăn.", topic: "Family & Friends", level: "A1", learned: 12, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamilyA1, word: "Brother", meaning: "Anh/Em trai", definitionVi: "Nam giới cùng cha mẹ với bạn.", phonetic: "/ˈbrʌðər/", example: "I have one younger brother.", exampleVi: "Tôi có một đứa em trai.", topic: "Family & Friends", level: "A1", learned: 5, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamilyA1, word: "Sister", meaning: "Chị/Em gái", definitionVi: "Nữ giới cùng cha mẹ với bạn.", phonetic: "/ˈsɪstər/", example: "Her sister is very tall.", exampleVi: "Chị của cô ấy rất cao.", topic: "Family & Friends", level: "A1", learned: 8, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamilyA1, word: "Grandmother", meaning: "Bà", definitionVi: "Mẹ của cha hoặc mẹ bạn.", phonetic: "/ˈɡrænmʌðər/", example: "My grandmother tells great stories.", exampleVi: "Bà tôi kể chuyện rất hay.", topic: "Family & Friends", level: "A1", learned: 3, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFamilyA1, word: "Grandfather", meaning: "Ông", definitionVi: "Cha của cha hoặc mẹ bạn.", phonetic: "/ˈɡrænfɑːðər/", example: "My grandfather looks after the garden.", exampleVi: "Ông tôi chăm sóc khu vườn.", topic: "Family & Friends", level: "A1", learned: 2, createdAt: new Date(), updatedAt: new Date() },

    // Animals A1
    { topicId: tAnimalsA1, word: "Dog", meaning: "Chó", definitionVi: "Động vật bốn chân thường được nuôi làm thú cưng.", phonetic: "/dɒɡ/", example: "The dog is barking.", exampleVi: "Con chó đang sủa.", topic: "Animals", level: "A1", learned: 20, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimalsA1, word: "Cat", meaning: "Mèo", definitionVi: "Động vật nhỏ nuôi trong nhà có khả năng bắt chuột.", phonetic: "/kæt/", example: "She has a black cat.", exampleVi: "Cô ấy có một con mèo đen.", topic: "Animals", level: "A1", learned: 25, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimalsA1, word: "Bird", meaning: "Chim", definitionVi: "Động vật có cánh và có thể bay.", phonetic: "/bɜːd/", example: "The bird is singing in the tree.", exampleVi: "Con chim đang hót trên cây.", topic: "Animals", level: "A1", learned: 10, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tAnimalsA1, word: "Elephant", meaning: "Voi", definitionVi: "Loài động vật lớn có vòi dài.", phonetic: "/ˈelɪfənt/", example: "Elephants live in Africa and Asia.", exampleVi: "Voi sống ở Châu Phi và Châu Á.", topic: "Animals", level: "A1", learned: 8, createdAt: new Date(), updatedAt: new Date() },

    // Food A1
    { topicId: tFoodA1, word: "Apple", meaning: "Quả táo", definitionVi: "Loại trái cây có vỏ đỏ hoặc xanh.", phonetic: "/ˈæpl/", example: "An apple a day keeps the doctor away.", exampleVi: "Mỗi ngày một quả táo, thầy thuốc không đến nhà.", topic: "Food & Drinks", level: "A1", learned: 30, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFoodA1, word: "Bread", meaning: "Bánh mì", definitionVi: "Thực phẩm làm từ bột mì nướng.", phonetic: "/bred/", example: "I like fresh bread with butter.", exampleVi: "Tôi thích bánh mì tươi với bơ.", topic: "Food & Drinks", level: "A1", learned: 15, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tFoodA1, word: "Water", meaning: "Nước", definitionVi: "Chất lỏng trong suốt cần thiết cho sự sống.", phonetic: "/ˈwɔːtər/", example: "Drink plenty of water.", exampleVi: "Hãy uống nhiều nước.", topic: "Food & Drinks", level: "A1", learned: 40, createdAt: new Date(), updatedAt: new Date() },

    // Travel A2
    { topicId: tTravelA2, word: "Airport", meaning: "Sân bay", definitionVi: "Nơi máy bay cất cánh và hạ cánh.", phonetic: "/ˈeəpɔːt/", example: "We arrived at the airport early.", exampleVi: "Chúng tôi đến sân bay sớm.", topic: "Travel & Holidays", level: "A2", learned: 12, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tTravelA2, word: "Luggage", meaning: "Hành lý", definitionVi: "Túi, vali mang theo khi đi du lịch.", phonetic: "/ˈlʌɡɪdʒ/", example: "Don't leave your luggage unattended.", exampleVi: "Đừng để hành lý của bạn không có người trông coi.", topic: "Travel & Holidays", level: "A2", learned: 9, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tTravelA2, word: "Passport", meaning: "Hộ chiếu", definitionVi: "Giấy tờ do chính phủ cấp để xuất nhập cảnh.", phonetic: "/ˈpɑːspɔːt/", example: "Show your passport at the check-in desk.", exampleVi: "Hãy xuất trình hộ chiếu tại quầy làm thủ tục.", topic: "Travel & Holidays", level: "A2", learned: 15, createdAt: new Date(), updatedAt: new Date() },

    // Work B1
    { topicId: tWorkB1, word: "Employee", meaning: "Nhân viên", definitionVi: "Người làm việc cho một cá nhân hoặc công ty.", phonetic: "/ɪmˈplɔɪiː/", example: "The company has over 500 employees.", exampleVi: "Công ty có hơn 500 nhân viên.", topic: "Work & Professions", level: "B1", learned: 25, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tWorkB1, word: "Interview", meaning: "Phỏng vấn", definitionVi: "Buổi gặp gỡ để đánh giá ứng viên.", phonetic: "/ˈɪntəvjuː/", example: "I have a job interview tomorrow.", exampleVi: "Tôi có một buổi phỏng vấn xin việc vào ngày mai.", topic: "Work & Professions", level: "B1", learned: 18, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tWorkB1, word: "Salary", meaning: "Lương", definitionVi: "Khoản tiền trả định kỳ cho người lao động.", phonetic: "/ˈsæləri/", example: "They offered him a competitive salary.", exampleVi: "Họ đề nghị trả cho anh ấy mức lương cạnh tranh.", topic: "Work & Professions", level: "B1", learned: 22, createdAt: new Date(), updatedAt: new Date() },

    // Tech C1
    { topicId: tTechC1, word: "Algorithm", meaning: "Thuật toán", definitionVi: "Một nhóm các quy tắc hoặc quá trình giải quyết vấn đề.", phonetic: "/ˈælɡərɪðəm/", example: "The search engine uses a complex algorithm.", exampleVi: "Công cụ tìm kiếm sử dụng một thuật toán phức tạp.", topic: "Future Technology", level: "C1", learned: 40, createdAt: new Date(), updatedAt: new Date() },
    { topicId: tTechC1, word: "Paradigm", meaning: "Mô hình / Hệ tiêu chuẩn", definitionVi: "Một hình mẫu điển hình của một nội dung nào đó.", phonetic: "/ˈpærədaɪm/", example: "Cloud computing represents a new paradigm in IT.", exampleVi: "Điện toán đám mây đại diện cho một mô hình mới trong ngành CNTT.", topic: "Future Technology", level: "C1", learned: 15, createdAt: new Date(), updatedAt: new Date() }
  ];
  await db.collection<Vocabulary>(VOCABULARY_COLLECTION).insertMany(vocabData);
  console.log(`Created ${vocabData.length} Vocabulary Items`);

  // 5.1. Seed Sentences for Speaking Practice
  const sentenceSeedData = [
    // Lesson 1 (A1)
    { lesson_id: lesson1Id, text: "Hello, how are you?", type: "speaking", order: 1 },
    { lesson_id: lesson1Id, text: "My name is John. What's your name?", type: "speaking", order: 2 },
    { lesson_id: lesson1Id, text: "This is my mother. Her name is Mary.", type: "listening", order: 3 },
    { lesson_id: lesson1Id, text: "I have one brother and two sisters.", type: "listening", order: 4 },

    // Lesson 2 (A2)
    { lesson_id: lesson2Id, text: "Where are you from?", type: "speaking", order: 1 },
    { lesson_id: lesson2Id, text: "Could you please tell me how to get to the airport?", type: "speaking", order: 2 },
    
    // Lesson 3 (B1)
    { lesson_id: lesson3Id, text: "I wake up early in the morning.", type: "speaking", order: 1 },
    { lesson_id: lesson3Id, text: "My main responsibility is to develop new features.", type: "listening", order: 2 },
  ];

  console.log("Generating audio Base64 for sentences...");
  const sentenceDataWithAudio: Sentence[] = [];
  for (const s of sentenceSeedData) {
    const base64Audio = await googleTTS.getAudioBase64(s.text, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
    });

    sentenceDataWithAudio.push(
      new Sentence({
        lesson_id: s.lesson_id,
        text: s.text,
        order: s.order,
        audio_url: `data:audio/mp3;base64,${base64Audio}`,
        type: s.type as "speaking" | "listening"
      })
    );
  }

  if (sentenceDataWithAudio.length > 0) {
    await db
      .collection<Sentence>(SENTENCE_COLLECTION)
      .insertMany(sentenceDataWithAudio as any[]);
    console.log(
      `Created ${sentenceDataWithAudio.length} Sentences with audio URLs`
    );
  }


  // 6. Seed Grammar Exercises
  const gExData: GrammarExercise[] = [
    // A1 To-be
    { grammarId: a1Grammar1Id, question: "I ___ from Vietnam.", type: "MCQ", explanation: "Với chủ ngữ 'I', động từ to-be luôn là 'am'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1Grammar1Id, question: "She ___ a good teacher.", type: "MCQ", explanation: "Với chủ ngữ ngôi số ít (She), động từ to-be là 'is'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1Grammar1Id, question: "They ___ playing football now.", type: "MCQ", explanation: "Với chủ ngữ số nhiều (They), động từ to-be là 'are'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1Grammar1Id, question: "My name ___ John.", type: "MCQ", explanation: "Chủ ngữ 'My name' là số ít nên dùng 'is'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a1Grammar1Id, question: "We ___ happy to see you.", type: "MCQ", explanation: "Chủ ngữ 'We' dùng 'are'.", createdAt: new Date(), updatedAt: new Date() },

    // A2 Past Simple
    { grammarId: a2Grammar3Id, question: "Yesterday, I ___ to the cinema.", type: "MCQ", explanation: "Quá khứ của 'go' là 'went'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: a2Grammar3Id, question: "She ___ pizza last night.", type: "FILL", explanation: "Quá khứ của 'eat' là 'ate'.", createdAt: new Date(), updatedAt: new Date() },

    // B1 Present Perfect
    { grammarId: b1Grammar1Id, question: "I have never ___ to Japan.", type: "MCQ", explanation: "Quá khứ phân từ của 'be' là 'been'.", createdAt: new Date(), updatedAt: new Date() },
    { grammarId: b1Grammar1Id, question: "She ___ finished her homework.", type: "MCQ", explanation: "Với ngôi số ít 'She', dùng trợ động từ 'has'.", createdAt: new Date(), updatedAt: new Date() }
  ];
  const gExResults = await db.collection<GrammarExercise>(GRAMMAR_EXERCISE_COLLECTION).insertMany(gExData);
  
  // Create options for MCQ exercises
  const optionsData: Omit<ExerciseOption, "_id">[] = [
    // I ___ from Vietnam.
    { exerciseId: gExResults.insertedIds[0], content: "am", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[0], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[0], content: "are", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    
    // She ___ a good teacher.
    { exerciseId: gExResults.insertedIds[1], content: "am", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[1], content: "is", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[1], content: "are", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },

    // They ___ playing football now.
    { exerciseId: gExResults.insertedIds[2], content: "am", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[2], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[2], content: "are", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },

    // My name ___ John.
    { exerciseId: gExResults.insertedIds[3], content: "am", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[3], content: "is", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[3], content: "are", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },

    // We ___ happy to see you.
    { exerciseId: gExResults.insertedIds[4], content: "am", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[4], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[4], content: "are", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },

    // Yesterday, I ___ to the cinema.
    { exerciseId: gExResults.insertedIds[5], content: "go", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[5], content: "went", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[5], content: "goes", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[5], content: "gone", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },

    // I have never ___ to Japan.
    { exerciseId: gExResults.insertedIds[7], content: "be", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[7], content: "been", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[7], content: "went", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },

    // She ___ finished her homework.
    { exerciseId: gExResults.insertedIds[8], content: "have", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[8], content: "has", isCorrect: true, createdAt: new Date(), updatedAt: new Date() },
    { exerciseId: gExResults.insertedIds[8], content: "is", isCorrect: false, createdAt: new Date(), updatedAt: new Date() },
  ];

  // For FILL exercises, we can store the answer in correctOption (or in the text itself if needed by logic)
  optionsData.push({ exerciseId: gExResults.insertedIds[6], content: "ate", isCorrect: true, createdAt: new Date(), updatedAt: new Date() });

  await db.collection<ExerciseOption>(EXERCISE_OPTION_COLLECTION).insertMany(optionsData as ExerciseOption[]);
  console.log(`Created ${gExData.length} Grammar Exercises with options`);

  // 7. Seed Quizzes and Questions
  const quizData: Quiz[] = [
    { scopeType: "TOPIC", scopeId: tFamilyA1, title: "Từ vựng Chủ đề Gia Đình", passScore: 80, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { scopeType: "TOPIC", scopeId: tAnimalsA1, title: "Thế giới Động vật", passScore: 75, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { scopeType: "TOPIC", scopeId: tWorkB1, title: "Tiếng Anh Công sở", passScore: 70, isPublished: true, createdAt: new Date(), updatedAt: new Date() }
  ];
  const quizResults = await db.collection<Quiz>(QUIZ_COLLECTION).insertMany(quizData);
  const qFamilyId = quizResults.insertedIds[0];
  const qAnimalId = quizResults.insertedIds[1];
  const qWorkId = quizResults.insertedIds[2];

  const questionsData: Question[] = [
    // Family Quiz
    { quizId: qFamilyId, sourceType: "VOCAB", question: "Từ tiếng anh của 'Mẹ' là gì?", options: ["Mother", "Father", "Brother", "Sister"], correctAnswer: "Mother", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qFamilyId, sourceType: "VOCAB", question: "Từ nào mô tả người đàn ông sinh ra bạn?", options: ["Mother", "Father", "Brother", "Uncle"], correctAnswer: "Father", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qFamilyId, sourceType: "VOCAB", question: "Bạn gọi chị gái hoặc em gái của mình bằng từ tiếng Anh nào?", options: ["Aunt", "Cousin", "Brother", "Sister"], correctAnswer: "Sister", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qFamilyId, sourceType: "VOCAB", question: "Bà của bạn (mẹ của cha/mẹ) tiếng Anh là gì?", options: ["Grandfather", "Grandmother", "Aunt", "Mother"], correctAnswer: "Grandmother", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },

    // Animal Quiz
    { quizId: qAnimalId, sourceType: "VOCAB", question: "Loài vật nào có 'vòi' dài?", options: ["Cat", "Dog", "Bird", "Elephant"], correctAnswer: "Elephant", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qAnimalId, sourceType: "VOCAB", question: "Từ 'Cat' nghĩa là gì?", options: ["Chó", "Mèo", "Chuột", "Chim"], correctAnswer: "Mèo", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qAnimalId, sourceType: "VOCAB", question: "Con vật bay trên trời gọi là gì?", options: ["Bird", "Dog", "Fish", "Cat"], correctAnswer: "Bird", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },

    // Work Quiz
    { quizId: qWorkId, sourceType: "VOCAB", question: "Từ nào có nghĩa là 'Lương'?", options: ["Money", "Bonus", "Salary", "Employee"], correctAnswer: "Salary", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qWorkId, sourceType: "VOCAB", question: "Buổi gặp gỡ để đánh giá ứng viên xin việc gọi là:", options: ["Meeting", "Interview", "Party", "Discussion"], correctAnswer: "Interview", type: "MCQ", createdAt: new Date(), updatedAt: new Date() },
    { quizId: qWorkId, sourceType: "VOCAB", question: "Nhân viên trong một công ty tiếng Anh là:", options: ["Manager", "Employee", "Boss", "Customer"], correctAnswer: "Employee", type: "MCQ", createdAt: new Date(), updatedAt: new Date() }
  ];
  await db.collection<Question>(QUESTION_COLLECTION).insertMany(questionsData);
  console.log(`Created ${quizData.length} Quizzes with ${questionsData.length} Questions`);

  // 8. Seed initial progress for Test User
  await db.collection<Progress>(PROGRESS_COLLECTION).insertOne({
    userId: userId,
    topicProgress: [
      { topicId: tFamilyA1, status: "COMPLETED", vocabLearned: [], bestScore: 100, quizPassed: true, completedAt: new Date() },
      { topicId: tAnimalsA1, status: "IN_PROGRESS", vocabLearned: [], bestScore: 50, quizPassed: false }
    ],
    levelProgress: [
      { level: "A1", status: "IN_PROGRESS", grammarLearned: [], completedAt: undefined }
    ],
    quizResults: [
      { quizId: qFamilyId, score: 100, total: 100, percentage: 100, passed: true, takenAt: new Date() }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  } as Progress);
  console.log("Initial progress for test user seeded");

  console.log("\n==================================");
  console.log("🎉 MASSIVE SEED FINISHED SUCCESSFULLY!");
  console.log("- Total Levels      : ", levelData.length);
  console.log("- Total Topics      : ", topicData.length);
  console.log("- Total Lessons     : ", lessonData.length);
  console.log("- Total Vocabs      : ", vocabData.length);
  console.log("- Total Grammar     : ", grammarData.length);
  console.log("- Total Exercises   : ", gExData.length);
  console.log("- Total Quizzes     : ", quizData.length);
  console.log("- Total Questions   : ", questionsData.length);
  console.log("==================================");
  console.log("Access Information:");
  console.log("- Admin: admin@example.com / Admin123");
  console.log("- User (A1): user@example.com / User123");
  console.log("- User (C1): pro@example.com / User123");
  console.log("==================================");
  
  process.exit(0);
};

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
