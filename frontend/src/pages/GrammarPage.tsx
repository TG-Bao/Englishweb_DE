import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Sparkles, GraduationCap, ChevronRight, BookOpen } from "lucide-react";
import { GrammarService, GrammarLesson } from "../services/GrammarService";
import { levelService, LevelItem } from "../services/LevelService";
import { getUser } from "../utils/auth";

const GrammarPage = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [grammars, setGrammars] = useState<GrammarLesson[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(user?.level || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLevels = async () => {
    try {
      const res = await levelService.getPublished();
      setLevels(res);
      if (!selectedLevel && user?.level && res.some(l => l.name === user.level)) {
        setSelectedLevel(user.level);
      } else if (!selectedLevel && res.length > 0) {
        setSelectedLevel(res[0].name);
      }
    } catch (err) {
      console.error("Failed to load levels", err);
    }
  };

  const loadGrammars = async () => {
    if (!selectedLevel) return;
    setLoading(true);
    try {
      const data = await GrammarService.getByLevel(selectedLevel);
      setGrammars(data);
    } catch (err) {
      console.error("Failed to load grammars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  useEffect(() => {
    loadGrammars();
  }, [selectedLevel]);

  const filteredGrammars = grammars.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      {/* Dynamic Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.05), transparent 25%)',
        zIndex: -1, pointerEvents: 'none'
      }} />

      <div className="container" style={{ padding: '60px 0', maxWidth: '1200px' }}>
        {/* Premium Header */}
        <header style={{ 
          marginBottom: '56px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', 
              color: 'var(--primary)',
              padding: '10px 24px', borderRadius: '100px', fontWeight: '700', fontSize: '14px',
              marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.05)'
            }}>
              <Sparkles size={16} /> BÍ QUYẾT LÀM CHỦ NGÔN NGỮ
            </div>
            <h1 style={{ 
              fontSize: '56px', fontWeight: '900', marginBottom: '20px',
              background: 'linear-gradient(to right, #4338ca, #7e22ce)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              Ngữ Pháp Toàn Diện
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', fontSize: '20px', maxWidth: '700px', lineHeight: '1.6',
              margin: '0 auto'
            }}>
              Khám phá các cấu trúc ngữ pháp từ cơ bản đến nâng cao. Mỗi bài học được thiết kế trực quan, sinh động giúp bạn dễ dàng áp dụng vào thực tế.
            </p>
          </motion.div>
        </header>

        <div className="flex gap-10 items-start flex-col lg:flex-row">
          {/* Glassmorphism Sidebar */}
          <aside style={{ flex: '0 0 340px', width: '100%' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ 
                padding: '32px', position: 'sticky', top: '100px', 
                display: 'flex', flexDirection: 'column', gap: '28px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="flex items-center gap-3" style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                  <Filter size={20} className="text-primary" />
                </div>
                Khám Phá
              </div>

              {/* Modern Search */}
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm cấu trúc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '16px 20px 16px 48px',
                    borderRadius: '16px', border: '2px solid transparent',
                    background: '#f8fafc', outline: 'none', fontSize: '15px',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </div>

              {/* Level Filter Tabs */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Lộ trình học</label>
                <div className="flex flex-col gap-3">
                  {levels.map((level, idx) => {
                    const isActive = selectedLevel === level.name;
                    return (
                      <motion.button
                        key={level._id}
                        whileHover={{ scale: isActive ? 1 : 1.02, x: isActive ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLevel(level.name)}
                        style={{
                          padding: '16px 20px',
                          borderRadius: '16px',
                          border: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                          background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))' : '#f8fafc',
                          color: isActive ? 'var(--primary)' : '#475569',
                          textAlign: 'left',
                          fontWeight: isActive ? '800' : '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          boxShadow: isActive ? '0 10px 20px rgba(99, 102, 241, 0.1)' : 'none'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '10px', 
                            background: isActive ? 'white' : '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isActive ? 'var(--primary)' : '#94a3b8',
                            fontWeight: '800', fontSize: '14px',
                            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                          }}>
                            {idx + 1}
                          </div>
                          <span style={{ fontSize: '16px' }}>{level.name}</span>
                        </div>
                        {isActive && <ChevronRight size={20} />}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Grammar Main Content */}
          <main style={{ flex: 1, width: '100%' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedLevel ? (
                  <>
                    Level <span style={{ color: 'var(--primary)' }}>{selectedLevel}</span>
                  </>
                ) : 'Tất cả chủ điểm'}
                <div style={{ 
                  background: '#f1f5f9', color: '#64748b', fontSize: '14px', fontWeight: '700', 
                  padding: '6px 12px', borderRadius: '100px', display: 'inline-block'
                }}>
                  {filteredGrammars.length} Bài học
                </div>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGrammars.map((grammar, index) => (
                  <motion.div
                    layout
                    key={grammar._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
                  >
                    <div
                      className="card"
                      onClick={() => navigate(`/grammar/${grammar._id}`)}
                      style={{
                        padding: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        background: 'white',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '24px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(99, 102, 241, 0.12)';
                        e.currentTarget.style.borderColor = 'var(--primary-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                      }}
                    >
                      {/* Decorative gradient corner */}
                      <div style={{
                        position: 'absolute', top: '-50px', right: '-50px', width: '100px', height: '100px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }} />

                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div style={{ 
                            background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)', color: 'var(--primary)', 
                            padding: '16px', borderRadius: '16px',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)'
                          }}>
                            <BookOpen size={28} />
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>
                              Chủ điểm Nổi Bật
                            </span>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{grammar.title}</h3>
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        color: '#475569', fontSize: '16px', lineHeight: '1.7', 
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        paddingRight: '20px'
                      }}>
                        {grammar.description}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-6" style={{ borderTop: '1px solid #f1f5f9' }}>
                        <div className="flex gap-4">
                          <span style={{ 
                            fontSize: '14px', fontWeight: '600', color: '#64748b',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: '#f8fafc', padding: '6px 12px', borderRadius: '100px'
                          }}>
                            <GraduationCap size={16} /> Level {grammar.level}
                          </span>
                          {grammar.examples && grammar.examples.length > 0 && (
                            <span style={{ 
                              fontSize: '14px', fontWeight: '600', color: '#64748b',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: '#f8fafc', padding: '6px 12px', borderRadius: '100px'
                            }}>
                              <Sparkles size={16} /> {grammar.examples.length} ví dụ
                            </span>
                          )}
                        </div>
                        
                        <div style={{ 
                          color: 'var(--primary)', fontWeight: '700', fontSize: '15px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: 'white', padding: '8px 16px', borderRadius: '100px',
                          border: '2px solid rgba(99, 102, 241, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                          Học ngay <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!loading && filteredGrammars.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    padding: '80px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.5)', 
                    borderRadius: '32px', border: '2px dashed #e2e8f0', backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ 
                    width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  }}>
                    <BookOpen size={40} color="#94a3b8" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>Chưa có bài học nào</h3>
                  <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '400px', margin: '0 auto' }}>
                    Hiện tại chưa có bài giảng ngữ pháp nào phù hợp với bộ lọc của bạn. Vui lòng quay lại sau!
                  </p>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
};

export default GrammarPage;
