import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Languages, Lightbulb, RotateCcw, Mic, Square, Check } from "lucide-react";

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

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [browserTranscript, setBrowserTranscript] = useState(""); // NEW: Browser STT
  const [allRecordings, setAllRecordings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recognitionRef = useRef<any>(null); // NEW: Reference to Recognition


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRaw = localStorage.getItem("el_user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        const userId = user?.id || "";

        const [lessonRes, sentencesRes, progressRes] = await Promise.all([
          api.get(`/lessons/${id}`),
          api.get(`/sentences/lesson/${id}`),
          userId ? api.get(`/speaking/progress/${userId}`) : Promise.resolve({ data: { data: [] } })
        ]);

        setLesson(lessonRes.data.data);
        setSentences(sentencesRes.data.data || []);
        setAllRecordings(progressRes.data.data || []);
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

    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    // Handle recording synchronization
    const currentId = sentences[currentIndex]?._id;
    const existing = allRecordings.find((r: any) => String(r.sentenceId) === String(currentId));

    if (existing) {
      const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
      const fullUrl = existing.audioUrl.startsWith('http') ? existing.audioUrl : `${BASE}${existing.audioUrl}`;
      setRecordedAudioUrl(fullUrl);
      setRecordedBlob(null);
    } else {
      // Only clear if no existing recording for the current sentence
      if (recordedAudioUrl && !recordedAudioUrl.startsWith('http') && !recordedAudioUrl.startsWith('/static')) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      setRecordedAudioUrl(null);
      setRecordedBlob(null);
    }
  }, [currentIndex, allRecordings]);


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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setBrowserTranscript(""); // Clear old transcript

      // --- INITIALIZE BROWSER STT (FREE) ---
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("Browser STT Result:", transcript);
          setBrowserTranscript(transcript);
        };
        
        recognition.onerror = (e: any) => console.log("Recognition Error", e);
        
        recognition.start();
        recognitionRef.current = recognition;
      }

      mediaRecorder.ondataavailable = (event) => {

        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setRecordedBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      // Stop browser recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };


  const handleUpload = async () => {
    if (!recordedBlob || !id) return;
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const userRaw = localStorage.getItem("el_user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userId = user?.id || "anonymous";

      const formData = new FormData();
      formData.append("audio", recordedBlob, "recording.webm");
      formData.append("userId", userId);
      formData.append("sentenceId", currentSentence._id);
      formData.append("browserTranscript", browserTranscript); // NEW: Send browser-captured text


      const res = await api.post("/speaking", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        setSubmitMessage({ type: 'success', text: "Đã gửi file ghi âm thành công!" });
        // Update local state so it persists if navigating back
        const newEntry = {
          sentenceId: currentSentence._id,
          audioUrl: res.data.data.fileUrl,
          transcript: res.data.data.transcript,
          accuracy: res.data.data.accuracy,
          recordedAt: new Date()
        };
        setAllRecordings(prev => [newEntry, ...prev.filter(r => r.sentenceId !== currentSentence._id)]);
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
                  src={currentSentence.audio_url} 
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
                    className="btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '99px', background: 'white', color: '#0f172a', fontWeight: '600', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                  >
                    <Mic size={20} color="#0284c7" /> Bắt đầu ghi âm
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
                  <audio controls src={recordedAudioUrl} style={{ flex: 1, height: '40px' }} />
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

                  <button 
                    onClick={() => {
                      URL.revokeObjectURL(recordedAudioUrl);
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
                </div>
              )}

              {/* Display score and transcript if available from allRecordings */}
              {(() => {
                const currentId = sentences[currentIndex]?._id;
                const rec = allRecordings.find((r: any) => String(r.sentenceId) === String(currentId));
                if (rec && (rec.accuracy !== undefined || rec.transcript)) {
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        background: '#f1f5f9', padding: '16px 20px', borderRadius: '16px',
                        display: 'flex', flexDirection: 'column', gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>KẾT QUẢ PHÁT ÂM:</span>
                        <div style={{ 
                          fontSize: '24px', fontWeight: '900', 
                          color: rec.accuracy >= 80 ? '#10b981' : rec.accuracy >= 50 ? '#f59e0b' : '#ef4444'
                        }}>
                          {rec.accuracy}%
                        </div>
                      </div>
                      {rec.transcript && (
                        <div style={{ fontSize: '15px', color: '#1e293b', fontStyle: 'italic', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          " {rec.transcript} "
                        </div>
                      )}
                      <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', width: `${rec.accuracy}%`, 
                          background: rec.accuracy >= 80 ? '#10b981' : rec.accuracy >= 50 ? '#f59e0b' : '#ef4444',
                          transition: 'width 1s ease-out'
                        }} />
                      </div>
                    </motion.div>
                  );
                }
                return null;
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
