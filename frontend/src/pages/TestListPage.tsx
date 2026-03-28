import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { BookOpen, Trophy, ArrowRight, Star, CheckCircle } from "lucide-react";

interface Test {
  _id: string;
  title: string;
  description: string;
  level: string;
  questions: any[];
  timeLimit?: number;
}

const TestListPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const user = getUser();
        const res = await api.get("/tests", { params: { userId: user?.id } });
        setTests(res.data.data);
      } catch (err) {
        console.error("Failed to fetch tests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);


  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải danh sách bài thi...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>
            Bài Kiểm Tra Tổng Hợp
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Kiểm tra trình độ tiếng Anh của bạn qua các bài thi đa dạng và thăng cấp ngay hôm nay!
          </p>
        </header>

        {levels.map((level) => {
          const levelTests = tests.filter(t => t.level === level);
          if (levelTests.length === 0) return null;

          return (
            <section key={level} style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ 
                  background: '#0ea5e9', color: 'white', padding: '4px 12px', 
                  borderRadius: '8px', fontWeight: '800', fontSize: '20px' 
                }}>
                  {level}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#334155', margin: 0 }}>
                  Trình độ {level}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {levelTests.map((test) => (
                  <motion.div
                    key={test._id}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'white',
                      borderRadius: '24px',
                      padding: '32px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>
                            TEST #{test._id.slice(-4).toUpperCase()}
                          </div>
                          {(test as any).passed && (
                            <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle size={14} /> ĐÃ VƯỢT QUA
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        </div>
                      </div>
                      
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                        {test.title}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                        {test.description}
                      </p>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                          <BookOpen size={18} /> {test.questions.length} câu hỏi
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                          <Trophy size={18} /> {test.timeLimit || 20} phút
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/take-test/${test._id}`)}
                      style={{
                        background: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        padding: '14px 24px',
                        borderRadius: '16px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      Bắt đầu thi <ArrowRight size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
};

export default TestListPage;
