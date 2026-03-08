import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, BookOpen, Layers, HelpCircle, Plus, Edit2, Trash2,
  Save, Settings, Globe, LogOut, Moon, ChevronDown, ShieldCheck,
  List, Search
} from "lucide-react";
import { clearAuth, getUser } from "../utils/auth";

type Section = "topics" | "vocabulary" | "grammar" | "quizzes" | "questions";

interface Topic { _id: string; title: string; order?: number; level?: string; }
interface Quiz { _id: string; title: string; scopeType?: string; scopeId?: string; passScore?: number; }
interface Question { _id: string; quizId: string; question: string; options?: string[]; correctAnswer?: string; sourceType?: string; type?: string; }
interface Vocabulary { _id: string; word: string; meaning: string; topic: string; level: string; example?: string; phonetic?: string; topicId: string; }
interface Grammar { _id: string; level: string; title: string; description: string; examples: string[]; }

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState<Section>("topics");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const [topicTitle, setTopicTitle] = useState("");
  const [topicOrder, setTopicOrder] = useState(1);
  const [topicLevel, setTopicLevel] = useState("A2");
  const [editTopicId, setEditTopicId] = useState("");

  const [vocabTopicId, setVocabTopicId] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [editVocabId, setEditVocabId] = useState("");
  const [vSearch, setVSearch] = useState("");

  const [grammarTitle, setGrammarTitle] = useState("");
  const [grammarDesc, setGrammarDesc] = useState("");
  const [grammarEx, setGrammarEx] = useState("");
  const [grammarLevel, setGrammarLevel] = useState("A1");
  const [editGrammarId, setEditGrammarId] = useState("");
  const [gSearch, setGSearch] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizScopeType, setQuizScopeType] = useState("TOPIC");
  const [quizScopeId, setQuizScopeId] = useState("");
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [editQuizId, setEditQuizId] = useState("");

  const [questionQuizId, setQuestionQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [qSourceType, setQSourceType] = useState("CUSTOM");
  const [qType, setQType] = useState("MCQ");
  const [editQuestionId, setEditQuestionId] = useState("");

  const loadAdminData = async () => {
    try {
      const [topicRes, quizRes, vocabRes] = await Promise.all([
        api.get("/grammar-topics/all"),
        api.get("/quiz/all"),
        api.get("/vocabulary")
      ]);
      setTopics(topicRes.data.data || []);
      setQuizzes(quizRes.data.data || []);
      setVocabularies(vocabRes.data.data || []);
      if (topicRes.data.data?.length > 0 && !vocabTopicId) setVocabTopicId(topicRes.data.data[0]._id);
      if (quizRes.data.data?.length > 0 && !questionQuizId) setQuestionQuizId(quizRes.data.data[0]._id);
    } catch (err) {
      console.error("Failed to load admin data", err);
    }
  };

  const loadAllVocab = async () => {
    try {
      const res = await api.get("/vocabulary");
      setVocabularies(res.data.data || []);
    } catch (err) {
      console.error("Failed to load vocabularies", err);
    }
  };


  const loadGrammars = async (level: string) => {
    if (!level) return;
    try {
      const res = await api.get(`/grammar/level/${level}`);
      setGrammars(res.data.data || []);
    } catch (err) {
      console.error("Failed to load grammars", err);
    }
  };

  const loadQuestions = async (quizId: string) => {
    if (!quizId) return;
    const res = await api.get(`/questions/quiz/${quizId}`);
    setQuestions(res.data.data || []);
  };

  useEffect(() => { loadAdminData(); }, []);
  useEffect(() => { if (grammarLevel) loadGrammars(grammarLevel); }, [grammarLevel]);
  useEffect(() => { if (questionQuizId) loadQuestions(questionQuizId); }, [questionQuizId]);

  useEffect(() => {
    const t = topics.find(t => t._id === editTopicId);
    if (t) { setTopicTitle(t.title); setTopicOrder(t.order || 1); setTopicLevel(t.level || "A2"); }
  }, [editTopicId, topics]);


  useEffect(() => {
    const q = quizzes.find(q => q._id === editQuizId);
    if (q) { setQuizTitle(q.title); setQuizScopeType(q.scopeType || "LESSON"); setQuizScopeId(q.scopeId || ""); setQuizPassScore(q.passScore || 70); }
  }, [editQuizId, quizzes]);

  useEffect(() => {
    const q = questions.find(item => item._id === editQuestionId);
    if (q) {
      setQuestion(q.question);
      setOptions(q.options ? q.options.join(", ") : "");
      setCorrectAnswer(q.correctAnswer || "");
      setQSourceType(q.sourceType || "CUSTOM");
      setQType(q.type || "MCQ");
    }
  }, [editQuestionId, questions]);

  useEffect(() => {
    const v = vocabularies.find(item => item._id === editVocabId);
    if (v) {
      setWord(v.word);
      setMeaning(v.meaning);
      setExample(v.example || "");
      setPhonetic(v.phonetic || "");
      setVocabTopicId(v.topicId);
    }
  }, [editVocabId, vocabularies]);

  useEffect(() => {
    const g = grammars.find(item => item._id === editGrammarId);
    if (g) {
      setGrammarTitle(g.title);
      setGrammarDesc(g.description);
      setGrammarEx(g.examples ? g.examples.join(", ") : "");
      setGrammarLevel(g.level || "A1");
    }
  }, [editGrammarId, grammars]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: null }), 3000);
  };

  const handleAction = async (method: "POST" | "PATCH" | "DELETE", url: string, data?: any) => {
    try {
      let message = "";
      if (method === "POST") {
        await api.post(url, data);
        message = "Thêm thành công!";
      }
      else if (method === "PATCH") {
        await api.patch(url, data);
        message = "Cập nhật thành công!";
      }
      else if (method === "DELETE") {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        await api.delete(url);
        message = "Xóa thành công!";
      }

      if (message) showNotification(message, "success");

      loadAdminData();
      if (activeTab === "grammar") loadGrammars(grammarLevel);
      if (questionQuizId) loadQuestions(questionQuizId);

      // Reset forms
      if (url.includes("vocabulary")) {
        setWord("");
        setMeaning("");
        setExample("");
        setPhonetic("");
        setEditVocabId("");
      } else if (url === "/grammar" || (url.includes("/grammar/") && !url.includes("grammar-"))) {
        setGrammarTitle("");
        setGrammarDesc("");
        setGrammarEx("");
        setEditGrammarId("");
      } else if (url.includes("questions")) {
        setQuestion("");
        setOptions("");
        setCorrectAnswer("");
        setQSourceType("CUSTOM");
        setQType("MCQ");
        setEditQuestionId("");
      } else if (url.includes("grammar-topics") && method !== "DELETE") {
        setTopicTitle("");
        setEditTopicId("");
      }
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const navItems = [
    { id: "topics", label: "Chủ Đề", icon: <Layout size={24} /> },
    { id: "vocabulary", label: "Từ Vựng", icon: <Layers size={24} /> },
    { id: "grammar", label: "Ngữ Pháp", icon: <ChevronDown size={24} /> },
    { id: "quizzes", label: "Bài Kiểm Tra", icon: <List size={24} /> },
    { id: "questions", label: "Câu Hỏi", icon: <HelpCircle size={24} /> },
  ];

  const logout = () => { clearAuth(); navigate("/login"); };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* ─── Sidebar ─────────────────────────────────────────────────── */}
      <aside style={{
        width: "220px",
        minHeight: "100vh",
        background: "white",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "40px", padding: "0 8px" }}
          onClick={() => navigate("/")}
        >
          <div style={{ background: "var(--primary)", borderRadius: "10px", padding: "8px", display: "flex" }}>
            <Globe size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "17px", color: "#1e293b" }}>EnglishHub</span>
        </div>

        {/* Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Section)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "16px 8px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? "#eef2ff" : "transparent",
                  color: isActive ? "var(--primary)" : "#94a3b8",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "12px",
                  transition: "all 0.2s",
                  width: "100%",
                }}
              >
                <span style={{ color: isActive ? "var(--primary)" : "#94a3b8" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 16px", borderRadius: "12px", border: "none",
              cursor: "pointer", background: "transparent", color: "#ef4444",
              fontWeight: 600, fontSize: "13px", width: "100%", textAlign: "left",
            }}
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <main style={{ marginLeft: "220px", flex: 1, padding: "40px 48px", minHeight: "100vh" }}>
        {/* Page Header */}
        <header style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 700, fontSize: "13px", marginBottom: "8px", letterSpacing: "0.5px" }}>
            <ShieldCheck size={16} /> QUẢN TRỊ VIÊN
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "#1e293b", margin: 0 }}>Admin Studio</h1>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "16px" }}>Thiết kế trải nghiệm học tập đỉnh cao.</p>
        </header>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification.type && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: "fixed",
                top: 0,
                left: "50%",
                zIndex: 100,
                background: notification.type === "success" ? "#10b981" : "#ef4444",
                color: "white",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ───── TOPICS ───── */}
          {activeTab === "topics" && (
            <motion.div key="topics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Chủ Đề</h2>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Tên chủ đề</label>
                  <input style={inputStyle} placeholder="VD: Travel, Work..." value={topicTitle} onChange={e => setTopicTitle(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Thứ tự</label>
                    <input style={inputStyle} type="number" value={topicOrder} onChange={e => setTopicOrder(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Cấp độ (A1-C2)</label>
                    <select style={inputStyle} value={topicLevel} onChange={e => setTopicLevel(e.target.value)}>
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                {!editTopicId ? (
                  <button
                    onClick={() => handleAction("POST", "/grammar-topics", { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                  >
                    <Plus size={18} /> Thêm mới
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleAction("PATCH", `/grammar-topics/${editTopicId}`, { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true })}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                    >
                      <Save size={18} /> Lưu thay đổi
                    </button>
                    <button onClick={() => { setEditTopicId(""); setTopicTitle(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                  </div>
                )}
              </div>

              {/* List */}
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Các chủ đề hiện có</h3>
                  <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{topics.length} CHỦ ĐỀ</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {topics.map((t, i) => (
                    <div key={t._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa", transition: "all 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#e0e7ff")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#f1f5f9")}
                    >
                      <span style={{ width: "28px", height: "28px", background: "#eef2ff", color: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "16px" }}>{t.title}</div>
                        <span style={{ background: "#eef2ff", color: "var(--primary)", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "99px" }}>Level {t.level}</span>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setEditTopicId(t._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={15} /></button>
                        <button onClick={() => handleAction("DELETE", `/grammar-topics/${t._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {topics.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có chủ đề nào.</p>}
                </div>
              </div>
            </motion.div>
          )}


          {/* ───── VOCABULARY ───── */}
          {activeTab === "vocabulary" && (
            <motion.div key="vocabulary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
                {/* Left: Form */}
                <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>
                    {editVocabId ? "Cập Nhật Từ Vựng" : "Thêm Từ Vựng"}
                  </h2>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Chọn chủ đề</label>
                    <select style={inputStyle} value={vocabTopicId} onChange={e => setVocabTopicId(e.target.value)}>
                      {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={labelStyle}>Từ (Word)</label>
                      <input style={inputStyle} value={word} onChange={e => setWord(e.target.value)} placeholder="VD: accountant" />
                    </div>
                    <div>
                      <label style={labelStyle}>Nghĩa (Meaning)</label>
                      <input style={inputStyle} value={meaning} onChange={e => setMeaning(e.target.value)} placeholder="VD: kế toán viên" />
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Ví dụ (Example)</label>
                    <textarea style={{ ...inputStyle, resize: "none" }} rows={2} value={example} onChange={e => setExample(e.target.value)} placeholder="VD: She works as an accountant at a bank." />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Phiên âm (Tùy chọn)</label>
                    <input style={inputStyle} placeholder="VD: /əˈkaʊntənt/" value={phonetic} onChange={e => setPhonetic(e.target.value)} />
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => {
                        if (!vocabTopicId) return alert("Bạn chưa chọn chủ đề!");
                        if (!word || !meaning) return alert("Vui lòng nhập từ và nghĩa!");

                        const currentTopic = topics.find(t => t._id === vocabTopicId);
                        const payload = {
                          topicId: vocabTopicId,
                          word,
                          meaning,
                          example: example || "No example",
                          topic: currentTopic?.title || "General",
                          level: currentTopic?.level || "A1",
                          phonetic,
                        };

                        if (editVocabId) {
                          handleAction("PATCH", `/vocabulary/${editVocabId}`, payload);
                        } else {
                          handleAction("POST", "/vocabulary", payload);
                        }
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                    >
                      {editVocabId ? <Save size={18} /> : <Plus size={18} />}
                      {editVocabId ? "Cập nhật" : "Lưu từ vựng"}
                    </button>
                    {editVocabId && (
                      <button 
                        onClick={() => { setEditVocabId(""); setWord(""); setMeaning(""); setExample(""); setPhonetic(""); }}
                        style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: List */}
                <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", maxHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "20px" }}>Danh Sách Từ Vựng</h3>
                    <div style={{ position: "relative" }}>
                      <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input 
                        style={{ ...inputStyle, paddingLeft: "40px", width: "240px", fontSize: "14px" }}
                        placeholder="Tìm kiếm từ vựng..."
                        value={vSearch}
                        onChange={e => setVSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {vocabularies
                        .filter(v => 
                          v.word.toLowerCase().includes(vSearch.toLowerCase()) || 
                          v.meaning.toLowerCase().includes(vSearch.toLowerCase())
                        )
                        .map((v) => (
                          <div 
                            key={v._id} 
                            style={{ 
                              display: "flex", alignItems: "center", gap: "16px", padding: "16px", 
                              borderRadius: "16px", border: "1.5px solid #f1f5f9", transition: "all 0.2s" 
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#f1f5f9"}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: "16px", color: "#1e293b" }}>{v.word}</div>
                              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "2px" }}>{v.meaning}</div>
                              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>{v.topic}</span>
                                <span style={{ fontSize: "11px", background: "#eef2ff", color: "var(--primary)", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>{v.level}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => setEditVocabId(v._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}>
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleAction("DELETE", `/vocabulary/${v._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      {vocabularies.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Chưa có từ vựng nào.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── GRAMMAR ───── */}
          {activeTab === "grammar" && (
            <motion.div key="grammar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
                {/* Left: Form */}
                <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>
                    {editGrammarId ? "Cập Nhật Ngữ Pháp" : "Thêm Ngữ Pháp"}
                  </h2>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Chọn cấp độ</label>
                    <select style={inputStyle} value={grammarLevel} onChange={e => setGrammarLevel(e.target.value)}>
                      {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Tiêu đề ngữ pháp</label>
                    <input style={inputStyle} value={grammarTitle} onChange={e => setGrammarTitle(e.target.value)} placeholder="VD: Present Simple" />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Mô tả</label>
                    <textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={grammarDesc} onChange={e => setGrammarDesc(e.target.value)} placeholder="Giải thích cấu trúc..." />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Ví dụ (ngăn cách bằng dấu phẩy)</label>
                    <textarea style={{ ...inputStyle, resize: "none" }} rows={2} value={grammarEx} onChange={e => setGrammarEx(e.target.value)} placeholder="VD: I am a student, You are a teacher..." />
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => {
                        if (!grammarLevel) return alert("Bạn chưa chọn cấp độ!");
                        if (!grammarTitle) return alert("Vui lòng nhập tiêu đề!");
                        const payload = {
                          level: grammarLevel,
                          title: grammarTitle,
                          description: grammarDesc,
                          examples: grammarEx.split(",").map(s => s.trim()).filter(s => s),
                        };
                        if (editGrammarId) {
                          handleAction("PATCH", `/grammar/${editGrammarId}`, payload);
                        } else {
                          handleAction("POST", "/grammar", payload);
                        }
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                    >
                      {editGrammarId ? <Save size={18} /> : <Plus size={18} />}
                      {editGrammarId ? "Cập nhật" : "Lưu ngữ pháp"}
                    </button>
                    {editGrammarId && (
                      <button onClick={() => { setEditGrammarId(""); setGrammarTitle(""); setGrammarDesc(""); setGrammarEx(""); }}
                        style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                    )}
                  </div>
                </div>

                {/* Right: List */}
                <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", maxHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "20px" }}>Danh Sách Ngữ Pháp</h3>
                    <div style={{ position: "relative" }}>
                      <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input style={{ ...inputStyle, paddingLeft: "40px", width: "240px", fontSize: "14px" }} placeholder="Tìm ngữ pháp..." value={gSearch} onChange={e => setGSearch(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {grammars
                        .filter(g => g.title.toLowerCase().includes(gSearch.toLowerCase()))
                        .map(g => (
                          <div key={g._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", border: "1.5px solid #f1f5f9" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: "16px" }}>{g.title}</div>
                              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{g.description.substring(0, 60)}...</div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => setEditGrammarId(g._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}><Edit2 size={16} /></button>
                              <button onClick={() => handleAction("DELETE", `/grammar/${g._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      {grammars.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Chưa có bài giảng nào.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "quizzes" && (
            <motion.div key="quizzes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Bài Kiểm Tra</h2>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Tiêu đề bài kiểm tra</label>
                  <input style={inputStyle} value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="VD: Quiz chương 1" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Phạm vi</label>
                    <select style={inputStyle} value={quizScopeType} onChange={e => { setQuizScopeType(e.target.value); setQuizScopeId(""); }}>
                      <option value="TOPIC">TOPIC</option>
                      <option value="LEVEL">LEVEL</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Chọn {quizScopeType === "TOPIC" ? "Chủ đề" : "Cấp độ"}</label>
                    {quizScopeType === "TOPIC" ? (
                      <select style={inputStyle} value={quizScopeId} onChange={e => setQuizScopeId(e.target.value)}>
                        <option value="">-- Chọn chủ đề --</option>
                        {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                      </select>
                    ) : (
                      <select style={inputStyle} value={quizScopeId} onChange={e => setQuizScopeId(e.target.value)}>
                        <option value="">-- Chọn cấp độ --</option>
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                {!editQuizId ? (
                  <button onClick={() => handleAction("POST", "/quiz", { scopeType: quizScopeType, scopeId: quizScopeId || undefined, title: quizTitle, passScore: quizPassScore, isPublished: true })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                    <Plus size={18} /> Tạo mới
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleAction("PATCH", `/quiz/${editQuizId}`, { scopeType: quizScopeType, scopeId: quizScopeId || undefined, title: quizTitle, passScore: quizPassScore, isPublished: true })}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                      <Save size={18} /> Cập nhật
                    </button>
                    <button onClick={() => setEditQuizId("")} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                  </div>
                )}
              </div>

              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Danh sách Quiz</h3>
                  <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{quizzes.length} QUIZ</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {quizzes.map(q => (
                    <div key={q._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{q.title}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>ID: {q._id}</div>
                      </div>
                      <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "99px" }}>{q.scopeType}</span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setEditQuizId(q._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={15} /></button>
                        <button onClick={() => handleAction("DELETE", `/quiz/${q._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {quizzes.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có quiz nào.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── QUESTIONS ───── */}
          {activeTab === "questions" && (
            <motion.div key="questions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Câu Hỏi</h2>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Chọn bài kiểm tra</label>
                  <select style={inputStyle} value={questionQuizId} onChange={e => setQuestionQuizId(e.target.value)}>
                    {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Nguồn câu hỏi</label>
                    <select style={inputStyle} value={qSourceType} onChange={e => setQSourceType(e.target.value)}>
                      <option value="CUSTOM">CUSTOM</option>
                      <option value="VOCAB">VOCAB</option>
                      <option value="GRAMMAR">GRAMMAR</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Loại câu hỏi</label>
                    <select style={inputStyle} value={qType} onChange={e => setQType(e.target.value)}>
                      <option value="MCQ">MCQ</option>
                      <option value="FILL">FILL</option>
                      <option value="LISTEN">LISTEN</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Câu hỏi</label>
                  <input style={inputStyle} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Nhập nội dung câu hỏi..." />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Các lựa chọn (ngăn cách bằng dấu phẩy)</label>
                  <input style={inputStyle} placeholder="VD: Option A, Option B, Option C, Option D" value={options} onChange={e => setOptions(e.target.value)} />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Đáp án đúng</label>
                  <input style={inputStyle} value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Nhập đáp án đúng..." />
                </div>
                {!editQuestionId ? (
                  <button onClick={() => handleAction("POST", "/questions", { quizId: questionQuizId, sourceType: qSourceType, question, options: options.split(",").map(o => o.trim()), correctAnswer, type: qType })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                    <Plus size={18} /> Thêm câu hỏi
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleAction("PATCH", `/questions/${editQuestionId}`, { quizId: questionQuizId, sourceType: qSourceType, question, options: options.split(",").map(o => o.trim()), correctAnswer, type: qType })}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                      <Save size={18} /> Cập nhật
                    </button>
                    <button onClick={() => setEditQuestionId("")} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                  </div>
                )}
              </div>

              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Danh sách câu hỏi</h3>
                  <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{questions.length} CÂU</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {questions.map((q, idx) => (
                    <div key={q._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
                      <span style={{ width: "28px", height: "28px", background: "#eef2ff", color: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>{idx + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question}</div>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setEditQuestionId(q._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={15} /></button>
                        <button onClick={() => handleAction("DELETE", `/questions/${q._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có câu hỏi nào.</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
