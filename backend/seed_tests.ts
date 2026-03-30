import { ObjectId } from "mongodb";
import { DatabaseConnection } from "./apps/Database/Database";
import { TEST_COLLECTION } from "./apps/Entity/Test";
import { USER_COLLECTION } from "./apps/Entity/User";

const seedTests = async () => {
  try {
    const client = DatabaseConnection.getMongoClient();
    await client.connect();
    const db = client.db();

    console.log("Seeding sample test...");

    // 1. Create a sample test
    const sampleTest = {
      title: "Bài kiểm tra tổng hợp A1 - Số 1",
      description: "Kiểm tra kiến thức cơ bản về từ vựng gia đình và thì hiện tại đơn.",
      level: "A1",
      questions: [
        {
          id: "q1",
          question: "My mother's sister is my ___.",
          type: "MCQ",
          options: ["Uncle", "Aunt", "Brother", "Sister"],
          correctAnswer: "Aunt"
        },
        {
          id: "q2",
          question: "I ___ a student.",
          type: "FILL",
          correctAnswer: "am"
        },
        {
          id: "q3",
          question: "They ___ from London.",
          type: "MCQ",
          options: ["is", "am", "are"],
          correctAnswer: "are"
        }
      ],
      timeLimit: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const testResult = await db.collection(TEST_COLLECTION).insertOne(sampleTest);
    const testId = testResult.insertedId;

    // 2. Find the test user
    const user = await db.collection(USER_COLLECTION).findOne({ email: "user@example.com" });
    const userId = user?._id;

    console.log("\n==================================");
    console.log("✅ SEED TEST SUCCESSFUL!");
    console.log("Test ID   : ", testId.toString());
    console.log("User ID   : ", userId?.toString() || "Not found (Run npm run seed first)");
    console.log("==================================\n");

    if (userId) {
      console.log("CURL COMMANDS TO TEST:");
      console.log("\n1. Get all tests:");
      console.log(`curl http://localhost:4000/api/tests`);

      console.log("\n2. Submit test attempt (A1):");
      console.log(`curl -X POST http://localhost:4000/api/tests/${testId}/submit \\`);
      console.log(`-H "Content-Type: application/json" \\`);
      console.log(`-d '{"userId": "${userId}", "answers": [{"questionId": "q1", "answer": "Aunt"}, {"questionId": "q2", "answer": "am"}, {"questionId": "q3", "answer": "are"}]}'`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTests();
