import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Play, Sparkles } from "lucide-react";
import { levelService, LevelItem } from "../services/LevelService";
import { getUser } from "../utils/auth";

type Vocabulary = {
  _id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  audioUrl?: string;
  example: string;
  topic: string;
  level: string;
};

const VocabularyPage = () => {
  const user = getUser();
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(user?.level || "");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLevels = async () => {
    try {
      const res = await levelService.getPublished();
      setLevels(res);
    } catch (err) {
      console.error("Failed to load levels", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Create query params
      const params = new URLSearchParams();
      if (selectedLevel) params.append("level", selectedLevel);
      if (selectedTopic) params.append("topic", selectedTopic);
      if (searchQuery) params.append("search", searchQuery);

      const res = await api.get(`/vocabularies?${params.toString()}`);
      setVocabularies(res.data.data);

      // Extract unique topics for the filter dropdown
      if (!selectedTopic && !searchQuery && !selectedLevel) {
        const uniqueTopics = Array.from(new Set(res.data.data.map((v: Vocabulary) => v.topic))) as string[];
        setTopics(uniqueTopics);
      }
    } catch (err) {
      console.error("Failed to load vocabularies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 500); // 500ms debounce cho ô search

    return () => clearTimeout(delayDebounceFn);
  }, [selectedLevel, selectedTopic, searchQuery]);

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };

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
              {user?.level ? `Đang hiển thị từ vựng phù hợp với trình độ ${user.level} của bạn. ` : ""}
              Khám phá các chủ đề Tiếng Anh đa dạng, từ cơ bản đến nâng cao. Chinh phục từng bài học để thăng hạng!
            </p>
          </motion.div>
        </header>

        <div className="flex gap-8 items-start flex-col lg:flex-row">
          {/* Sidebar & Filters */}
          <aside style={{ flex: '0 0 320px', width: '100%' }}>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: '700', fontSize: '18px' }}>
                <Filter size={20} className="text-primary" />
                Bộ lọc từ vựng
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ vựng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* Level Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Cấp độ</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Tất cả cấp độ</option>
                  {levels.map(level => (
                    <option key={level._id} value={level.name}>{level.name} - {level.description}</option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Chủ đề</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Tất cả chủ đề</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

            </div>
          </aside>

          {/* Vocabularies Main Content */}
          <main style={{ flex: 1, width: '100%' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                Danh sách từ vựng
                <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '400', marginLeft: '12px' }}>
                  ({vocabularies.length} từ)
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {vocabularies.map((vocab, index) => (
                  <motion.div
                    layout
                    key={vocab._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className="card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        border: '1px solid var(--border)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary)' }}>
                            {vocab.word}
                          </h3>
                          {vocab.audioUrl && (
                            <button
                              onClick={() => playAudio(vocab.audioUrl!)}
                              style={{
                                background: 'var(--primary-light)', color: 'var(--primary)',
                                border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                              }}
                            >
                              <Play size={16} fill="currentColor" />
                            </button>
                          )}
                          <span className="badge" style={{ fontSize: '12px' }}>{vocab.level}</span>
                          <span className="badge" style={{ fontSize: '12px', background: 'var(--bg)' }}>{vocab.topic}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '16px' }}>
                            {vocab.phonetic}
                          </span>
                          <span style={{ fontWeight: '500', fontSize: '18px' }}>
                            {vocab.meaning}
                          </span>
                        </div>

                        {vocab.example && (
                          <div style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: '12px', borderLeft: '4px solid var(--primary-light)' }}>
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                              "{vocab.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!loading && vocabularies.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg)', borderRadius: '24px' }}>
                  <Sparkles size={40} color="var(--text-muted)" style={{ marginBottom: '16px', margin: '0 auto' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Không tìm thấy từ vựng nào phù hợp.</p>
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
