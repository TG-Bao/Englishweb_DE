import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, BookOpen, Target, BarChart3, Calendar,
  ChevronRight, Zap, Flame, Award, Users, Star,
  CheckCircle2, TrendingUp, LayoutGrid
} from "lucide-react";

type Progress = {
  lessonProgress: Array<{ lessonId: string; status: string; bestScore: number }>;
  topicProgress: Array<{ topicId: string; completedLessons: number; totalLessons: number; status: string }>;
  quizResults: Array<{ quizId: string; quizTitle?: string; score: number; total: number; percentage: number; takenAt: string }>;
};

type UserStats = {
  completedTopicsCount: number;
  vocabLearnedCount: number;
  currentPoints: number;
  currentLevel: string;
  nextLevel?: string;
  xpProgressPercentage: number;
  learningStreak: number;
  badges: string[];
  rank: number;
};

type LeaderboardUser = {
  _id: string;
  name: string;
  points: number;
  avatarUrl?: string;
  level: string;
};

const CircularProgress = ({ percentage, size = 180 }: { percentage: number; size?: number }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth="12"
          fill="transparent"
          style={{ opacity: 0.3 }}
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--primary)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)' }}>{percentage}%</div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tiến độ</div>
      </div>
    </div>
  );
};

const ProgressPage = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'history'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/progress/me"),
          api.get("/statistics/me"),
          api.get("/statistics/leaderboard")
        ]);

        if (results[0].status === 'fulfilled') {
          setProgress(results[0].value.data.data);
        }
        if (results[1].status === 'fulfilled') {
          setStats(results[1].value.data.data);
        }
        if (results[2].status === 'fulfilled') {
          setLeaderboard(results[2].value.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Chủ đề hoàn thành",
      value: stats?.completedTopicsCount || 0,
      icon: <CheckCircle2 size={24} />,
      color: "pastel-box-green"
    },
    {
      label: "Từ vựng đã học",
      value: stats?.vocabLearnedCount || 0,
      icon: <BookOpen size={24} />,
      color: "pastel-box-primary"
    },
    {
      label: "Điểm hiện tại",
      value: stats?.currentPoints || 0,
      icon: <Star size={24} />,
      color: "pastel-box-yellow"
    },
    {
      label: "Chuỗi học thực tế",
      value: `${stats?.learningStreak || 0} Ngày`,
      icon: <Flame size={24} />,
      color: "pastel-box-pink"
    }
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Đang tải dữ liệu tiến độ...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        {/* Header Section */}
        <header style={{ marginBottom: '80px' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-end flex-wrap gap-6" style={{ marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '12px', color: 'var(--text)' }}>Trung tâm Điểm thưởng</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', lineHeight: '1.5' }}>
                  Chào mừng bạn trở lại! Hãy xem những nỗ lực tuyệt vời của bạn ngày hôm nay.
                </p>
              </div>
              <div className="flex gap-2" style={{ background: 'var(--white)', padding: '6px', borderRadius: '100px', border: '1px solid var(--border)' }}>
                {(['overview', 'leaderboard', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '8px 24px', fontSize: '14px', borderRadius: '99px' }}
                  >
                    {tab === 'overview' && <LayoutGrid size={16} />}
                    {tab === 'leaderboard' && <Users size={16} />}
                    {tab === 'history' && <BarChart3 size={16} />}
                    <span style={{ marginLeft: '8px' }}>
                      {tab === 'overview' ? "Tổng quan" : tab === 'leaderboard' ? "Xếp hạng" : "Lịch sử"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '64px' }}>
                {/* Level Progress Card */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '40px', gridColumn: 'span 2', padding: '2.5rem' }}>
                  <CircularProgress percentage={stats?.xpProgressPercentage || 0} />
                  <div style={{ flex: 1 }}>
                    <div className="featured-card-badge" style={{ marginBottom: '16px' }}>CẤP ĐỘ HIỆN TẠI</div>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--primary)', marginBottom: '8px' }}>
                      {stats?.currentLevel}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px', maxWidth: '440px' }}>
                      {stats?.nextLevel 
                        ? `Kiếm thêm ${(stats.currentPoints % 1000)} XP để mở khóa cấp độ ${stats.nextLevel}`
                        : "Bạn đã vượt qua mọi giới hạn! Tiếp tục duy trì phong độ nhé."}
                    </p>
                    <div className="flex gap-4">
                      <div style={{ padding: '12px 24px', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>TỔNG ĐIỂM</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.currentPoints.toLocaleString()}</div>
                      </div>
                      <div style={{ padding: '12px 24px', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>RANK TUẦN</div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>#{stats?.rank || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Streak Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginBottom: '20px' }}
                  >
                    <Flame size={64} fill="currentColor" />
                  </motion.div>
                  <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '8px' }}>Học tập chăm chỉ!</h3>
                  <div style={{ fontSize: '48px', fontWeight: '900' }}>{stats?.learningStreak} Ngày</div>
                  <p style={{ opacity: 0.9, fontSize: '16px', marginTop: '12px' }}>Duy trì chuỗi học để nhân đôi XP!</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '64px' }}>
                {statCards.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card"
                    style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
                  >
                    <div className={`pastel-icon-box ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</div>
                      <div style={{ fontSize: '28px', fontWeight: '800' }}>{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-8 items-start flex-col lg:flex-row">
                {/* Badge Cabinet */}
                <div style={{ flex: 1, width: '100%' }}>
                  <section className="card" style={{ marginBottom: '48px' }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Award size={28} className="text-primary" />
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Tủ Huy Hiệu</h2>
                      </div>
                      <span className="badge">{stats?.badges.length} đã đạt được</span>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                      {stats?.badges.map((badge, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          style={{
                            textAlign: 'center', padding: '20px', background: 'var(--bg)',
                            borderRadius: '24px', border: '1px solid var(--border)', cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '64px', height: '64px', margin: '0 auto 12px',
                            background: 'var(--secondary)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(90, 200, 250, 0.3)'
                          }}>
                            <Trophy color="white" size={32} />
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '800', lineHeight: '1.2' }}>{badge}</div>
                        </motion.div>
                      ))}
                      {(!stats?.badges || stats.badges.length === 0) && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          Bạn chưa đạt được huy hiệu nào. Hãy tiếp tục học tập nhé!
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* mini Leaderboard Sidebar */}
                <aside style={{ flex: '0 0 380px', width: '100%' }}>
                  <div className="card" style={{ padding: '32px' }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={24} className="text-secondary" />
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Bảng xếp hạng</h3>
                      </div>
                      <button onClick={() => setActiveTab('leaderboard')} className="btn btn-ghost" style={{ fontSize: '12px' }}>Tất cả <ChevronRight size={14} /></button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {leaderboard.slice(0, 5).map((user, i) => (
                        <div key={user._id} className="flex items-center gap-4" style={{ padding: '8px 0' }}>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: i < 3 ? 'var(--yellow)' : 'var(--text-muted)', width: '24px' }}>
                            {i + 1}
                          </span>
                          <div className="avatar" style={{
                            width: '44px', height: '44px', border: '2px solid var(--white)',
                            background: user.avatarUrl ? `url(${user.avatarUrl}) center/cover` : 'var(--primary)'
                          }}>
                            {!user.avatarUrl && user.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level {user.level}</div>
                          </div>
                          <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{user.points.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: '600' }}>XP</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card"
              style={{ padding: '0', overflow: 'hidden' }}
            >
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Vinh danh học viên xuất sắc</h2>
                <p style={{ color: 'var(--text-muted)' }}>Cùng nhau thi đua và tiến bộ mỗi ngày</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--bg)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '12px', fontWeight: '800' }}>
                    <tr>
                      <th style={{ padding: '20px 32px', textAlign: 'left' }}>Thứ hạng</th>
                      <th style={{ padding: '20px 32px', textAlign: 'left' }}>Học viên</th>
                      <th style={{ padding: '20px 32px', textAlign: 'center' }}>Cấp độ</th>
                      <th style={{ padding: '20px 32px', textAlign: 'right' }}>Tổng điểm (XP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, i) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '20px 32px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: i === 0 ? '#FEF3C7' : i === 1 ? '#F3F4F6' : i === 2 ? '#FFEDD5' : 'transparent',
                            color: i === 0 ? '#D97706' : i === 1 ? '#4B5563' : i === 2 ? '#C2410C' : 'var(--text-muted)',
                            fontWeight: '900', fontSize: '16px'
                          }}>
                            {i + 1}
                          </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                          <div className="flex items-center gap-4">
                            <div className="avatar" style={{
                              width: '48px', height: '48px',
                              background: user.avatarUrl ? `url(${user.avatarUrl}) center/cover` : 'var(--primary)'
                            }}>
                              {!user.avatarUrl && user.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: '700' }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                          <span className="badge">{user.level}</span>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right', fontWeight: '900', color: 'var(--primary)', fontSize: '18px' }}>
                          {user.points.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card"
              style={{ padding: '0', overflow: 'hidden' }}
            >
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Lịch sử kiểm tra</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '12px', fontWeight: '800' }}>
                  <tr>
                    <th style={{ padding: '20px 32px', textAlign: 'left' }}>Thời gian</th>
                    <th style={{ padding: '20px 32px', textAlign: 'left' }}>Bài kiểm tra</th>
                    <th style={{ padding: '20px 32px', textAlign: 'left' }}>Kết quả</th>
                    <th style={{ padding: '20px 32px', textAlign: 'center' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {progress?.quizResults.slice().reverse().map((result, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '20px 32px' }}>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted" />
                          {new Date(result.takenAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ fontWeight: '700' }}>{result.quizTitle || "Bài kiểm tra"}</div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ fontWeight: '800', fontSize: '16px' }}>{result.score}/{result.total}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({result.percentage}%)</span>
                      </td>
                      <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                        <span className={`badge ${result.percentage >= 70 ? 'badge-primary' : 'badge-ghost'}`}>
                          {result.percentage >= 70 ? "Vượt qua" : "Chưa đạt"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
};

export default ProgressPage;
