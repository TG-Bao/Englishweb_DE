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
      <div 
        style={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          paddingBottom: '100px'
        }}
      >
        <div className="container" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '64px', textAlign: 'center' }}
          >
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(14, 165, 233, 0.1)', 
              color: '#0ea5e9', 
              padding: '8px 16px', 
              borderRadius: '99px', 
              fontSize: '14px', 
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              <Star size={16} fill="#0ea5e9" />
              CHINH PHỤC CÁC CẤP ĐỘ
            </div>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '950', 
              color: '#0f172a', 
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Bài Kiểm Tra <span style={{ color: '#0ea5e9' }}>Tổng Hợp</span>
            </h1>
            <p style={{ fontSize: '19px', color: '#64748b', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Đánh giá năng lực sử dụng tiếng Anh của bạn thông qua hệ thống bài thi được thiết kế chuẩn quốc tế.
            </p>
          </motion.header>

          {levels.map((level, lIdx) => {
            const levelTests = tests.filter(t => t.level === level);
            if (levelTests.length === 0) return null;

            return (
              <section key={level} style={{ marginBottom: '80px' }}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: lIdx * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}
                >
                  <div style={{ 
                    width: '48px',
                    height: '48px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '20px',
                    fontWeight: '900',
                    color: '#0ea5e9',
                    border: '1px solid #f1f5f9'
                  }}>
                    {level}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: '850', color: '#1e293b', margin: 0 }}>
                      Trình độ {level}
                    </h2>
                    <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>
                      {levelTests.length} bài thi đang chờ bạn
                    </div>
                  </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '28px' }}>
                  {levelTests.map((test, tIdx) => (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: tIdx * 0.1 }}
                      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                      style={{
                        background: 'white',
                        borderRadius: '32px',
                        padding: '36px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Decorative background element */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '-20px', 
                        right: '-20px', 
                        width: '100px', 
                        height: '100px', 
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }} />

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ 
                              background: '#f0f9ff', 
                              color: '#0369a1', 
                              padding: '6px 14px', 
                              borderRadius: '99px', 
                              fontSize: '11px', 
                              fontWeight: '800',
                              letterSpacing: '0.05em'
                            }}>
                              ID: {test._id.slice(-4).toUpperCase()}
                            </div>
                            {(test as any).passed && (
                              <div style={{ 
                                background: '#f0fdf4', 
                                color: '#16a34a', 
                                padding: '6px 14px', 
                                borderRadius: '99px', 
                                fontSize: '11px', 
                                fontWeight: '800', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px' 
                              }}>
                                <CheckCircle size={14} /> ĐÃ ĐẠT
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3].map(i => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" style={{ opacity: 0.8 }} />)}
                          </div>
                        </div>
                        
                        <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '14px', lineHeight: 1.2 }}>
                          {test.title}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '15.5px', lineHeight: 1.65, marginBottom: '28px' }}>
                          {test.description}
                        </p>

                        <div style={{ 
                          display: 'flex', 
                          gap: '20px', 
                          marginBottom: '36px',
                          background: '#f8fafc',
                          padding: '16px',
                          borderRadius: '20px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                            <BookOpen size={18} color="#0ea5e9" /> {test.questions.length} câu
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                            <Trophy size={18} color="#f59e0b" /> {test.timeLimit || 20} phút
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => !(test as any).completed && navigate(`/take-test/${test._id}`)}
                        className={(test as any).completed ? "" : "btn-soft-gradient"}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          borderRadius: '20px',
                          fontWeight: '800',
                          fontSize: '17px',
                          cursor: (test as any).completed ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'all 0.35s ease',
                          border: 'none',
                          color: 'white',
                          background: (test as any).completed ? '#cbd5e1' : undefined,
                          boxShadow: (test as any).completed ? 'none' : '0 10px 20px rgba(14, 165, 233, 0.15)'
                        }}
                      >
                        {(test as any).completed ? "Đã hoàn thành" : "Bắt đầu ngay"} 
                        {!(test as any).completed && <ArrowRight size={22} />}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};

export default TestListPage;
