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
        const res = await api.get(`/tests/${id}`);
        setTest(res.data.data);
      } catch (err) {
        console.error("Failed to load test", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id]);

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
        <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: 'white', padding: '60px', borderRadius: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
          >
            <CheckCircle size={80} color="#10b981" style={{ marginBottom: '32px' }} />
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>Hoàn thành bài thi!</h1>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '40px 0' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Điểm số</div>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#0ea5e9' }}>{result.score}%</div>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0' }}></div>
              <div>
                <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>XP Nhận được</div>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#10b981' }}>+{result.xpEarned}</div>
              </div>
            </div>

            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px' }}>
              Bạn đã trả lời đúng {result.correctCount} trên {result.totalQuestions} câu hỏi.
            </p>

            <button 
              onClick={() => navigate('/tests')}
              style={{
                background: '#0ea5e9', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '16px', fontWeight: '700', fontSize: '18px', cursor: 'pointer'
              }}
            >
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
      <div className="container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{test.title}</h2>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
              CÂU HỎI {currentIndex + 1} / {test.questions.length}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '12px 20px', borderRadius: '12px' }}>
            <Clock size={20} color="#0ea5e9" />
            <span style={{ fontWeight: '700', color: '#334155' }}>20:00</span>
          </div>
        </header>

        {/* Progress Bar */}
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#0ea5e9', width: `${((currentIndex + 1) / test.questions.length) * 100}%`, transition: 'width 0.3s' }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ minHeight: '400px', background: 'white', padding: '48px', borderRadius: '32px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '40px', lineHeight: 1.4 }}>
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === "MCQ" ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentQuestion.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(opt)}
                    style={{
                      padding: '20px 24px',
                      borderRadius: '16px',
                      border: '2px solid',
                      borderColor: currentAnswer === opt ? '#0ea5e9' : '#f1f5f9',
                      background: currentAnswer === opt ? '#f0f9ff' : 'white',
                      textAlign: 'left',
                      fontSize: '17px',
                      fontWeight: '700',
                      color: currentAnswer === opt ? '#0369a1' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', border: '2px solid',
                      borderColor: currentAnswer === opt ? '#0ea5e9' : '#cbd5e1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Nhập câu trả lời của bạn..."
                value={currentAnswer}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                style={{
                  width: '100%', padding: '20px 24px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '18px', fontWeight: '600', color: '#1e293b'
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            style={{
              padding: '16px 32px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '700', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <ChevronLeft size={20} /> Câu trước
          </button>

          {currentIndex < test.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              style={{
                padding: '16px 40px', borderRadius: '16px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              Tiếp theo <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '16px 40px', borderRadius: '16px', border: 'none', background: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? "Đang nộp bài..." : "Nộp bài thi"} <Send size={20} />
            </button>
          )}
        </footer>
      </div>
    </AppShell>
  );
};

export default TakeTestPage;
