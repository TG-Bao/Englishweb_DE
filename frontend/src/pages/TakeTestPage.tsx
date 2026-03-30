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

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const user = getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch test details AND check if already completed
        const [testRes, resultsRes] = await Promise.all([
          api.get(`/tests/${id}`),
          api.get(`/tests?userId=${user.id}`) // This returns enriched tests with 'completed' status
        ]);

        const currentTest = testRes.data.data;
        const testStatus = resultsRes.data.data.find((t: any) => t._id === id);

        if (testStatus?.completed) {
          alert("Bạn đã hoàn thành bài thi này và không thể làm lại.");
          navigate("/tests");
          return;
        }

        setTest(currentTest);
      } catch (err) {
        console.error("Failed to load test", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id, navigate, id]);

  const handleAnswerSelect = (answer: string) => {
    const currentQuestionId = test?.questions[currentIndex].id!;
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
      if (!user) {
        alert("Bạn cần đăng nhập để thực hiện bài thi!");
        navigate("/login");
        return;
      }

      const payload = {
        userId: user.id,
        answers: answers
      };


      const res = await api.post(`/tests/${test._id}/submit`, payload);
      const resultData = res.data.data;
      setResult(resultData);
      
      // Update local storage user info so it reflects level up and new XP
      if (resultData.newLevel || resultData.newTotalXP !== undefined) {
        updateUser({ 
          level: resultData.newLevel, 
          points: resultData.newTotalXP 
        });
      }
    } catch (err) {


      console.error("Submission failed", err);
      alert("Lỗi khi nộp bài. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AppShell><div style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải bài thi...</div></AppShell>;
  if (!test) return <AppShell><div style={{ padding: '100px 0', textAlign: 'center' }}>Không tìm thấy bài thi!</div></AppShell>;

  if (result) {
    return (
      <AppShell>
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              background: 'white', 
              padding: '80px 40px', 
              borderRadius: '48px', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: '700px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
             {/* Decorative success patterns */}
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: '#10b981' }} />
             
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ 
                width: '100px', height: '100px', background: '#f0fdf4', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px'
              }}>
                <CheckCircle size={56} color="#10b981" />
              </div>
              
              <h1 style={{ fontSize: '38px', fontWeight: '950', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                Tuyệt vời!
              </h1>
              <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '48px', fontWeight: '500' }}>
                Bạn đã hoàn thành bài thi với kết quả ấn tượng
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px', 
                margin: '0 auto 48px',
                background: '#f8fafc',
                padding: '32px',
                borderRadius: '32px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800', marginBottom: '8px' }}>
                    Điểm số
                  </div>
                  <div style={{ fontSize: '44px', fontWeight: '950', color: '#0ea5e9', letterSpacing: '-0.03em' }}>
                    {result.score}<span style={{ fontSize: '24px' }}>%</span>
                  </div>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800', marginBottom: '8px' }}>
                    XP Nhận được
                  </div>
                  <div style={{ fontSize: '44px', fontWeight: '950', color: '#10b981', letterSpacing: '-0.03em' }}>
                    +{result.xpEarned}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px', 
                marginBottom: '48px',
                color: '#475569',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                <span style={{ color: '#10b981' }}>{result.correctCount} câu đúng</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span>{result.totalQuestions} tổng số câu</span>
              </div>

              <button 
                onClick={() => navigate('/tests')}
                className="btn-soft-gradient"
                style={{
                  width: '100%',
                  padding: '18px 40px',
                  borderRadius: '24px',
                  fontWeight: '800',
                  fontSize: '18px',
                  cursor: 'pointer',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)',
                  transition: 'all 0.3s'
                }}
              >
                Tiếp tục học tập
              </button>
            </motion.div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = test.questions[currentIndex];

  return (
    <AppShell>
      <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <button 
                onClick={() => navigate('/tests')}
                style={{ 
                  background: 'none', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: '700', 
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '12px', padding: 0 
                }}
              >
                <ChevronLeft size={16} /> Thoát bài thi
              </button>
              <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                {test.title}
              </h2>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'white', 
              padding: '12px 24px', 
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              border: '1px solid #f1f5f9'
            }}>
              <Clock size={20} color="#0ea5e9" strokeWidth={2.5} />
              <span style={{ fontWeight: '800', color: '#334155', fontSize: '17px', fontVariantNumeric: 'tabular-nums' }}>20:00</span>
            </div>
          </header>

          {/* Progress Bar Container */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tiến độ làm bài
              </span>
              <span style={{ color: '#0ea5e9', fontSize: '14px', fontWeight: '800' }}>
                CÂU {currentIndex + 1} / {test.questions.length}
              </span>
            </div>
            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / test.questions.length) * 100}%` }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }} 
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ 
                minHeight: '440px', 
                background: 'white', 
                padding: '60px', 
                borderRadius: '40px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)', 
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ 
                display: 'inline-flex', alignSelf: 'flex-start',
                background: '#f0f9ff', color: '#0ea5e9',
                padding: '8px 16px', borderRadius: '12px',
                fontSize: '13px', fontWeight: '850', marginBottom: '28px'
              }}>
                {currentQuestion.type === "MCQ" ? "TRẮC NGHIỆM" : "ĐIỀN VÀO CHỖ TRỐNG"}
              </div>

              <h3 style={{ fontSize: '28px', fontWeight: '850', color: '#0f172a', marginBottom: '48px', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                {currentQuestion.question}
              </h3>

              <div style={{ flex: 1 }}>
                {currentQuestion.type === "MCQ" ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {currentQuestion.options?.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswerSelect(opt)}
                        style={{
                          padding: '24px 28px',
                          borderRadius: '24px',
                          border: '2px solid',
                          borderColor: currentAnswer === opt ? '#0ea5e9' : '#f1f5f9',
                          background: currentAnswer === opt ? '#f0f9ff' : 'white',
                          textAlign: 'left',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: currentAnswer === opt ? '#0369a1' : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          boxShadow: currentAnswer === opt ? '0 8px 20px rgba(14, 165, 233, 0.1)' : 'none'
                        }}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '10px', border: '2px solid',
                          borderColor: currentAnswer === opt ? '#0ea5e9' : '#e2e8f0',
                          background: currentAnswer === opt ? '#0ea5e9' : 'transparent',
                          color: currentAnswer === opt ? 'white' : '#94a3b8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: '900'
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Nhập câu trả lời của bạn..."
                      value={currentAnswer}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      style={{
                        width: '100%', 
                        padding: '24px 32px', 
                        borderRadius: '24px', 
                        border: '2px solid #e2e8f0', 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#0f172a',
                        background: '#f8fafc',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              style={{
                padding: '16px 28px', borderRadius: '20px', border: '1px solid #e2e8f0', 
                background: 'white', color: '#64748b', fontWeight: '800', 
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', 
                display: 'flex', alignItems: 'center', gap: '8px', opacity: currentIndex === 0 ? 0.5 : 1,
                fontSize: '15px'
              }}
            >
              <ChevronLeft size={20} /> Quay lại
            </button>

            <div style={{ display: 'flex', gap: '16px' }}>
              {currentIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  style={{
                    padding: '18px 48px', borderRadius: '24px', border: 'none', 
                    background: '#0ea5e9', color: 'white', fontWeight: '850', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '17px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.15)'
                  }}
                >
                  Tiếp tục <ChevronRight size={22} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: '18px 48px', borderRadius: '24px', border: 'none', 
                    background: '#10b981', color: 'white', fontWeight: '850', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '17px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? "Đang xử lý..." : "Nộp bài thi"} <Send size={22} />
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </AppShell>
  );
};

export default TakeTestPage;
