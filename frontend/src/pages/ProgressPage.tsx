import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { Trophy, BookOpen, Target, BarChart3, Calendar, ChevronRight, Zap } from "lucide-react";

type Progress = {
  lessonProgress: Array<{ lessonId: string; status: string; bestScore: number }>;
  topicProgress: Array<{ topicId: string; completedLessons: number; totalLessons: number; status: string }>;
  quizResults: Array<{ quizId: string; score: number; total: number; percentage: number; takenAt: string }>;
};

const ProgressPage = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/progress/me").then(res => {
      setProgress(res.data);
      setLoading(false);
    });
  }, []);

  const stats = [
    { 
      label: "Bài học hoàn thành", 
      value: progress ? progress.lessonProgress.filter(p => p.status === "COMPLETED").length : 0,
      icon: <BookOpen className="text-blue-500" />,
      color: "var(--primary-light)"
    },
    { 
      label: "Điểm trung bình", 
      value: progress && progress.quizResults.length > 0 
        ? Math.round(progress.quizResults.reduce((acc, curr) => acc + curr.percentage, 0) / progress.quizResults.length) + "%"
        : "0%",
      icon: <Trophy className="text-yellow-500" />,
      color: "#fef3c7"
    },
    { 
      label: "Bài kiểm tra đã làm", 
      value: progress ? progress.quizResults.length : 0,
      icon: <Zap className="text-indigo-500" />,
      color: "#e0e7ff"
    }
  ];

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 0' }}>
        {/* Header Section */}
        <header style={{ marginBottom: '48px' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge" style={{ marginBottom: '12px' }}>TỔNG QUAN HỌC TẬP</span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>Tiến Độ Của Bạn</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
              Theo dõi hành trình chinh phục Tiếng Anh và những cột mốc bạn đã đạt được.
            </p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', 
                background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-8 items-start flex-col lg:flex-row">
          {/* Main Content */}
          <div style={{ flex: 1, width: '100%' }}>
            {/* Topic Progress */}
            <section style={{ marginBottom: '48px' }}>
              <div className="flex items-center gap-2 mb-6">
                <Target size={24} className="text-primary" />
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Tiến độ theo chủ đề</h2>
              </div>
              <div className="grid gap-4">
                {progress?.topicProgress.map((tp, i) => (
                  <motion.div 
                    key={tp.topicId}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="card"
                    style={{ padding: '24px' }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span style={{ fontWeight: '700', fontSize: '18px' }}>Chủ đề #{i + 1}</span>
                      <span className="badge">{tp.completedLessons}/{tp.totalLessons} bài học</span>
                    </div>
                    <div style={{ height: '12px', background: 'var(--bg)', borderRadius: '6px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(tp.completedLessons / tp.totalLessons) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ height: '100%', background: 'var(--primary)', borderRadius: '6px' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quiz Performance Chart/List */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={24} className="text-primary" />
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Lịch sử kiểm tra</h2>
              </div>
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--bg)', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', fontWeight: '600' }}>Thời gian</th>
                      <th style={{ padding: '16px 24px', fontWeight: '600' }}>Kết quả</th>
                      <th style={{ padding: '16px 24px', fontWeight: '600' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress?.quizResults.slice().reverse().map((result, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={16} className="text-muted" />
                          {new Date(result.takenAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontWeight: '700' }}>{result.score}/{result.total}</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({result.percentage}%)</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span className="badge" style={{ 
                            background: result.percentage >= 70 ? '#dcfce7' : '#fee2e2',
                            color: result.percentage >= 70 ? '#166534' : '#991b1b'
                          }}>
                            {result.percentage >= 70 ? "Đạt" : "Chưa đạt"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {progress?.quizResults.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Chưa có lịch sử làm bài kiểm tra.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <aside style={{ flex: '0 0 320px', width: '100%' }}>
            <div className="card" style={{ padding: '24px', background: 'var(--secondary)', color: 'white' }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>Mục tiêu tuần này</h3>
              <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '24px' }}>
                Hoàn thành thêm 5 bài học và 2 bài kiểm tra để duy trì chuỗi học tập (streak)!
              </p>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Streak Hiện Tại</div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>🔥 3 Ngày</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

export default ProgressPage;
