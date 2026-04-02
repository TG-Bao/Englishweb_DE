import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { BookOpen, Trophy, ArrowRight, Star, CheckCircle, Clock } from "lucide-react";

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
          background: 'var(--bg)',
          paddingBottom: '120px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background blobs - reduced opacity for dark mode compatibility */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-50px', width: '300px', height: '300px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <motion.header 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '80px', textAlign: 'center' }}
          >
            <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--white)',
                color: '#0ea5e9', 
                padding: '10px 20px', 
                borderRadius: '99px', 
                fontSize: '13px', 
                fontWeight: '800',
                marginBottom: '24px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--border)'
              }}
            >
              <Trophy size={16} fill="#0ea5e9" />
              CHINH PHỤC CÁC CẤP ĐỘ
            </motion.div>
            <h1 style={{ 
              fontSize: '56px', 
              fontWeight: '950', 
              color: 'var(--text)', 
              marginBottom: '24px',
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}>
              Hệ thống <span style={{ 
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Kiểm tra</span>
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
              Đo lường sự tiến bộ của bạn qua các bài kiểm tra chuẩn hóa được thiết kế riêng cho từng cấp độ.
            </p>
          </motion.header>

          {levels.map((level, lIdx) => {
            const levelTests = tests.filter(t => t.level === level);
            if (levelTests.length === 0) return null;

            return (
              <section key={level} style={{ marginBottom: '100px' }}>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}
                >
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(14, 165, 233, 0.25)',
                    fontSize: '24px',
                    fontWeight: '900',
                    color: 'white'
                  }}>
                    {level}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                      Trình độ {level}
                    </h2>
                    <div style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
                      {levelTests.length} bài thi đang sẵn sàng
                    </div>
                  </div>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)', opacity: 0.5, marginLeft: '40px' }}></div>
                </motion.div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px' 
                }}>
                  {levelTests.map((test, tIdx) => (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: tIdx * 0.05 }}
                      whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                      style={{
                        background: 'var(--white)',
                        borderRadius: '32px',
                        padding: '32px 48px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '40px',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                          <span style={{ 
                            background: 'var(--bg)', 
                            color: 'var(--text-muted)', 
                            padding: '6px 12px', 
                            borderRadius: '10px', 
                            fontSize: '11px', 
                            fontWeight: '800'
                          }}>
                            #{test._id.slice(-4).toUpperCase()}
                          </span>
                          {(test as any).completed && (
                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '900' }}>
                              <CheckCircle size={14} strokeWidth={3} /> ĐÃ HOÀN THÀNH
                            </div>
                          )}
                          <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'var(--border)' }} />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
                              <BookOpen size={14} color="#0ea5e9" />
                              {test.questions?.length || 0} câu
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
                              <Clock size={14} color="#6366f1" />
                              {test.timeLimit || 20}'
                            </div>
                          </div>
                        </div>
                        
                        <h3 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2 }}>
                          {test.title}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.5, fontWeight: '500', maxWidth: '800px' }}>
                          {test.description}
                        </p>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        <button
                          onClick={() => !(test as any).completed && navigate(`/take-test/${test._id}`)}
                          className={(test as any).completed ? "" : "btn-soft-gradient"}
                          style={{
                            width: '200px',
                            padding: '20px 24px',
                            borderRadius: '24px',
                            fontWeight: '900',
                            fontSize: '17px',
                            cursor: (test as any).completed ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            border: 'none',
                            background: (test as any).completed ? 'var(--border)' : undefined,
                            color: (test as any).completed ? 'var(--text-muted)' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          {(test as any).completed ? "Hoàn thành" : "Bắt đầu thi"} 
                          {!(test as any).completed && <ArrowRight size={20} />}
                        </button>
                      </div>
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
