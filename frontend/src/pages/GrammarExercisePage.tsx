import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from "lucide-react";

type GrammarExerciseType = "MCQ" | "FILL";

type ExerciseOption = {
  id: string;
  content: string;
};

type GrammarExercise = {
  _id: string;
  grammarId: string;
  question: string;
  type: GrammarExerciseType;
  options?: ExerciseOption[];
  explanation?: string;
};

const GrammarExercisePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grammar, setGrammar] = useState<any>(null);
  const [exercises, setExercises] = useState<GrammarExercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, { isCorrect: boolean; explanation?: string; correctAnswer?: string }>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        // Load grammar details
        const grammarRes = await api.get(`/grammars/${id}`);
        setGrammar(grammarRes.data);

        // Load exercises for this grammar
        const exerciseRes = await api.get(`/grammar-exercises?grammarId=${id}`);
        setExercises(exerciseRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAnswerChange = (exerciseId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [exerciseId]: value }));
  };

  const submitAnswers = async () => {
    if (!id || Object.keys(answers).length < exercises.length) return;
    setSubmitting(true);

    try {
      // Nộp tất cả câu trả lời bằng Promise.all
      const submissionPromises = exercises.map(ex => 
        api.post("/grammar-exercises/submit", {
          exerciseId: ex._id,
          answer: answers[ex._id]
        })
      );
      
      const responses = await Promise.all(submissionPromises);
      
      let score = 0;
      const evalData: Record<string, any> = {};
      
      responses.forEach((res, index) => {
        const data = res.data;
        if (data.isCorrect) score++;
        evalData[exercises[index]._id] = data;
      });

      const total = exercises.length;
      const percentage = Math.round((score / total) * 100);

      setEvaluations(evalData);
      setResult({
        score,
        total,
        percentage,
        passed: percentage >= 50
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderExercise = (ex: GrammarExercise, index: number) => {
    const userAnswer = answers[ex._id] || "";
    const evaluation = evaluations[ex._id];

    return (
      <motion.div 
        key={ex._id} 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <span style={{ 
              fontWeight: '800', fontSize: '24px', color: 'var(--primary)',
              opacity: 0.5
            }}>
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.5', marginTop: '4px' }}>
              {ex.question}
            </h3>
          </div>

          {ex.type === "MCQ" && ex.options && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {ex.options.map((opt, oIdx) => {
                let isSelected = userAnswer === opt.content;
                let bg = isSelected ? 'var(--primary-light)' : 'var(--bg)';
                let borderColor = isSelected ? 'var(--primary)' : 'var(--border)';
                let color = isSelected ? 'var(--primary)' : 'var(--text)';
                
                // Trạng thái đã nộp
                if (result) {
                  const isCorrectAnswer = evaluation?.correctAnswer === opt.content;
                  if (isSelected && evaluation?.isCorrect) {
                  	bg = '#f0fdf4'; borderColor = 'var(--green)'; color = 'var(--green)';
                  } else if (isSelected && !evaluation?.isCorrect) {
                  	bg = '#fdf2f2'; borderColor = 'var(--pink)'; color = 'var(--pink)';
                  } else if (isCorrectAnswer) {
                  	bg = '#f0fdf4'; borderColor = 'var(--green)'; color = 'var(--green)';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={!!result}
                    onClick={() => handleAnswerChange(ex._id, opt.content)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: `2px solid ${borderColor}`,
                      background: bg,
                      color: color,
                      cursor: result ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: '600',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: isSelected || (result && evaluation?.correctAnswer === opt.content) ? 'rgba(0,0,0,0.05)' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 'bold'
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    {opt.content}
                  </button>
                );
              })}
            </div>
          )}

          {ex.type === "FILL" && (
            <div style={{ marginTop: '16px' }}>
              <input 
                type="text" 
                value={userAnswer}
                disabled={!!result}
                onChange={(e) => handleAnswerChange(ex._id, e.target.value)}
                placeholder="Nhập câu trả lời..."
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: result 
                  ? (evaluation?.isCorrect ? '2px solid var(--green)' : '2px solid var(--pink)')
                  : '2px solid var(--border)',
                  background: 'var(--bg)',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              />
              {result && !evaluation?.isCorrect && (
                <div style={{ marginTop: '12px', color: 'var(--green)', fontWeight: '600' }}>
                  Đáp án đúng: {evaluation?.correctAnswer}
                </div>
              )}
            </div>
          )}

          {/* Giải thích sau khi nộp */}
          {result && evaluation?.explanation && (
            <div style={{ 
              marginTop: '24px', padding: '16px', borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.05)', borderLeft: '4px solid var(--primary)',
              color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.5'
            }}>
              <strong>Giải thích:</strong> {evaluation.explanation}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
    setEvaluations({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 0', maxWidth: '800px' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải bài tập...</div>
        ) : exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            <h3>Chưa có bài tập nào cho bài học này.</h3>
            <button className="btn btn-primary mt-6" onClick={() => navigate('/grammar')}>
              Quay lại danh sách
            </button>
          </div>
        ) : (
          <>
            <header style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', 
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  padding: '8px 16px', borderRadius: '99px', fontWeight: '700', fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  <Award size={18} /> THỰC HÀNH NGỮ PHÁP
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
                  {grammar?.title || "Bài tập Ngữ pháp"}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                  Hoàn thành {exercises.length} câu hỏi để đánh giá mức độ hiểu bài.
                </p>
              </motion.div>
            </header>

            {/* Khối Điểm Số (Chỉ hiện khi đã nộp bài) */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
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
                    Bạn đạt <strong>{result.score}/{result.total}</strong> câu đúng ({result.percentage}%)
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="btn btn-primary" onClick={() => navigate("/grammar")}>
                      Học bài tiếp theo <ArrowRight size={18} />
                    </button>
                    <button className="btn btn-ghost" onClick={handleRetry} style={{ border: '1px solid var(--border)' }}>
                      <RotateCcw size={18} /> Làm lại vòng mới
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Danh sách bài tập */}
            <div className="flex flex-col gap-6">
              {exercises.map((ex, index) => renderExercise(ex, index))}
            </div>

            {/* Nút nộp bài */}
            {!result && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  className={`btn btn-primary ${submitting ? 'opacity-50' : ''}`}
                  onClick={submitAnswers}
                  disabled={Object.keys(answers).length < exercises.length || submitting}
                  style={{ padding: '16px 64px', fontSize: '18px', width: '100%' }}
                >
                  {submitting ? "Đang xử lý..." : "Nộp bài và Xem kết quả"}
                </button>
                {Object.keys(answers).length < exercises.length && (
                  <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    * Vui lòng hoàn thành tất cả câu hỏi trước khi nộp.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default GrammarExercisePage;
