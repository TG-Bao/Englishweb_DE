import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Play, Sparkles, Volume2, BookOpen, Layers, BarChart3, RotateCcw, CheckCircle } from "lucide-react";
import { levelService, LevelItem } from "../services/LevelService";
import { getUser } from "../utils/auth";

type Vocabulary = {
  _id: string;
  word: string;
  meaning: string;
  definitionVi?: string;
  phonetic?: string;
  audioUrl?: string;
  learned?: number;
  example: string;
  exampleVi?: string;
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
  const [activeTab, setActiveTab] = useState<'study' | 'learned'>('study');

  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

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
      params.append("learned", activeTab === 'learned' ? "1" : "0");

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
  }, [selectedLevel, selectedTopic, searchQuery, activeTab]);

  const playAudio = (e: React.MouseEvent, audioUrl: string) => {
    e.stopPropagation(); // Ngăn flip khi bấm audio
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLearned = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.patch(`/vocabularies/${id}/toggle-learned`);
      // Xoá khỏi danh sách hiện tại để tạo cảm giác flashcard mượt mà
      setVocabularies(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error("Failed to toggle learned status", err);
    }
  };

  // Thống kê
  const uniqueTopicsCount = new Set(vocabularies.map(v => v.topic)).size;
  const uniqueLevelsCount = new Set(vocabularies.map(v => v.level)).size;

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 3rem' }}>
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

        {/* Thống kê nhanh */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '14px' }}>
              <BookOpen size={22} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800' }}>{vocabularies.length}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tổng từ vựng</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '14px' }}>
              <Layers size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800' }}>{uniqueTopicsCount}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chủ đề</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '14px' }}>
              <BarChart3 size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800' }}>{uniqueLevelsCount}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cấp độ</div>
            </div>
          </motion.div>
        </div>

        {/* Bộ lọc */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: '1 1 260px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>
              <Search size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Tìm kiếm
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>
              <Filter size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Cấp độ
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)',
                outline: 'none',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">Tất cả cấp độ</option>
              {levels.map(level => (
                <option key={level._id} value={level.name}>{level.name} - {level.description}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>
              <Layers size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Chủ đề
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)',
                outline: 'none',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Header & Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>
              {activeTab === 'study' ? 'Danh sách từ vựng' : 'Từ vựng đã học'}
              <span style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '400', marginLeft: '10px' }}>
                ({vocabularies.length} từ)
              </span>
            </h2>
            {(selectedLevel || selectedTopic || searchQuery) && (
              <button
                onClick={() => { setSelectedLevel(""); setSelectedTopic(""); setSearchQuery(""); }}
                className="btn btn-ghost"
                style={{ fontSize: '13px', gap: '6px' }}
              >
                <RotateCcw size={14} /> Xoá bộ lọc
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
            <button
              onClick={() => setActiveTab('study')}
              style={{
                padding: '10px 20px', fontSize: '15px', fontWeight: '600',
                background: 'transparent', border: 'none', borderBottom: activeTab === 'study' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'study' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px'
              }}
            >
              Danh sách từ vựng
            </button>
            <button
              onClick={() => setActiveTab('learned')}
              style={{
                padding: '10px 20px', fontSize: '15px', fontWeight: '600',
                background: 'transparent', border: 'none', borderBottom: activeTab === 'learned' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'learned' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s', ...({ marginBottom: '-1px' } as any)
              }}
            >
              Từ vựng đã học
            </button>
          </div>
        </div>

        {/* Vocabulary Grid - Flip Cards */}
        <div className="vocab-grid">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="card" style={{ height: '320px', padding: '28px' }}>
                      <div style={{ height: '24px', width: '50%', borderRadius: '8px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite', marginBottom: '16px' }} />
                      <div style={{ height: '14px', width: '35%', borderRadius: '8px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite', marginBottom: '24px' }} />
                      <div style={{ height: '16px', width: '70%', borderRadius: '8px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite', marginBottom: '12px' }} />
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ height: '24px', width: '60px', borderRadius: '99px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
                        <div style={{ height: '24px', width: '80px', borderRadius: '99px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : vocabularies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ gridColumn: '1 / -1' }}
              >
                <div style={{
                  padding: '80px 40px',
                  textAlign: 'center',
                  background: 'var(--white)',
                  borderRadius: '20px',
                  border: '2px dashed var(--border)'
                }}>
                  <Sparkles size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Chưa có từ vựng nào</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Không tìm thấy từ vựng nào phù hợp với bộ lọc hiện tại.</p>
                </div>
              </motion.div>
            ) : (
              vocabularies.map((vocab, index) => (
                <motion.div
                  layout
                  key={vocab._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={`vocab-card-wrapper ${flippedCards.has(vocab._id) ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(vocab._id)}
                >
                  <div className="vocab-card-inner">
                    {/* === MẶT TRƯỚC: Tiếng Anh === */}
                    <div className="vocab-card-front">
                      <span className="vocab-flip-hint">Click để xem nghĩa</span>

                      {/* Check Button */}
                      <button
                        onClick={(e) => toggleLearned(e, vocab._id)}
                        title={activeTab === 'study' ? "Đánh dấu đã học" : "Đánh dấu chưa học"}
                        style={{
                          position: 'absolute', top: '16px', right: '16px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: vocab.learned ? '#10b981' : 'var(--border)',
                          transition: 'color 0.2s', padding: '4px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = vocab.learned ? '#059669' : '#10b981'}
                        onMouseOut={(e) => e.currentTarget.style.color = vocab.learned ? '#10b981' : 'var(--border)'}
                      >
                        <CheckCircle size={24} strokeWidth={vocab.learned ? 2.5 : 2} />
                      </button>

                      {/* Word + Audio */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)', lineHeight: 1.2 }}>
                          {vocab.word}
                        </h3>
                        {vocab.audioUrl && (
                          <button
                            onClick={(e) => playAudio(e, vocab.audioUrl!)}
                            style={{
                              background: 'var(--primary-light)', color: 'var(--primary)',
                              border: 'none', borderRadius: '50%', width: '34px', height: '34px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                              transition: 'all 0.2s', flexShrink: 0
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                          >
                            <Volume2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Phonetic */}
                      {vocab.phonetic && (
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {vocab.phonetic}
                        </div>
                      )}

                      {/* Meaning (English definition) */}
                      <div style={{ fontSize: '17px', fontWeight: '600', color: 'var(--secondary)', marginBottom: '16px' }}>
                        {vocab.meaning}
                      </div>

                      {/* Example */}
                      {vocab.example && (
                        <div style={{
                          padding: '14px 16px',
                          background: 'var(--bg)',
                          borderRadius: '10px',
                          borderLeft: '3px solid var(--primary)',
                          marginTop: 'auto'
                        }}>
                          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                            "{vocab.example}"
                          </p>
                        </div>
                      )}

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: vocab.example ? '14px' : 'auto', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '99px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '600' }}>
                          {vocab.level}
                        </span>
                        <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '99px', background: '#fef3c7', color: '#b45309', fontWeight: '600' }}>
                          {vocab.topic}
                        </span>
                      </div>
                    </div>

                    {/* === MẶT SAU: Cùng layout mặt trước, nội dung tiếng Việt === */}
                    <div className="vocab-card-back" style={{
                      background: 'var(--white)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textAlign: 'left'
                    }}>
                      {/* Thêm Check Button ở mặt sau luôn để tiện thao tác */}
                      <button
                        onClick={(e) => toggleLearned(e, vocab._id)}
                        title={activeTab === 'study' ? "Đánh dấu đã học" : "Đánh dấu chưa học"}
                        style={{
                          position: 'absolute', top: '16px', right: '16px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: vocab.learned ? '#10b981' : 'var(--border)',
                          transition: 'color 0.2s', padding: '4px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = vocab.learned ? '#059669' : '#10b981'}
                        onMouseOut={(e) => e.currentTarget.style.color = vocab.learned ? '#10b981' : 'var(--border)'}
                      >
                        <CheckCircle size={24} strokeWidth={vocab.learned ? 2.5 : 2} />
                      </button>
                      {/* Nghĩa từ - giống word ở mặt trước */}
                      <h3 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)', lineHeight: 1.2, marginBottom: '8px' }}>
                        {vocab.word}
                      </h3>

                      {/* Phonetic - giống mặt trước */}
                      {vocab.phonetic && (
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {vocab.phonetic}
                        </div>
                      )}

                      {/* Nghĩa câu - tương ứng meaning ở mặt trước */}
                      {vocab.definitionVi && (
                        <div style={{ fontSize: '17px', fontWeight: '600', color: 'var(--secondary)', marginBottom: '16px' }}>
                          {vocab.definitionVi}
                        </div>
                      )}

                      {/* Ví dụ tiếng Việt - giống example ở mặt trước */}
                      {vocab.exampleVi && (
                        <div style={{
                          padding: '14px 16px',
                          background: 'var(--bg)',
                          borderRadius: '10px',
                          borderLeft: '3px solid var(--primary)',
                          marginTop: 'auto'
                        }}>
                          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                            "{vocab.exampleVi}"
                          </p>
                        </div>
                      )}

                      {/* Badges - giống mặt trước */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: vocab.exampleVi ? '14px' : 'auto', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '99px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '600' }}>
                          {vocab.level}
                        </span>
                        <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '99px', background: '#fef3c7', color: '#b45309', fontWeight: '600' }}>
                          {vocab.topic}
                        </span>
                      </div>

                      {/* Flip hint */}
                      <span className="vocab-flip-hint">Click để lật lại</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
};

export default VocabularyPage;
