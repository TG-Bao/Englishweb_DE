import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { Play, Award, Filter, Volume2 } from "lucide-react";
import { levelService, LevelItem } from "../services/LevelService";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  image: string;
  level_id: string;
  order: number;
  isPublished: boolean;
};

const SpeakingPage = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonsRes, levelsRes] = await Promise.all([
        api.get("/lessons"),
        levelService.getPublished()
      ]);
      setLessons(lessonsRes.data.data);
      setLevels(levelsRes);

      // Mặc định chọn level của user nếu có
      if (user?.level) {
        const userLevel = levelsRes.find(l => l.name === user.level);
        if (userLevel) setSelectedLevelId(userLevel._id);
      }
    } catch (err) {
      console.error("Failed to load speaking data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lọc bài học theo level
  const filteredLessons = selectedLevelId 
    ? lessons.filter(l => l.level_id === selectedLevelId)
    : lessons;

  const featuredLesson = filteredLessons.length > 0 ? filteredLessons[0] : null;
  const remainingLessons = filteredLessons.slice(1);

  const playAudio = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
  };

  const getLevelName = (levelId: string) => {
    return levels.find(l => l._id === levelId)?.name || "Level";
  };

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text)' }}>
              Speaking & Listening
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: 0 }}>
              Cải thiện kỹ năng giao tiếp tiếng Anh qua các bài học tương tác.
            </p>
          </motion.div>
          

        </header>

        {/* Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>Lọc theo cấp độ:</span>
          <select
            value={selectedLevelId}
            onChange={(e) => setSelectedLevelId(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '99px',
              border: '1.5px solid var(--border)',
              background: 'var(--white)',
              outline: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <option value="">Tất cả bài học</option>
            {levels.map(level => (
              <option key={level._id} value={level._id}>{level.name} - {level.description}</option>
            ))}
          </select>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải bài học...</div>
        ) : filteredLessons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--white)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Chưa có bài học nào cho cấp độ này.</h3>
          </div>
        ) : (
          <>
            {/* Featured Lesson */}
            {featuredLesson && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  background: 'var(--white)', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'row',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  marginBottom: '40px',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: '1 1 400px', background: '#d1fae5', position: 'relative', minHeight: '300px' }}>
                  <img 
                    src={featuredLesson.image} 
                    alt={featuredLesson.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                  />
                  <div style={{ 
                    position: 'absolute', top: '20px', left: '20px', 
                    background: 'var(--primary)', color: 'white', 
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' 
                  }}>
                    ĐANG HỌC
                  </div>
                </div>
                
                <div style={{ flex: '1 1 400px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      CẤP ĐỘ {getLevelName(featuredLesson.level_id)}
                    </span>
                    <span style={{ width: '4px', height: '4px', background: 'var(--border)', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      KỸ NĂNG GIAO TIẾP
                    </span>
                  </div>
                  
                  <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
                    {featuredLesson.title}
                  </h2>
                  <p style={{ color: 'var(--secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                    {featuredLesson.description}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={() => navigate(`/practice/${featuredLesson._id}`)}
                      className="btn btn-primary" 
                      style={{ padding: '14px 28px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      Tiếp tục học <Play size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid Lessons */}
            {remainingLessons.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '32px' 
              }}>
                {remainingLessons.map((lesson, idx) => (
                  <motion.div
                    key={lesson._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    style={{
                      background: 'var(--white)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.06)' }}
                    onClick={() => navigate(`/practice/${lesson._id}`)}
                  >
                    <div style={{ height: '200px', background: '#e2e8f0', position: 'relative' }}>
                      <img 
                        src={lesson.image} 
                        alt={lesson.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ 
                          fontSize: '11px', fontWeight: '800', 
                          color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' 
                        }}>
                          CẤP ĐỘ {getLevelName(lesson.level_id)}
                        </span>
                      </div>
                      
                      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', lineHeight: 1.3 }}>
                        {lesson.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                        {lesson.description?.substring(0, 100)}{lesson.description && lesson.description.length > 100 ? '...' : ''}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Bắt đầu &rarr;
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default SpeakingPage;
