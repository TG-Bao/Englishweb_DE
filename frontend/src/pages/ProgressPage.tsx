import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, BookOpen, Target, BarChart3, Star, Zap, Crown, Award, ChevronUp } from "lucide-react";

interface UserStats {
  user: {
    name: string;
    level: string;
    totalXP: number;
    avatarUrl?: string;
  };
  stats: {
    completedTopics: number;
    totalVocab: number;
    testsTaken: number;
  };
}

interface LeaderboardItem {
  name: string;
  avatarUrl?: string;
  level: string;
  xp: number;
}

const ProgressPage = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser();
        if (user) {
          const [statsRes, leadRes] = await Promise.all([
            api.get(`/statistics/user/${user.id}`),
            api.get("/statistics/leaderboard")
          ]);
          setStats(statsRes.data.data);
          setLeaderboard(leadRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch progress data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getXPProgress = (xp: number) => {
    const thresholds = [
      { level: "A1", min: 0, next: 1000 },
      { level: "A2", min: 1001, next: 3000 },
      { level: "B1", min: 3001, next: 5000 },
      { level: "B2", min: 5001, next: 7000 },
      { level: "C1", min: 7001, next: 10000 },
      { level: "C2", min: 10001, next: 25000 },
    ];
    
    // Find the level where XP is between min and next
    const current = thresholds.find(t => xp < t.next) || thresholds[thresholds.length - 1];
    const progress = ((xp - (current.min)) / (current.next - current.min)) * 100;
    return {
      currentLevel: current.level,
      nextLevel: thresholds[thresholds.indexOf(current) + 1]?.level || "MAX",
      percentage: Math.min(Math.max(progress, 0), 100),
      remaining: Math.max(current.next - xp, 0)
    };
  };

  if (loading || !stats) {
    return (
      <AppShell>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải tiến trình của bạn...</div>
      </AppShell>
    );
  }

  const xpProgress = getXPProgress(stats.user.totalXP);

  return (
    <AppShell>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Hero Section with Level Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', marginBottom: '40px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                background: 'white', padding: '48px', borderRadius: '40px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ 
                  width: '80px', height: '80px', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                  borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '32px', fontWeight: '950', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)'
                }}>
                  {stats.user.level}
                </div>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    Chào {stats.user.name.split(' ')[0]}! 👋
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>
                    Bạn đã tích lũy được <strong>{stats.user.totalXP} XP</strong> và đang ở trình độ <strong>{stats.user.level}</strong>.
                  </p>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '28px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tiến độ lên {xpProgress.nextLevel}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0ea5e9' }}>
                    {xpProgress.remaining} XP nữa
                  </span>
                </div>
                <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #22c55e)' }} 
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                padding: '40px', borderRadius: '40px', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
              }}
            >
              <div style={{ 
                width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Crown size={32} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '850', marginBottom: '8px' }}>Mục tiêu tuần</h3>
              <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '24px', lineHeight: 1.5 }}>
                Hoàn thành thêm 2 bài kiểm tra trình độ để vươn lên vị trí cao hơn!
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Streak Hiện Tại</div>
                <div style={{ fontSize: '28px', fontWeight: '900' }}>🔥 12 Ngày</div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
            {[
              { label: "Chủ đề hoàn thành", value: stats.stats.completedTopics, color: "#f0f9ff", text: "#0369a1", icon: <Target size={24} /> },
              { label: "Từ vựng đã học", value: stats.stats.totalVocab, color: "#f0fdf4", text: "#15803d", icon: <BookOpen size={24} /> },
              { label: "Bài thi tổng hợp", value: stats.stats.testsTaken, color: "#fff7ed", text: "#c2410c", icon: <Zap size={24} /> }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                style={{ 
                  background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ 
                  width: '60px', height: '60px', background: s.color, color: s.text,
                  borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a' }}>{s.value}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8' }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
            {/* Achievement / History Section */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Award size={24} color="#0ea5e9" strokeWidth={3} />
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Thành tích của bạn</h2>
              </div>
              <div style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
                {/* Placeholder for more detailed progress, charts, etc */}
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>
                  Hệ thống đang tổng hợp dữ liệu chi tiết về kỹ năng Nghe/Nói của bạn.
                </p>
              </div>
            </div>

            {/* Leaderboard Section */}
            <aside>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Trophy size={24} color="#f59e0b" strokeWidth={3} />
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Bảng xếp hạng</h2>
              </div>
              <div style={{ 
                background: 'white', borderRadius: '32px', padding: '24px', 
                border: '1px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.02)',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                {leaderboard.map((item, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                      borderRadius: '20px', background: i === 0 ? '#fffbeb' : (i < 3 ? '#f8fafc' : 'transparent'),
                      border: i === 0 ? '1px solid #fef3c7' : 'none'
                    }}
                  >
                    <div style={{ 
                      width: '32px', fontSize: '18px', fontWeight: '950', 
                      color: i === 0 ? '#fbbf24' : (i < 3 ? '#94a3b8' : '#cbd5e1'), textAlign: 'center' 
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ 
                      width: '44px', height: '44px', background: '#e2e8f0', borderRadius: '12px',
                      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', color: '#475569'
                    }}>
                      {item.avatarUrl ? <img src={item.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>Trình độ {item.level}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '950', color: i === 0 ? '#f59e0b' : '#334155' }}>
                        {item.xp.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default ProgressPage;
