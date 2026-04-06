import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BookOpen, Users, Zap, Globe, MessageSquare, 
  Play, Sparkles, Trophy, Star, Clock, ChevronRight, Layout, Flame, Award
} from "lucide-react";
import AppShell from "../components/AppShell";
import { getUser } from "../utils/auth";
import { api } from "../api/client";
import Logo from "../components/Logo";

const HomePage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [progress, setProgress] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Vocabulary rotation state
  const suggestedVocabs = [
    { word: "Astonishing", meaning: "Đáng ngạc nhiên", type: "adj", example: "Her performance was astonishing." },
    { word: "Perseverance", meaning: "Sự kiên trì", type: "n", example: "His perseverance finally paid off." },
    { word: "Meticulous", meaning: "Tỉ mỉ, cẩn thận", type: "adj", example: "He is very meticulous about his work." },
    { word: "Ubiquitous", meaning: "Có mặt khắp nơi", type: "adj", example: "Smartphones have become ubiquitous." },
    { word: "Enthusiastic", meaning: "Nhiệt tình", type: "adj", example: "She is enthusiastic about learning English." }
  ];
  const [currentVocabIdx, setCurrentVocabIdx] = useState(0);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVocabIdx(prev => (prev + 1) % suggestedVocabs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const [progRes, statsRes] = await Promise.all([
        api.get("/progress/me"),
        api.get("/statistics/me")
      ]);
      setProgress(progRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post("/statistics/check-in");
      await loadProgress();
      alert("Điểm danh thành công! Đã tăng Streak 🔥. Cùng giữ vững phong độ nào!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Hôm nay bạn đã điểm danh rồi!");
    }
  };

  const getXPProgress = (xp: number) => {
    const thresholds = [
      { level: "A1", min: 0, next: 1000 },
      { level: "A2", min: 1000, next: 3000 },
      { level: "B1", min: 3000, next: 5000 },
      { level: "B2", min: 5000, next: 7000 },
      { level: "C1", min: 7000, next: 10000 },
      { level: "C2", min: 10000, next: 25000 },
    ];
    
    const current = thresholds.find(t => xp < t.next) || thresholds[thresholds.length - 1];
    const progressPerc = ((xp - current.min) / (current.next - current.min)) * 100;
    return {
      currentLevel: current.level,
      nextLevel: thresholds[thresholds.indexOf(current) + 1]?.level || "MAX",
      percentage: Math.min(Math.max(progressPerc, 0), 100),
      currentLevelMin: current.min,
      currentLevelNext: current.next
    };
  };

  const journeySteps = [
    { id: "01", title: "Khởi Đầu", desc: "Làm quen với những từ vựng cơ bản nhất.", color: "var(--pink)" },
    { id: "02", title: "Tự Tin", desc: "Ghép câu và bắt đầu hội thoại ngắn.", color: "var(--yellow)" },
    { id: "03", title: "Tăng Tốc", desc: "Nghe hiểu phim ảnh và âm nhạc.", color: "var(--green)" },
    { id: "04", title: "Bứt Phá", desc: "Tranh luận và thuyết trình tự tin.", color: "var(--primary)" },
    { id: "05", title: "Chuyên Gia", desc: "Sử dụng Tiếng Anh như tiếng mẹ đẻ.", color: "var(--indigo)" },
  ];

  if (user) {
    const grammarLearned = stats?.grammarLearnedCount || 0;
    const totalVocab = stats?.vocabLearnedCount || 0;
    const speakingPracticeCount = stats?.speakingPracticeCount || 0;
    
    const xpProg = stats ? getXPProgress(stats.currentPoints) : null;

    return (
      <AppShell>
        <div className="container" style={{ padding: '40px 0' }}>
          {/* Welcome Dashboard Header */}
          <header style={{ marginBottom: '40px', background: 'var(--white)', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(50px)' }}></div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-between flex-wrap gap-6"
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div className="flex items-center gap-4 mb-2">
                  <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>
                    Chào mừng trở lại, {user.name}! 🌟
                  </h1>
                  <span className="badge badge-primary">{stats?.currentLevel || user.level}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px' }}>
                  Hôm nay là một ngày tuyệt vời để nâng cao trình độ Tiếng Anh của bạn.
                </p>
                
                {/* Check-in & Streak */}
                <div className="flex items-center gap-4 flex-wrap">
                   <button 
                     onClick={handleCheckIn}
                     className="btn"
                     style={{ 
                       background: 'linear-gradient(135deg, #FF9966, #FF5E62)', 
                       color: 'white', border: 'none', borderRadius: '100px', 
                       padding: '12px 24px', fontSize: '15px', fontWeight: '800',
                       display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(255, 94, 98, 0.3)'
                     }}
                   >
                     <Flame size={20} />
                     Điểm Danh Nhận Streak
                   </button>
                   <div className="flex items-center gap-2" style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '100px', border: '1px solid var(--border)' }}>
                     <Flame size={20} color="#FF9966" />
                     <span style={{ fontWeight: '800', fontSize: '15px' }}>{stats?.learningStreak || 0} Ngày</span>
                     <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>liên tục</span>
                   </div>
                </div>
              </div>
              
              {/* Level Progress Bar Horizontal */}
              {xpProg && (
                <div style={{ flex: '0 0 350px', background: 'var(--bg)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={20} color="var(--primary)" /> Điểm kinh nghiệm
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '20px' }}>{stats.currentPoints.toLocaleString()} <span style={{ fontSize: '12px' }}>XP</span></span>
                  </div>
                  
                  <div style={{ width: '100%', height: '12px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '12px' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProg.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #8B5CF6)', borderRadius: '100px' }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <span>{xpProg.currentLevel} ({xpProg.currentLevelMin})</span>
                    <span>{xpProg.nextLevel} ({xpProg.currentLevelNext})</span>
                  </div>
                </div>
              )}
            </motion.div>
          </header>

          <div className="flex gap-6 flex-col lg:flex-row mb-10">
            {/* Statistics Grid */}
            <div className="grid" style={{ flex: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card" 
                style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '24px' }}
              >
                <div className="pastel-icon-box pastel-box-primary">
                  <Trophy size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Ngữ Pháp Đã Học</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)' }}>{grammarLearned}</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card" 
                style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '24px' }}
              >
                <div className="pastel-icon-box pastel-box-green">
                  <BookOpen size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Từ Vựng Đã Học</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)' }}>{totalVocab}</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card" 
                style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '24px' }}
              >
                <div className="pastel-icon-box pastel-box-yellow">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Đã Luyện Nói</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)' }}>{speakingPracticeCount} <span style={{fontSize: '14px', fontWeight: '600'}}>bài</span></div>
                </div>
              </motion.div>
            </div>

            {/* Vocab Suggester Widget */}
            <div style={{ flex: 1 }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{ height: '100%', padding: '24px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', borderRadius: '24px' }}
              >
                 <div style={{ position: 'absolute', top: '-30px', right: '-30px', opacity: 0.2 }}>
                   <Sparkles size={120} />
                 </div>
                 <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} /> Gợi Ý Từ Vựng Hôm Nay
                 </div>
                 
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={currentVocabIdx}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.4 }}
                   >
                     <h3 style={{ fontSize: '32px', fontWeight: '900', margin: 0, lineHeight: '1.2' }}>{suggestedVocabs[currentVocabIdx].word}</h3>
                     <span style={{ display: 'inline-block', margin: '8px 0 16px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
                       {suggestedVocabs[currentVocabIdx].type}
                     </span>
                     <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{suggestedVocabs[currentVocabIdx].meaning}</p>
                     <p style={{ fontSize: '14px', opacity: 0.9, fontStyle: 'italic' }}>"{suggestedVocabs[currentVocabIdx].example}"</p>
                   </motion.div>
                 </AnimatePresence>
                 
                 <div className="flex gap-2" style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
                   {suggestedVocabs.map((_, i) => (
                     <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentVocabIdx ? 'white' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s' }} />
                   ))}
                 </div>
              </motion.div>
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Main Content Area */}
            <div style={{ flex: 2 }}>
              <div className="flex items-center justify-between mb-6">
                 <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Vào bài học ngay thôi!</h2>
                 <button onClick={() => navigate("/vocabulary")} className="btn btn-ghost" style={{ fontSize: '13px' }}>
                    Tất cả bài học <ArrowRight size={14} />
                 </button>
              </div>
              
              <div className="flex flex-col gap-6">
                {/* Featured Soft Gradient Course Card */}
                <div className="featured-course-card">
                  <div>
                    <span className="featured-card-badge">BÀI HỌC TIẾP THEO</span>
                    <h3 style={{ fontSize: '26px', marginBottom: '8px', fontWeight: '800' }}>Giao tiếp hàng ngày</h3>
                    <p style={{ opacity: 0.8, fontSize: '15px', fontWeight: '500' }}>Tham gia khoá luyện nói hội thoại siêu tốc cùng AI!</p>
                  </div>
                  <button onClick={() => navigate("/speaking")} className="btn btn-soft-gradient" style={{ borderRadius: '100px', padding: '14px 28px', fontSize: '15px' }}>
                    Chiến ngay <ChevronRight size={18} />
                  </button>
                </div>

                <div className="flex gap-6">
                  <div className="card" onClick={() => navigate("/listening")} style={{ flex: 1, padding: '24px', cursor: 'pointer', borderRadius: '24px' }}>
                    <div className="pastel-icon-box pastel-box-indigo" style={{ width: '56px', height: '56px', marginBottom: '16px' }}>
                      <Globe size={28} />
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Luyện nghe</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Cải thiện kỹ năng nghe mỗi ngày.</p>
                  </div>
                  <div className="card" onClick={() => navigate("/speaking")} style={{ flex: 1, padding: '24px', cursor: 'pointer', borderRadius: '24px' }}>
                    <div className="pastel-icon-box pastel-box-pink" style={{ width: '56px', height: '56px', marginBottom: '16px' }}>
                      <MessageSquare size={28} />
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Luyện nói</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Giao tiếp mượt mà cùng AI Mentor.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Area */}
            <div style={{ flex: 1 }}>
              <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Hoạt động gần đây</h3>
                <div className="flex flex-col gap-4">
                  {progress?.quizResults?.slice(0, 4).map((res: any, i: number) => (
                    <div key={i} className="flex items-center gap-4" style={{ padding: '12px', background: 'var(--bg)', borderRadius: '16px' }}>
                      <div className={`pastel-icon-box ${res.passed ? 'pastel-box-green' : 'pastel-box-pink'}`} style={{ width: '40px', height: '40px', padding: 0 }}>
                        {res.passed ? <Trophy size={18} /> : <Clock size={18} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{res.passed ? "Vượt qua" : "Thử lại"} Quiz</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(res.takenAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontWeight: '800', fontSize: '16px', color: res.passed ? 'var(--green)' : 'var(--pink)' }}>
                        {Math.round(res.percentage)}%
                      </div>
                    </div>
                  ))}
                  {(!progress?.quizResults || progress.quizResults.length === 0) && (
                    <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg)', borderRadius: '16px' }}>
                      <Layout size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>Chưa có hoạt động nào.</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Hãy bắt đầu làm Quiz ngay!</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate("/progress")}
                  className="btn btn-soft-gradient" 
                  style={{ width: '100%', marginTop: '24px', borderRadius: '100px', fontSize: '14px' }}
                >
                  Xem tất cả tiến độ
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero-section container" style={{ 
          background: 'var(--primary-light)',
          borderRadius: '40px',
          marginTop: '10px',
          padding: '80px 40px'
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-content"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge mb-4" 
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--yellow)', border: 'none', padding: '8px 16px', fontSize: '13px' }}
            >
              ✨ HỌC MÀ CHƠI, CHƠI MÀ HỌC
            </motion.span>
            <h1 className="hero-title" style={{ fontSize: '56px', lineHeight: '1.1', fontWeight: '900' }}>
              Học Tiếng Anh <br />
              <span style={{ 
                color: 'var(--primary)',
                display: 'inline-block'
              }}>Siêu Vui Nhộn</span>, <br />
              Khai Phá Thế Giới!
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '18px', marginTop: '20px' }}>
              Trải nghiệm phương pháp học hiện đại, tương tác 1-1 <br />
              cùng cộng đồng học viên toàn cầu. <br />
              Bắt đầu hành trình của bạn ngay hôm nay!
            </p>
            <div className="flex gap-3 mt-8">
              <button 
                className="btn btn-soft-gradient" 
                onClick={() => navigate("/register")}
                style={{ padding: '14px 28px', fontSize: '16px', fontWeight: 'bold' }}
              >
                BẮT ĐẦU MIỄN PHÍ
              </button>
              <button className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: '16px', border: '1px solid var(--border)' }}>
                TÌM HIỂU THÊM
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image"
            style={{ position: 'relative' }}
          >
            <div style={{ 
              background: 'var(--white)', 
              backdropFilter: 'blur(20px)',
              padding: '16px', 
              borderRadius: '28px', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              border: '1px solid var(--border)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" 
                alt="Students" 
                style={{ borderRadius: '16px', width: '100%', display: 'block' }}
              />
            </div>
            
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ 
                position: 'absolute', top: '10%', left: '-40px', 
                background: 'var(--white)', padding: '12px 20px', borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '12px',
                zIndex: 2
              }}
            >
               <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px' }}>
                  <MessageSquare size={20} color="#b45309" />
               </div>
               <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>GIAO TIẾP</div>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>1-on-1 AI Mentor</div>
               </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              style={{ 
                position: 'absolute', bottom: '15%', right: '-20px', 
                background: 'var(--white)', padding: '12px 20px', borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '12px',
                zIndex: 2
              }}
            >
               <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '10px' }}>
                  <Zap size={20} color="#2563eb" />
               </div>
               <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>TIẾN ĐỘ</div>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>Mở khóa +200 Từ vựng</div>
               </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Journey Section */}
        <section className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', letterSpacing: '2px' }}>LỘ TRÌNH HỌC TẬP</span>
            <h2 style={{ fontSize: '42px', margin: '12px 0 20px', fontWeight: '800' }}>Hành Trình Chinh Phục</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '64px', fontSize: '16px' }}>5 bước đơn giản giúp bạn làm chủ Tiếng Anh từ con số 0</p>
          </motion.div>
          
          <div className="flex justify-between gap-5 overflow-x-auto pb-8" style={{ padding: '0 8px' }}>
            {journeySteps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card" 
                style={{ 
                  flex: 1, minWidth: '220px', textAlign: 'left', padding: '28px',
                  background: 'var(--white)', border: '1px solid var(--border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '14px', 
                  background: step.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '20px', marginBottom: '20px',
                  boxShadow: `0 10px 20px ${step.color}33`
                }}>
                  {step.id}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '700' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="container" style={{ paddingBottom: '100px' }}>
          <div style={{ 
            background: 'var(--white)', 
            borderRadius: '40px', padding: '80px 32px', textAlign: 'center', color: 'var(--text)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '240px', height: '240px', background: 'var(--primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '240px', height: '240px', background: 'var(--indigo)', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 style={{ color: 'var(--text)', fontSize: '42px', marginBottom: '20px', fontWeight: '800' }}>Sẵn Sàng Thay Đổi Bản Thân?</h2>
              <p style={{ opacity: 0.8, marginBottom: '40px', maxWidth: '640px', margin: '0 auto 40px', fontSize: '17px', lineHeight: '1.5' }}>
                Tham gia cùng hơn 50,000 học viên khác. Nhận ngay bộ tài liệu "Giao tiếp tự tin trong 30 ngày" miễn phí khi đăng ký!
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <input 
                  className="input" 
                  placeholder="Địa chỉ email của bạn..." 
                  style={{ 
                    maxWidth: '320px', 
                    height: '56px',
                    background: 'var(--bg)', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text)',
                    padding: '0 20px',
                    fontSize: '15px'
                  }}
                />
                <button className="btn btn-soft-gradient" style={{ height: '56px', padding: '0 32px', fontWeight: '700' }}>
                  NHẬN TÀI LIỆU
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container" style={{ padding: '60px 0', borderTop: '1px solid var(--border)' }}>
          <div className="flex justify-between items-start flex-wrap gap-10">
            <div style={{ maxWidth: '280px' }}>
              <div className="brand" style={{ marginBottom: '16px' }}>
                <Logo size={46} showText={true} />
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '14px' }}>
                Nền tảng học tiếng Anh hiện đại, kết hợp phương pháp game hóa và trí tuệ nhân tạo.
              </p>
            </div>
            <div className="flex gap-12 flex-wrap">
              <div className="flex flex-col gap-3">
                <span style={{ fontWeight: '700', fontSize: '15px' }}>Học Tập</span>
                <a href="/vocabulary" className="nav-link" style={{ fontSize: '14px' }}>Từ vựng</a>
                <a href="/grammar" className="nav-link" style={{ fontSize: '14px' }}>Ngữ pháp</a>
                <a href="/quiz" className="nav-link" style={{ fontSize: '14px' }}>Kiểm tra</a>
              </div>
              <div className="flex flex-col gap-3">
                <span style={{ fontWeight: '700', fontSize: '15px' }}>Kỹ Năng</span>
                <a href="/listening" className="nav-link" style={{ fontSize: '14px' }}>Luyện nghe</a>
                <a href="/speaking" className="nav-link" style={{ fontSize: '14px' }}>Luyện nói</a>
                <a href="/progress" className="nav-link" style={{ fontSize: '14px' }}>Tiến độ</a>
              </div>
              <div className="flex flex-col gap-3">
                <span style={{ fontWeight: '700', fontSize: '15px' }}>Công Ty</span>
                <a href="#" className="nav-link" style={{ fontSize: '14px' }}>Về chúng tôi</a>
                <a href="#" className="nav-link" style={{ fontSize: '14px' }}>Điều khoản</a>
                <a href="#" className="nav-link" style={{ fontSize: '14px' }}>Liên hệ</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 DONEENGLISH — MAKE ENGLISH FUN AGAIN. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </div>
    </AppShell>
  );
};

export default HomePage;
