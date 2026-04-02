import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Award, Timer, RotateCcw, HelpCircle } from "lucide-react";

type QuizMeta = {
  _id: string;
  title: string;
};

type Question = {
  _id: string;
  question: string;
  options: string[];
};

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(
    null
  );

  useEffect(() => {
    api.get("/quiz").then(res => {
      setQuizzes(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const quizIdFromUrl = searchParams.get("quizId");
    const scopeTypeFromUrl = searchParams.get("scopeType");
    const scopeIdFromUrl = searchParams.get("scopeId");

    if (quizIdFromUrl) {
      setSelectedQuizId(quizIdFromUrl);
    } else if (scopeTypeFromUrl && scopeIdFromUrl) {
      api.get(`/quiz/scope/${scopeTypeFromUrl}/${scopeIdFromUrl}`)
        .then(res => {
          setSelectedQuizId(res.data.data.quiz._id);
        })
        .catch(err => {
          console.error("Failed to fetch quiz by scope", err);
        });
    } else if (quizzes.length > 0) {
      // Logic for initial selection if no quizId in URL
    }
  }, [searchParams, quizzes]);

  useEffect(() => {
    if (!selectedQuizId) return;
    setLoading(true);
    api.get(`/quiz/${selectedQuizId}`).then(res => {
      setQuestions(res.data.questions);
      setAnswers({});
      setResult(null);
      setLoading(false);
    });
  }, [selectedQuizId]);

  const submit = async () => {
    if (!selectedQuizId) return;
    const res = await api.post("/quiz/submit", { quizId: selectedQuizId, answers });
    setResult(res.data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuiz = quizzes.find(q => q._id === selectedQuizId);

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 0', maxWidth: '800px' }}>
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'var(--primary-light)', color: 'var(--primary)',
              padding: '8px 16px', borderRadius: '99px', fontWeight: '700', fontSize: '14px',
              marginBottom: '16px'
            }}>
              <Award size={18} /> KIỂM TRA KIẾN THỨC
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '12px' }}>
              {currentQuiz?.title || "Sẵn sàng chưa?"}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
              Hoàn thành bài trắc nghiệm để đánh giá mức độ hiểu bài của bạn.
            </p>
          </motion.div>
        </header>

        {/* Results View */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{ 
                padding: '40px', textAlign: 'center', marginBottom: '40px',
                border: result.passed ? '2px solid var(--green)' : '2px solid var(--pink)',
                background: result.passed ? '#f0fdf4' : '#fdf2f2'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%',
                background: result.passed ? 'var(--green)' : 'var(--pink)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                {result.passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
                {result.passed ? "Tuyệt vời!" : "Cố gắng thêm chút nữa!"}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px' }}>
                Bạn đạt {result.score}/{result.total} câu đúng ({result.percentage}%)
              </p>
              <div className="flex justify-center gap-4">
                <button className="btn btn-primary" onClick={() => navigate("/vocabulary")}>
                  Học bài tiếp theo
                </button>
                <button className="btn btn-ghost" onClick={() => setResult(null)} style={{ border: '1px solid var(--border)' }}>
                  <RotateCcw size={18} /> Làm lại
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Content */}
        {!result && (
          <div className="flex flex-col gap-12">
            {!selectedQuizId && !loading && (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <HelpCircle size={48} className="text-muted mb-4" style={{ margin: '0 auto' }} />
                <h3>Vui lòng chọn một bài kiểm tra</h3>
                <div className="grid gap-2 mt-6">
                  {quizzes.map(q => (
                    <button 
                      key={q._id} 
                      className="btn btn-ghost" 
                      onClick={() => setSelectedQuizId(q._id)}
                      style={{ border: '1px solid var(--border)', justifyContent: 'space-between' }}
                    >
                      {q.title} <ChevronRight size={18} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải câu hỏi...</div>
            ) : (
              questions.map((q, qIndex) => (
                <motion.div 
                  key={q._id} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: qIndex * 0.1 }}
                >
                  <div className="quiz-question-card">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                      <span style={{ 
                        fontWeight: '800', fontSize: '24px', color: 'var(--primary)',
                        opacity: 0.3
                      }}>
                        {qIndex + 1 < 10 ? `0${qIndex + 1}` : qIndex + 1}
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', lineHeight: '1.4' }}>{q.question}</h3>
                    </div>

                    <div className="quiz-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                      {q.options.map((option, oIndex) => {
                        const isSelected = answers[q._id] === option;
                        return (
                          <div
                            key={option}
                            onClick={() => setAnswers(prev => ({ ...prev, [q._id]: option }))}
                            style={{
                              padding: '20px',
                              borderRadius: '16px',
                              border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                              background: isSelected ? 'var(--primary-light)' : 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              boxShadow: isSelected ? '0 10px 20px rgba(37, 99, 235, 0.1)' : 'none'
                            }}
                          >
                            <div style={{ 
                              width: '28px', height: '28px', borderRadius: '8px',
                              background: isSelected ? 'var(--primary)' : 'var(--bg)',
                              color: isSelected ? 'white' : 'var(--text-muted)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: '700', fontSize: '14px'
                            }}>
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            <span style={{ fontWeight: isSelected ? '700' : '500' }}>{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {questions.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={submit}
                  disabled={Object.keys(answers).length < questions.length}
                  style={{ padding: '16px 64px', fontSize: '18px', width: '100%' }}
                >
                  Nộp bài và xem kết quả
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default QuizPage;
