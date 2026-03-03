import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Book, GraduationCap, ChevronLeft, CheckCircle2, PlayCircle, Info, Star, ArrowRight } from "lucide-react";

type Lesson = {
  _id: string;
  title: string;
  description?: string;
};

type Vocabulary = {
  _id: string;
  word: string;
  meaning: string;
  example: string;
  level: string;
  phonetic?: string;
};

type Grammar = {
  _id: string;
  title: string;
  description: string;
  examples: string[];
};

type Overview = {
  vocabLearned: number;
  vocabTotal: number;
  grammarLearned: number;
  grammarTotal: number;
  quizPassed: boolean;
  completionPercent: number;
  status: string;
};

const LessonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [grammar, setGrammar] = useState<Grammar[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/lessons/${id}`);
      setLesson(res.data.lesson);
      setVocabulary(res.data.vocabulary || []);
      setGrammar(res.data.grammar || []);
      setQuizId(res.data.quiz?._id || null);
      setOverview(res.data.overview || null);
    } catch (err) {
      console.error("Failed to load lesson details", err);
    } finally {
      setLoading(false);
    }
  };

  const markVocab = async (vocabId: string) => {
    if (!id) return;
    await api.post("/progress/vocabulary", { lessonId: id, vocabId });
    load(); // Refresh overview
  };

  const markGrammar = async (grammarId: string) => {
    if (!id) return;
    await api.post("/progress/grammar", { lessonId: id, grammarId });
    load(); // Refresh overview
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 0' }}>
        {/* Breadcrumb / Back Navigation */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={() => navigate("/vocabulary")}
            className="btn btn-ghost"
            style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={18} /> Quay lại danh sách bài học
          </button>
        </div>

        {/* Hero Section */}
        <div className="flex justify-between items-start gap-12 mb-12 flex-col md:flex-row">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ flex: 1 }}
          >
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>{lesson?.title || "Lesson"}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '20px', lineHeight: '1.6' }}>{lesson?.description || ""}</p>
            
            <div className="flex gap-4 mt-8">
              {quizId && (
                <Link className="btn btn-primary" to={`/quiz?quizId=${quizId}`}>
                  <PlayCircle size={20} /> Làm bài kiểm tra ngay
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ flex: '0 0 360px', padding: '32px', background: 'var(--primary-light)', border: 'none' }}
          >
            <div className="flex items-center gap-2 mb-6" style={{ fontWeight: '800', color: 'var(--primary)' }}>
              <Star size={20} /> TIẾN ĐỘ BÀI HỌC
            </div>
            {overview ? (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                    <span>Hoàn thành bài học</span>
                    <span>{overview.completionPercent}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overview.completionPercent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{overview.vocabLearned}/{overview.vocabTotal}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Từ vựng</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{overview.grammarLearned}/{overview.grammarTotal}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ngữ pháp</div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Đang tải dữ liệu...</p>
            )}
          </motion.div>
        </div>

        {/* Content Tabs/Grid */}
        <div className="flex gap-12 flex-col lg:flex-row">
          {/* Vocabulary Section */}
          <section style={{ flex: 1 }}>
            <div className="flex items-center gap-3 mb-8">
              <Book size={28} className="text-primary" />
              <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Từ Vựng Cần Nhớ</h2>
            </div>
            <div className="grid gap-6">
              {vocabulary.map((item, i) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ padding: '24px' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>{item.word}</h3>
                        {item.phonetic && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/{item.phonetic}/</span>}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '600' }}>{item.meaning}</div>
                    </div>
                    <span className="badge">{item.level}</span>
                  </div>
                  <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', marginBottom: '16px', borderLeft: '4px solid var(--primary-light)' }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>"{item.example}"</p>
                  </div>
                  <button className="btn btn-ghost" onClick={() => markVocab(item._id)} style={{ width: '100%', border: '1px solid var(--border)', fontWeight: '700' }}>
                    <CheckCircle2 size={18} className="text-green-500" /> Đã thuộc từ này
                  </button>
                </motion.div>
              ))}
              {vocabulary.length === 0 && <p className="muted">Chưa có từ vựng nào.</p>}
            </div>
          </section>

          {/* Grammar Section */}
          <section style={{ flex: 1 }}>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap size={28} className="text-primary" />
              <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Cấu Trúc Ngữ Pháp</h2>
            </div>
            <div className="grid gap-6">
              {grammar.map((item, i) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ padding: '24px', borderLeft: '6px solid var(--primary)' }}
                >
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ marginBottom: '20px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.description}</p>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>VÍ DỤ</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.examples.map((example, idx) => (
                        <li key={idx} className="flex gap-2 items-start" style={{ background: 'var(--primary-light)', padding: '10px 16px', borderRadius: '8px', fontSize: '14px' }}>
                          <Info size={16} className="text-primary mt-1 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-ghost" onClick={() => markGrammar(item._id)} style={{ width: '100%', border: '1px solid var(--border)', fontWeight: '700' }}>
                     <CheckCircle2 size={18} className="text-green-500" /> Đã hiểu cấu trúc
                  </button>
                </motion.div>
              ))}
              {grammar.length === 0 && <p className="muted">Chưa có ngữ pháp nào.</p>}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default LessonDetailPage;
