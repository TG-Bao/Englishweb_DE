import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getUser, updateUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Send, CheckCircle, Clock } from "lucide-react";

interface TestQuestion {
  id: string;
  question: string;
  type: "MCQ" | "FILL";
  options?: string[];
  correctAnswer: string;
}

interface Test {
  _id: string;
  title: string;
  questions: TestQuestion[];
  timeLimit?: number;
}

const TakeTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const user = getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const [testRes, resultsRes] = await Promise.all([
          api.get(`/tests/${id}`),
          api.get(`/tests?userId=${user.id}`)
        ]);

        const currentTest = testRes.data.data;
        const testStatus = resultsRes.data.data.find((t: any) => t._id === id);

        if (testStatus?.completed) {
          alert("Bạn đã hoàn thành bài thi này và không thể làm lại.");
          navigate("/tests");
          return;
        }

        setTest(currentTest);
        if (currentTest.timeLimit) setTimeLeft(currentTest.timeLimit * 60);
      } catch (err) {
        console.error("Failed to load test", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id, navigate]);

  useEffect(() => {
    if (result || !test) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, result]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    if (!test) return;
    const currentQuestionId = test.questions[currentIndex].id;
    setAnswers(prev => [
      ...prev.filter(a => a.questionId !== currentQuestionId),
      { questionId: currentQuestionId, answer }
    ]);
  };

  const currentAnswer = answers.find(a => a.questionId === test?.questions[currentIndex].id)?.answer || "";

  const handleSubmit = async () => {
    if (!test || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const user = getUser();
      if (!user) { navigate("/login"); return; }
      const res = await api.post(`/tests/${test._id}/submit`, {
        userId: user.id,
        answers: answers
      });
      const resultData = res.data.data;
      setResult(resultData);
      if (resultData.newLevel) {
        updateUser({ 
          level: resultData.newLevel, 
          points: resultData.newTotalXP 
        });
      }
    } catch (err) {
      console.error("Submission failed", err);
      alert("Lỗi khi nộp bài!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AppShell><div style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải bài thi...</div></AppShell>;
  if (!test) return <AppShell><div style={{ padding: '100px 0', textAlign: 'center' }}>Không tìm thấy bài thi!</div></AppShell>;

  if (result) {
    return (
      <AppShell>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '60px 40px', borderRadius: '48px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', width: '100%', maxWidth: '700px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>Hoàn thành!</h1>
            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px' }}>Chúc mừng bạn đã hoàn tất bài thi {test.title}.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', background: '#f8fafc', padding: '30px', borderRadius: '32px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '800' }}>ĐIỂM SỐ</div>
                <div style={{ fontSize: '40px', fontWeight: '950', color: '#0ea5e9' }}>{result.score}%</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '800' }}>XP NHẬN ĐƯỢC</div>
                <div style={{ fontSize: '40px', fontWeight: '950', color: '#10b981' }}>+{result.xpEarned}</div>
              </div>
            </div>

            <button onClick={() => navigate('/tests')} className="btn-soft-gradient" style={{ width: '100%', padding: '18px', borderRadius: '20px', fontWeight: '900', fontSize: '18px', border: 'none', color: 'white', cursor: 'pointer' }}>
              Quay lại danh sách bài thi
            </button>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = test.questions[currentIndex];

  return (
    <AppShell>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <header style={{ 
          background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '16px 40px', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button onClick={() => setShowExitConfirm(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <ChevronLeft size={20} /> Thoát
            </button>
            <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: 'var(--text)', margin:0 }}>{test.title}</h2>
          </div>
          
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', 
            background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)', 
            padding: '10px 20px', borderRadius: '16px',
            color: timeLeft < 60 ? '#ef4444' : '#0ea5e9',
            border: '1px solid currentColor'
          }}>
            <Clock size={18} strokeWidth={2.5} />
            <span style={{ fontWeight: '900', fontSize: '18px', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        <div className="container" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <main>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((answers.length) / test.questions.length) * 100}%` }}
                  style={{ height: '100%', background: '#10b981' }} 
                />
              </div>
              <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>
                ĐÃ HOÀN THÀNH: {answers.length} / {test.questions.length}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ background: 'var(--white)', padding: '60px', borderRadius: '40px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '500px' }}
              >
                <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', display: 'inline-block', marginBottom: '32px' }}>
                  CÂU HỎI {currentIndex + 1}
                </div>

                <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text)', marginBottom: '48px', lineHeight: 1.3 }}>
                  {currentQuestion.question}
                </h3>

                {currentQuestion.type === "MCQ" ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {currentQuestion.options?.map((opt, i) => {
                      const isSelected = currentAnswer === opt;
                      return (
                        <motion.button
                          key={i}
                          onClick={() => handleAnswerSelect(opt)}
                          whileHover={{ x: 8 }}
                          style={{
                            padding: '24px 32px', borderRadius: '24px', border: '2px solid',
                            borderColor: isSelected ? '#0ea5e9' : 'var(--border)',
                            background: isSelected ? 'rgba(14, 165, 233, 0.05)' : 'var(--white)',
                            textAlign: 'left', fontSize: '18px', fontWeight: '700',
                            color: isSelected ? '#0ea5e9' : 'var(--text)',
                            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '20px'
                          }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: isSelected ? '#0ea5e9' : 'var(--bg)', color: isSelected ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Nhập câu trả lời của bạn..."
                    value={currentAnswer}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    style={{ width: '100%', padding: '24px 32px', borderRadius: '24px', border: '2px solid var(--border)', fontSize: '20px', fontWeight: '700', outline: 'none', background: 'var(--bg)', color: 'var(--text)' }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                style={{ padding: '16px 32px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text)', fontWeight: '800', cursor: 'pointer', opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                Quay lại
              </button>
              
              {currentIndex < test.questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  style={{ padding: '16px 48px', borderRadius: '20px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                >
                  Tiếp theo
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ padding: '16px 48px', borderRadius: '20px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                >
                  {isSubmitting ? "Đang nộp..." : "Nộp bài thi"}
                </button>
              )}
            </div>
          </main>

          <aside>
            <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text)', marginBottom: '24px' }}>DANH SÁCH CÂU HỎI</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {test.questions.map((q, idx) => {
                  const isAnswered = answers.some(a => a.questionId === q.id);
                  const isCurrent = currentIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        height: '45px', borderRadius: '12px',
                        background: isCurrent ? '#0ea5e9' : (isAnswered ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg)'),
                        color: isCurrent ? 'white' : (isAnswered ? '#10b981' : 'var(--text-muted)'),
                        fontWeight: '900', fontSize: '14px', cursor: 'pointer',
                        border: isCurrent ? 'none' : (isAnswered ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border)'),
                        transition: 'all 0.2s'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              
              <div style={{ marginTop: '40px', padding: '20px', background: 'var(--bg)', borderRadius: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#0ea5e9' }} /> Đang làm
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)' }} /> Đã trả lời
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)' }} /> Chưa làm
                </div>
              </div>
            </div>
          </aside>
        </div>

        <AnimatePresence>
          {showExitConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ background: 'var(--white)', padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text)', marginBottom: '12px' }}>Thoát bài thi?</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>Bạn vẫn chưa hoàn thành bài thi. Tiến trình của bạn sẽ bị hủy bỏ nếu bạn thoát bây giờ.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <button onClick={() => setShowExitConfirm(false)} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text)', fontWeight: '800', cursor: 'pointer' }}>Hủy</button>
                  <button onClick={() => navigate('/tests')} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer' }}>Vẫn thoát</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
};

export default TakeTestPage;
