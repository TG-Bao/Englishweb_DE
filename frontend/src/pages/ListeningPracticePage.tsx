import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getUser, updateUser } from "../utils/auth";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Languages, Lightbulb, RotateCcw, Mic, Square, Check } from "lucide-react";
import { useRecorder } from "../hooks/useRecorder";
import { SpeakingService } from "../api/SpeakingService";

type Lesson = {
  _id: string;
  title: string;
  image: string;
};

type Sentence = {
  _id: string;
  text: string;
  audio_url?: string;
};

const ListeningPracticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording state from hook
  const { 
    isRecording, recordedAudioUrl, recordedBlob, browserTranscript, 
    startRecording, stopRecording, resetRecording, setRecordedAudioUrl, setRecordedBlob, setBrowserTranscript 
  } = useRecorder();

  const [allRecordings, setAllRecordings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRaw = localStorage.getItem("el_user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        const userId = user?.id || user?._id || "";

        const [lessonRes, sentencesRes, progressRes] = await Promise.all([
          api.get(`/lessons/${id}`),
          api.get(`/sentences/lesson/${id}`),
          userId ? SpeakingService.getProgress(userId) : Promise.resolve({ data: [] })
        ]);

        setLesson(lessonRes.data.data);
        const fetchedSentences = sentencesRes.data.data || [];
        setSentences(fetchedSentences);
        const fetchedRecordings = progressRes.data || [];
        setAllRecordings(fetchedRecordings);

        // Auto-resume to last practiced sentence
        if (fetchedRecordings.length > 0 && fetchedSentences.length > 0) {
          const latest = [...fetchedRecordings].sort((a, b) => 
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
          )[0];
          
          const lastIndex = fetchedSentences.findIndex((s: any) => String(s._id) === String(latest.sentenceId));
          if (lastIndex !== -1) {
            setCurrentIndex(lastIndex);
          }
        }
      } catch (err) {
        console.error("Failed to load practice data", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    // Reset audio player states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSubmitMessage(null);
    resetRecording();
  }, [currentIndex]);

  useEffect(() => {
    // Handle recording synchronization
    const currentId = sentences[currentIndex]?._id;
    const existingAttempts = allRecordings
      .filter((r: any) => String(r.sentenceId) === String(currentId))
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

    const existing = existingAttempts[0];

    if (existing) {
      const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
      const fullUrl = existing.audioUrl.startsWith('http') || existing.audioUrl.startsWith('data:') 
        ? existing.audioUrl 
        : `${BASE}${existing.audioUrl}`;
      setRecordedAudioUrl(fullUrl);
      setRecordedBlob(null);
    } else {
      resetRecording();
    }
  }, [currentIndex, allRecordings, sentences]);


  const currentSentence = sentences[currentIndex];

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUpload = async () => {
    if (!recordedBlob || !id) return;
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const userRaw = localStorage.getItem("el_user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userId = user?.id || "anonymous";

      const data = await SpeakingService.submitRecording(
        recordedBlob, 
        userId, 
        currentSentence._id, 
        browserTranscript
      );

      if (data.success) {
        let msg = "Đã gửi file ghi âm thành công!";
        if (data.data.xpEarned > 0) {
          msg = `Tuyệt vời! Bạn nhận được +${data.data.xpEarned} XP!`;
          // Update user locally
          const { updateUser } = await import("../utils/auth");
          updateUser({
            level: data.data.newLevel,
            points: data.data.newTotalXP,
            totalXP: data.data.newTotalXP,
          });
        }
        setSubmitMessage({ type: 'success', text: msg });
        
        const newEntry = {
          sentenceId: currentSentence._id,
          audioUrl: data.data.fileUrl,
          expected: currentSentence.text,
          transcript: data.data.transcript,
          accuracy: data.data.score, 
          recordedAt: new Date()
        };


        setAllRecordings(prev => {
          const others = prev.filter(r => String(r.sentenceId) !== String(currentSentence._id));
          const currentAttempts = prev.filter(r => String(r.sentenceId) === String(currentSentence._id));
          const updatedAttempts = [newEntry, ...currentAttempts].slice(0, 4);
          return [...updatedAttempts, ...others];
        });
      }

    } catch (err: any) {
      console.error("Upload failed", err);
      setSubmitMessage({ type: 'error', text: err.response?.data?.message || "Lỗi khi gửi file ghi âm." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải bài học...</div>
      </AppShell>
    );
  }

  if (!lesson || sentences.length === 0) {
    return (
      <AppShell>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <h3>Nội dung bài học chưa sẵn sàng.</h3>
          <button onClick={() => navigate('/speaking')} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Quay lại
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container" style={{ padding: '40px 3rem', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Breadcrumb */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Speaking & Listening • Lesson {id?.slice(-2)}
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0369a1', margin: 0 }}>
            {lesson.title}
          </h1>
        </header>

        {/* Main Content Area */}
        <div style={{ display: 'flex', gap: '32px', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          
          {/* Left Column - Current Sentence */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--white)',
                borderRadius: '24px',
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                flex: 1
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', marginBottom: '32px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '99px', display: 'inline-block' }}>
                CÂU {currentIndex + 1} / {sentences.length}
              </div>
              
              <h2 style={{ fontSize: '56px', fontWeight: '800', textAlign: 'center', lineHeight: 1.1, color: 'var(--text)', marginBottom: '32px' }}>
                {currentSentence.text}
              </h2>
              
            </motion.div>

            {/* Audio Player Bar */}
            <div style={{ 
              background: 'var(--white)', 
              borderRadius: '99px', 
              padding: '16px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              {currentSentence.audio_url && (
                <audio 
                  ref={audioRef} 
                  src={currentSentence.audio_url.startsWith('http') || currentSentence.audio_url.startsWith('data:')
                    ? currentSentence.audio_url 
                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'}/${currentSentence.audio_url.replace(/^\//, '')}`} 
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                />
              )}
              
              <button 
                onClick={handlePlayPause}
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#0284c7', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(2,132,199,0.3)'
                }}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
              </button>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="range" 
                  min={0} 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeek}
                  style={{
                    width: '100%',
                    accentColor: '#0284c7',
                    height: '6px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button 
                onClick={() => { if(audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); setIsPlaying(true); } }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0284c7', padding: '8px' }}
                title="Replay"
              >
                <RotateCcw size={24} />
              </button>
            </div>
            
            {/* User Recording Section */}
            <div style={{
              marginTop: '24px',
              background: 'var(--white)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>
                  Luyện phát âm của bạn
                </h3>
                {!recordedAudioUrl && !isRecording && (
                  <button 
                    onClick={startRecording}
                    disabled={allRecordings.filter(r => String(r.sentenceId) === String(currentSentence._id)).length >= 4}
                    className="btn"
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      padding: '10px 20px', borderRadius: '99px', 
                      background: 'white', color: '#0f172a', fontWeight: '600', 
                      border: '1px solid #e2e8f0', cursor: 'pointer',
                      opacity: allRecordings.filter(r => String(r.sentenceId) === String(currentSentence._id)).length >= 4 ? 0.5 : 1
                    }}
                  >
                    <Mic size={20} color="#0284c7" /> 
                    {allRecordings.filter(r => String(r.sentenceId) === String(currentSentence._id)).length >= 4 
                      ? "Đã hết lượt (4/4)" 
                      : "Bắt đầu ghi âm"}
                  </button>
                )}
                {isRecording && (
                  <button 
                    onClick={stopRecording}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      padding: '10px 20px', borderRadius: '99px',
                      background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
                      fontWeight: '600',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <Square size={20} fill="currentColor" /> Dừng ghi âm
                  </button>
                )}
              </div>

              {recordedAudioUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <audio controls src={recordedAudioUrl} style={{ width: '100%', height: '40px' }} />
                    {browserTranscript && !allRecordings.find(r => String(r.sentenceId) === String(currentSentence._id)) && (
                      <div style={{ 
                        fontSize: '13px', color: '#64748b', fontStyle: 'italic', 
                        background: 'white', padding: '6px 12px', borderRadius: '8px', 
                        border: '1px solid #e2e8f0', display: 'inline-block', width: 'fit-content'
                      }}>
                        <span style={{ fontWeight: '700', fontSize: '10px', color: '#94a3b8', marginRight: '6px' }}>NHẬN DIỆN TẠM THỜI:</span>
                        "{browserTranscript}"
                      </div>
                    )}
                  </div>
                  {recordedBlob ? (
                    <button 
                      onClick={handleUpload}
                      disabled={isSubmitting}
                      style={{ 
                        background: '#0284c7', color: 'white', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontWeight: '700', padding: '10px 20px', borderRadius: '99px',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi ghi âm"}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ 
                        color: '#059669', background: '#d1fae5', padding: '10px 20px', 
                        borderRadius: '99px', fontWeight: '700', display: 'flex', 
                        alignItems: 'center', gap: '8px', fontSize: '14px' 
                      }}>
                        <Check size={18} strokeWidth={3} /> Đã gửi
                      </div>
                    </div>
                  )}

                  {allRecordings.filter(r => String(r.sentenceId) === String(currentSentence._id)).length < 4 && (
                    <button 
                      onClick={() => {
                        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
                        setRecordedAudioUrl(null);
                        setRecordedBlob(null);
                        setBrowserTranscript(""); // Clear transcript for new take
                        setSubmitMessage(null);

                        startRecording();
                      }}
                      style={{ 
                        background: 'white', border: '1px solid #e2e8f0', color: '#0284c7', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontWeight: '600', padding: '10px 16px', borderRadius: '99px',
                      }}
                    >
                      <RotateCcw size={18} /> Ghi âm lại
                    </button>
                  )}
                </div>
              )}

              {/* Display score and transcript if available from allRecordings */}
              {(() => {
                const currentId = sentences[currentIndex]?._id;
                const attempts = allRecordings
                  .filter((r: any) => String(r.sentenceId) === String(currentId))
                  .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

                if (attempts.length === 0) return null;

                const renderDetailedComparison = (expected: string, transcript: string) => {
                  const numberMap: { [key: string]: string } = {
                    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
                    "eleven": "11", "twelve": "12", "thirteen": "13", "fourteen": "14", "fifteen": "15", "sixteen": "16", "seventeen": "17", "eighteen": "18", "nineteen": "19",
                    "twenty": "20", "thirty": "30", "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70", "eighty": "80", "ninety": "90", "hundred": "100"
                  };

                  const normalize = (s: string) => {
                    let clean = s.toLowerCase().replace(/[.,!?;:]/g, "");
                    return numberMap[clean] || clean;
                  };

                  const expectedWords = expected.split(/\s+/);
                  const transcriptWords = transcript.split(/\s+/);
                  
                  const cleanExpected = expectedWords.map(normalize);
                  const cleanTranscript = transcriptWords.map(normalize);

                  // Simple alignment: for each expected word, check if it was spoken
                  let lastMatchedIdx = -1;
                  const targetAlignment = expectedWords.map((word, i) => {
                    const cleanWord = cleanExpected[i];
                    let foundIdx = -1;
                    for (let j = lastMatchedIdx + 1; j < cleanTranscript.length; j++) {
                      if (cleanTranscript[j] === cleanWord) {
                        foundIdx = j;
                        break;
                      }
                    }
                    
                    if (foundIdx !== -1) {
                      lastMatchedIdx = foundIdx;
                      return { word, status: 'correct' as const };
                    } else {
                      return { word, status: 'missing' as const };
                    }
                  });

                  // Transcript alignment
                  let expectedSet = new Set(cleanExpected);
                  const transcriptAlignment = transcriptWords.map((word, i) => {
                    return { word, status: expectedSet.has(cleanTranscript[i]) ? 'correct' : 'wrong' };
                  });

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Câu chuẩn (Xanh = Đạt, Đỏ = Thiếu):</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1.4, color: '#1e293b' }}>
                          {targetAlignment.map((item, idx) => (
                            <span key={idx} style={{ color: item.status === 'correct' ? '#059669' : '#ef4444', marginRight: '6px' }}>
                              {item.word}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Bạn đã nói:</div>
                        <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: 1.4, fontStyle: 'italic', color: '#475569' }}>
                          "{transcriptAlignment.map((item, idx) => (
                            <span key={idx} style={{ color: item.status === 'correct' ? 'inherit' : '#ef4444', marginRight: '6px' }}>
                              {item.word}
                            </span>
                          ))}"
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>
                        LỊCH SỬ LUYỆN TẬP ({attempts.length}/4)
                      </span>
                    </div>
                    
                    {attempts.map((rec, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ 
                          background: index === 0 ? '#f0f9ff' : 'white', 
                          padding: '24px', borderRadius: '24px',
                          border: index === 0 ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          display: 'flex', flexDirection: 'column', gap: '16px',
                          boxShadow: index === 0 ? '0 10px 25px rgba(2,132,199,0.1)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', 
                              background: rec.accuracy >= 80 ? '#dcfce7' : '#f1f5f9',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {rec.accuracy >= 80 ? <Check size={20} color="#059669" /> : <Mic size={20} color="#64748b" />}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>LẦN THỬ {attempts.length - index}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(rec.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                                fontSize: '24px', fontWeight: '900', 
                                color: rec.accuracy >= 80 ? '#059669' : rec.accuracy >= 50 ? '#d97706' : '#ef4444' 
                            }}>
                                {rec.accuracy}%
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Độ chính xác</div>
                          </div>
                        </div>

                        {rec.transcript && renderDetailedComparison(rec.expected || currentSentence.text, rec.transcript)}
                      </motion.div>
                    ))}
                  </div>
                );
              })()}

              {submitMessage && (

                <div style={{ 
                  color: submitMessage.type === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '14px', fontWeight: '600', textAlign: 'center'
                }}>
                  {submitMessage.text}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Context & Tips */}
          <div style={{ flex: '0 1 380px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ 
              borderRadius: '20px', overflow: 'hidden', position: 'relative', height: '240px', background: '#334155' 
            }}>
              <img src={lesson.image} alt="Context" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0, 
                padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
              }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                  Practice real-world context
                </h3>
              </div>
            </div>

            <div style={{ 
              background: '#f8fafc', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '800', fontSize: '18px' }}>
                <Lightbulb size={24} color="#0284c7" /> Pro Tip
              </div>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '15px' }}>
                Pay attention to the rising intonation at the end of the question. Try to record yourself and match the speed of the narrator.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{ background: 'white', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', color: '#0284c7', border: '1px solid #e2e8f0' }}>
                  Phonetics Focus
                </span>
                <span style={{ background: 'white', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', color: '#0284c7', border: '1px solid #e2e8f0' }}>
                  Intonation
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Navigation */}
        <footer style={{ 
          marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '40px'
        }}>
          
          <button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn btn-ghost"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              borderRadius: '99px', background: '#f1f5f9', color: currentIndex === 0 ? '#94a3b8' : '#334155',
              fontWeight: '600', fontSize: '15px'
            }}
          >
            <ChevronLeft size={20} /> Previous Sentence
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {sentences.map((_, idx) => (
              <div 
                key={idx}
                style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  background: currentIndex === idx ? '#0284c7' : '#cbd5e1',
                  transition: 'background 0.3s'
                }}
              />
            ))}
          </div>

          <button 
            onClick={() => {
              if (currentIndex < sentences.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                navigate('/speaking');
              }
            }}
            className="btn btn-primary"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              borderRadius: '99px', background: '#0284c7', color: 'white',
              fontWeight: '600', fontSize: '15px'
            }}
          >
            {currentIndex < sentences.length - 1 ? (
              <>Next Sentence <ChevronRight size={20} /></>
            ) : (
              <>Hoàn thành <ChevronRight size={20} /></>
            )}
          </button>

        </footer>

      </div>
    </AppShell>
  );
};

export default ListeningPracticePage;
