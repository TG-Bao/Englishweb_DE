import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GrammarService, GrammarLesson } from "../services/GrammarService";
import { ProgressService } from "../services/ProgressService";
import { getUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, Info, PlayCircle, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const GrammarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [grammar, setGrammar] = useState<GrammarLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await GrammarService.getById(id);
        setGrammar(data);
      } catch (err) {
        console.error("Failed to load grammar lesson", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleTakeQuiz = async () => {
    if (!grammar || !user) {
      if (grammar) navigate(`/quiz?scopeType=GRAMMAR&scopeId=${grammar._id}`);
      return;
    }
    
    setMarking(true);
    try {
      // Mark as learned before going to quiz
      await ProgressService.markGrammarLearned(grammar.level, grammar._id);
    } catch (err) {
      console.error("Failed to mark grammar as learned", err);
    } finally {
      setMarking(false);
      navigate(`/quiz?scopeType=GRAMMAR&scopeId=${grammar._id}`);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid var(--primary-light)', 
            borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </AppShell>
    );
  }

  if (!grammar) {
    return (
      <AppShell>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2>Không tìm thấy bài học ngữ pháp này.</h2>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '40vh',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.05))',
        zIndex: -1, pointerEvents: 'none', borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
      }} />

      <div className="container" style={{ padding: '40px 0', maxWidth: '900px' }}>
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={() => navigate("/grammar")}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', fontSize: '15px', fontWeight: '600', color: '#64748b',
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '100px',
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <ChevronLeft size={18} /> Danh sách ngữ pháp
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'var(--primary-light)', color: 'var(--primary)',
              padding: '8px 16px', borderRadius: '100px', fontWeight: '800', fontSize: '14px',
              marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              <GraduationCap size={18} /> Level {grammar.level}
            </div>
            <h1 style={{ 
              fontSize: '48px', fontWeight: '900', color: '#0f172a', margin: '0 0 24px 0',
              lineHeight: '1.2'
            }}>
              {grammar.title}
            </h1>
          </div>
          
          {/* Theory Section */}
          <div style={{ 
            background: 'white', padding: '48px', borderRadius: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9',
            marginBottom: '40px'
          }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px' }}>
                <BookOpen size={28} className="text-primary" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Giải thích quy tắc</h2>
            </div>
            <p style={{ 
              fontSize: '18px', color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-line',
              paddingLeft: '16px', borderLeft: '4px solid #e2e8f0'
            }}>
              {grammar.description}
            </p>
          </div>

          {/* Structure Section */}
          {grammar.structure && (
            <div style={{ 
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '4px', borderRadius: '32px',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)', marginBottom: '40px'
            }}>
              <div style={{ background: '#faf5ff', padding: '48px', borderRadius: '28px', height: '100%' }}>
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles className="text-primary" /> Cấu trúc câu
                  </h2>
                </div>
                <div style={{ 
                  fontSize: '26px', fontWeight: '800', fontFamily: 'monospace', 
                  background: 'white', padding: '32px', borderRadius: '20px',
                  color: '#1e293b', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
                  border: '2px dashed #e0e7ff'
                }}>
                  {grammar.structure}
                </div>
              </div>
            </div>
          )}

          {/* Examples Section */}
          {grammar.examples && grammar.examples.length > 0 && (
            <div style={{ 
              background: 'white', padding: '48px', borderRadius: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9',
              marginBottom: '40px'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 color="#10b981" /> Ví dụ minh họa
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', margin: 0, padding: 0 }}>
                {grammar.examples.map((example, idx) => (
                  <li key={idx} className="flex gap-4 items-start" style={{ 
                    background: '#f8fafc', padding: '24px 32px', borderRadius: '20px', 
                    border: '1px solid #e2e8f0', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Info size={24} color="var(--primary)" className="mt-1 flex-shrink-0" />
                    <span style={{ fontSize: '18px', lineHeight: '1.6', color: '#334155', fontWeight: '500' }}>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Media Section */}
          {grammar.mediaUrl && (
            <div style={{ 
              background: '#0f172a', padding: '48px', borderRadius: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', marginBottom: '40px', color: 'white'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PlayCircle color="#38bdf8" /> Video / Audio Hướng dẫn
              </h2>
              {grammar.mediaUrl.endsWith('.mp3') || grammar.mediaUrl.endsWith('.wav') ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '8px' }}>
                  <AudioPlayer
                    autoPlay={false}
                    src={grammar.mediaUrl}
                    style={{ borderRadius: '12px', boxShadow: 'none' }}
                  />
                </div>
              ) : (
                <div style={{ borderRadius: '20px', overflow: 'hidden', border: '4px solid #1e293b' }}>
                  <video 
                    controls 
                    src={grammar.mediaUrl} 
                    style={{ width: '100%', display: 'block', background: 'black' }} 
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginTop: '64px', marginBottom: '80px' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={marking}
              onClick={handleTakeQuiz}
              style={{ 
                fontSize: '20px', fontWeight: '800', padding: '20px 56px', borderRadius: '100px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
                border: 'none', cursor: marking ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', opacity: marking ? 0.7 : 1
              }}
            >
              <PlayCircle size={28} />
              {marking ? "Đang xử lý..." : "Đánh dấu đã học & Làm bài tập"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default GrammarDetailPage;
