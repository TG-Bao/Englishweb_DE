import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, Lock, Play, Layout, ChevronRight, Sparkles } from "lucide-react";

type Topic = {
  _id: string;
  title: string;
  description?: string;
  level: string;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  status?: "LOCKED" | "IN_PROGRESS" | "COMPLETED";
};

const VocabularyPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTopics = async () => {
    try {
      const res = await api.get("/topics");
      setTopics(res.data);
      if (res.data.length > 0) {
        setSelectedTopic(res.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load topics", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (topicId: string) => {
    try {
      const res = await api.get(`/lessons/topic/${topicId}`);
      setLessons(res.data);
    } catch (err) {
      console.error("Failed to load lessons", err);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadLessons(selectedTopic);
    }
  }, [selectedTopic]);

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 0' }}>
        {/* Header Section */}
        <header style={{ marginBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge" style={{ marginBottom: '12px' }}>LỘ TRÌNH HỌC TẬP</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>Kho Từ Vựng</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px' }}>
              Khám phá các chủ đề Tiếng Anh đa dạng, từ cơ bản đến nâng cao. Chinh phục từng bài học để thăng hạng!
            </p>
          </motion.div>
        </header>

        <div className="flex gap-8 items-start flex-col lg:flex-row">
          {/* Topic Sidebar */}
          <aside style={{ flex: '0 0 320px', width: '100%' }}>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <div className="flex items-center gap-2 mb-6" style={{ fontWeight: '700', fontSize: '18px' }}>
                <Layout size={20} className="text-primary" />
                Chọn Chủ Đề
              </div>
              <div className="flex flex-col gap-2">
                {topics.map(t => (
                  <button
                    key={t._id}
                    onClick={() => setSelectedTopic(t._id)}
                    className={`nav-link ${selectedTopic === t._id ? 'active' : ''}`}
                    style={{ 
                      justifyContent: 'space-between', 
                      padding: '12px 16px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      width: '100%',
                      background: selectedTopic === t._id ? 'var(--primary-light)' : 'transparent',
                      color: selectedTopic === t._id ? 'var(--primary)' : 'var(--text)',
                      fontWeight: selectedTopic === t._id ? '700' : '500'
                    }}
                  >
                    <span>{t.title}</span>
                    <span className="badge" style={{ fontSize: '10px', padding: '2px 8px' }}>{t.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Lessons Main Content */}
          <main style={{ flex: 1, width: '100%' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                Danh sách bài học
                <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '400', marginLeft: '12px' }}>
                  ({lessons.length} bài học)
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {lessons.map((lesson, index) => {
                  const isLocked = lesson.status === "LOCKED";
                  const isCompleted = lesson.status === "COMPLETED";
                  
                  return (
                    <motion.div
                      layout
                      key={lesson._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div 
                        className={`card ${isLocked ? 'locked' : ''}`} 
                        style={{ 
                          padding: '24px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '24px',
                          opacity: isLocked ? 0.6 : 1,
                          border: isCompleted ? '1px solid var(--primary-light)' : '1px solid var(--border)'
                        }}
                      >
                        <div style={{ 
                          width: '48px', height: '48px', borderRadius: '14px',
                          background: isLocked ? 'var(--bg)' : (isCompleted ? 'var(--primary-light)' : 'var(--primary-light)'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isLocked ? <Lock size={20} color="var(--text-muted)" /> : (isCompleted ? <CheckCircle size={24} color="var(--primary)" /> : <BookOpen size={24} color="var(--primary)" />)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                            {index + 1}. {lesson.title}
                          </h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{lesson.description}</p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          {isLocked ? (
                            <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>Bị khóa</span>
                          ) : (
                            <Link to={`/lessons/${lesson._id}`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                              Bắt đầu <ChevronRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!loading && lessons.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg)', borderRadius: '24px' }}>
                  <Sparkles size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Chưa có bài học nào cho chủ đề này.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
};

export default VocabularyPage;
