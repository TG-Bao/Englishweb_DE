import { connectDb } from "./config/db";
import { Database } from "./config/Database";
import { VocabularyDocument, VOCABULARY_COLLECTION } from "./models/Vocabulary";
import { ObjectId } from "mongodb";

const seedVocab = async () => {
    await connectDb();
    const db = Database.getInstance();
    const vocabs = db.getCollection<VocabularyDocument>(VOCABULARY_COLLECTION);

    // We reuse a dummy lesson ID for all to avoid creating real lessons
    const dummyLessonId = new ObjectId("5f8d04f14120ec42207b2222");

    const sampleVocabs: Omit<VocabularyDocument, "_id">[] = [
        // A1 - Food
        { lessonId: dummyLessonId, word: "apple", meaning: "quả táo", phonetic: "/ˈæp.əl/", audioUrl: "", example: "I eat an apple every day.", topic: "Food", level: "A1" },
        { lessonId: dummyLessonId, word: "bread", meaning: "bánh mì", phonetic: "/bred/", audioUrl: "", example: "I like bread and butter.", topic: "Food", level: "A1" },

        // A2 - Travel
        { lessonId: dummyLessonId, word: "airport", meaning: "sân bay", phonetic: "/ˈeə.pɔːt/", audioUrl: "", example: "We arrived at the airport early.", topic: "Travel", level: "A2" },
        { lessonId: dummyLessonId, word: "ticket", meaning: "vé", phonetic: "/ˈtɪk.ɪt/", audioUrl: "", example: "Can I see your ticket, please?", topic: "Travel", level: "A2" },

        // B1 - Work
        { lessonId: dummyLessonId, word: "meeting", meaning: "cuộc họp", phonetic: "/ˈmiː.tɪŋ/", audioUrl: "", example: "I have a meeting at 10 AM.", topic: "Work", level: "B1" },
        { lessonId: dummyLessonId, word: "salary", meaning: "lương", phonetic: "/ˈsæl.ər.i/", audioUrl: "", example: "Her salary is very high.", topic: "Work", level: "B1" },

        // B2 - Animals
        { lessonId: dummyLessonId, word: "endangered", meaning: "có nguy cơ tuyệt chủng", phonetic: "/ɪnˈdeɪn.dʒəd/", audioUrl: "", example: "Pandas are an endangered species.", topic: "Animals", level: "B2" },
        { lessonId: dummyLessonId, word: "habitat", meaning: "môi trường sống", phonetic: "/ˈhæb.ɪ.tæt/", audioUrl: "", example: "The forest is their natural habitat.", topic: "Animals", level: "B2" },

        // C1 - Environment
        { lessonId: dummyLessonId, word: "sustainable", meaning: "bền vững", phonetic: "/səˈsteɪ.nə.bəl/", audioUrl: "", example: "We need sustainable energy sources.", topic: "Environment", level: "C1" },
        { lessonId: dummyLessonId, word: "emissions", meaning: "khí thải", phonetic: "/iˈmɪʃ.ənz/", audioUrl: "", example: "We must reduce carbon emissions.", topic: "Environment", level: "C1" }
    ];

    await vocabs.insertMany(sampleVocabs as VocabularyDocument[]);

    console.log(`Seeded ${sampleVocabs.length} vocabularies successfully.`);
    process.exit(0);
};

seedVocab().catch(err => {
    console.error(err);
    process.exit(1);
});
