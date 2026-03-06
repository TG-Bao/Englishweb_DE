import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, BookOpen, Layers, HelpCircle, Plus, Edit2, Trash2,
  Save, Settings, Globe, LogOut, Moon, ChevronDown, ShieldCheck,
  List, Users, Star
} from "lucide-react";
import { clearAuth, getUser } from "../utils/auth";
import { userService, UserItem } from "../services/UserService";
import { topicService } from "../services/TopicService";
import { quizService } from "../services/QuizService";
import { levelService, LevelItem } from "../services/LevelService";

type Section = "levels" | "topics" | "lessons" | "vocabulary" | "quizzes" | "questions" | "users";

// Đã import UserItem từ UserService.ts

interface Topic { _id: string; title: string; order?: number; level?: string; }
interface Lesson { _id: string; title: string; order?: number; }
interface Quiz { _id: string; title: string; scopeType?: string; scopeId?: string; passScore?: number; }
interface Question { _id: string; question: string; options?: string[]; correctAnswer?: string; }

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState<Section>("topics");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [levelsData, setLevelsData] = useState<LevelItem[]>([]);

  const [levelName, setLevelName] = useState("");
  const [levelDesc, setLevelDesc] = useState("");
  const [levelMinPoints, setLevelMinPoints] = useState(0);
  const [levelOrder, setLevelOrder] = useState(1);
  const [editLevelId, setEditLevelId] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [editUserId, setEditUserId] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<"USER" | "ADMIN">("USER");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserBio, setEditUserBio] = useState("");
  const [editUserDob, setEditUserDob] = useState("");
  const [editUserGender, setEditUserGender] = useState("");
  const [editUserLevel, setEditUserLevel] = useState("");
  const [editUserTargetLevel, setEditUserTargetLevel] = useState("");
  const [editUserLearningGoal, setEditUserLearningGoal] = useState("");
  const [editUserIsActive, setEditUserIsActive] = useState(true);
  const [editUserAvatarUrl, setEditUserAvatarUrl] = useState("");
  const [editUserAddress, setEditUserAddress] = useState("");
  const [editUserPoints, setEditUserPoints] = useState(0);
  const [editUserTotalLessons, setEditUserTotalLessons] = useState(0);
  const [userMsg, setUserMsg] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicOrder, setTopicOrder] = useState(1);
  const [topicLevel, setTopicLevel] = useState("A2");
  const [editTopicId, setEditTopicId] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonTopicId, setLessonTopicId] = useState("");
  const [editLessonId, setEditLessonId] = useState("");

  const [vocabLessonId, setVocabLessonId] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [phonetic, setPhonetic] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizScopeType, setQuizScopeType] = useState("LESSON");
  const [quizScopeId, setQuizScopeId] = useState("");
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [editQuizId, setEditQuizId] = useState("");

  const [questionQuizId, setQuestionQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editQuestionId, setEditQuestionId] = useState("");

  const loadAdminData = async () => {
    try {
      const [topicsData, quizzesData, levelsRes] = await Promise.all([
        topicService.getAll(),
        quizService.getAll(),
        levelService.getAll()
      ]);
      setTopics(topicsData);
      setQuizzes(quizzesData);
      setLevelsData(levelsRes);
      if (topicsData.length > 0 && !lessonTopicId) setLessonTopicId(topicsData[0]._id);
      if (quizzesData.length > 0 && !questionQuizId) setQuestionQuizId(quizzesData[0]._id);
    } catch (err) {
      console.error("Failed to load admin data", err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const startEditUser = (u: UserItem) => {
    setEditUserId(u._id);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserRole(u.role);
    setEditUserPhone(u.phone || "");
    setEditUserBio(u.bio || "");
    setEditUserDob(u.dateOfBirth ? u.dateOfBirth.substring(0, 10) : "");
    setEditUserGender(u.gender || "");
    setEditUserLevel(u.level || "");
    setEditUserTargetLevel(u.targetLevel || "");
    setEditUserLearningGoal(u.learningGoal || "");
    setEditUserIsActive(u.isActive !== false);
    setEditUserAvatarUrl(u.avatarUrl || "");
    setEditUserAddress(u.address || "");
    setEditUserPoints(u.points || 0);
    setEditUserTotalLessons(u.totalLessons || 0);
    setUserMsg("");
  };

  const cancelEditUser = () => {
    setEditUserId("");
    setEditUserName("");
    setEditUserEmail("");
    setEditUserRole("USER");
    setEditUserPhone("");
    setEditUserBio("");
    setEditUserDob("");
    setEditUserGender("");
    setEditUserLevel("");
    setEditUserTargetLevel("");
    setEditUserLearningGoal("");
    setEditUserIsActive(true);
    setEditUserAvatarUrl("");
    setEditUserAddress("");
    setEditUserPoints(0);
    setEditUserTotalLessons(0);
    setUserMsg("");
  };

  const handleUpdateUser = async () => {
    try {
      await userService.update(editUserId, {
        name: editUserName,
        email: editUserEmail,
        role: editUserRole,
        phone: editUserPhone || undefined,
        bio: editUserBio || undefined,
        dateOfBirth: editUserDob || undefined,
        gender: editUserGender as any,
        level: editUserLevel || undefined,
        targetLevel: editUserTargetLevel || undefined,
        learningGoal: editUserLearningGoal || undefined,
        isActive: editUserIsActive,
        avatarUrl: editUserAvatarUrl || undefined,
        address: editUserAddress || undefined,
        points: Number(editUserPoints),
        totalLessons: Number(editUserTotalLessons),
      });
      setUserMsg("✅ Cập nhật thành công!");
      cancelEditUser();
      loadUsers();
    } catch (err: any) {
      setUserMsg("❌ " + (err?.response?.data?.message || "Lỗi cập nhật"));
    }
  };

  const handleToggleActive = async (u: UserItem) => {
    try {
      await userService.update(u._id, { isActive: !u.isActive });
      loadUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi thay đổi trạng thái");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Xác nhận xóa người dùng này?")) return;
    try {
      await userService.delete(id);
      loadUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi xóa người dùng");
    }
  };

  const loadLessons = async (topicId: string) => {
    if (!topicId) return;
    const res = await api.get(`/lessons/topic/${topicId}`);
    const data = res.data.data || [];
    setLessons(data);
    if (data.length > 0) setVocabLessonId(data[0]._id);
  };

  const loadQuestions = async (quizId: string) => {
    if (!quizId) return;
    const res = await api.get(`/questions/quiz/${quizId}`);
    setQuestions(res.data.data || []);
  };

  useEffect(() => { loadAdminData(); }, []);
  useEffect(() => { if (activeTab === "users") loadUsers(); }, [activeTab]);
  useEffect(() => { if (lessonTopicId) loadLessons(lessonTopicId); }, [lessonTopicId]);
  useEffect(() => { if (questionQuizId) loadQuestions(questionQuizId); }, [questionQuizId]);

  useEffect(() => {
    const t = topics.find(t => t._id === editTopicId);
    if (t) { setTopicTitle(t.title); setTopicOrder(t.order || 1); setTopicLevel(t.level || "A2"); }
  }, [editTopicId, topics]);

  useEffect(() => {
    const lvl = levelsData.find(l => l._id === editLevelId);
    if (lvl) {
      setLevelName(lvl.name);
      setLevelDesc(lvl.description || "");
      setLevelMinPoints(lvl.minPoints || 0);
      setLevelOrder(lvl.order || 1);
    }
  }, [editLevelId, levelsData]);

  useEffect(() => {
    const l = lessons.find(l => l._id === editLessonId);
    if (l) { setLessonTitle(l.title); setLessonOrder(l.order || 1); }
  }, [editLessonId, lessons]);

  useEffect(() => {
    const q = quizzes.find(q => q._id === editQuizId);
    if (q) { setQuizTitle(q.title); setQuizScopeType(q.scopeType || "LESSON"); setQuizScopeId(q.scopeId || ""); setQuizPassScore(q.passScore || 70); }
  }, [editQuizId, quizzes]);

  useEffect(() => {
    const q = questions.find(item => item._id === editQuestionId);
    if (q) { setQuestion(q.question); setOptions(q.options ? q.options.join(", ") : ""); setCorrectAnswer(q.correctAnswer || ""); }
  }, [editQuestionId, questions]);

  const handleAction = async (method: "POST" | "PATCH" | "DELETE", url: string, data?: any) => {
    try {
      if (method === "POST") await api.post(url, data);
      else if (method === "PATCH") await api.patch(url, data);
      else if (method === "DELETE") {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        await api.delete(url);
      }
      loadAdminData();
      if (lessonTopicId) loadLessons(lessonTopicId);
      if (questionQuizId) loadQuestions(questionQuizId);
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  const navItems = [
    { id: "levels", label: "Cấp Độ", icon: <Star size={24} /> },
    { id: "topics", label: "Chủ Đề", icon: <Layout size={24} /> },
    { id: "lessons", label: "Bài Học", icon: <BookOpen size={24} /> },
    { id: "vocabulary", label: "Từ Vựng", icon: <Layers size={24} /> },
    { id: "quizzes", label: "Bài Kiểm Tra", icon: <List size={24} /> },
    { id: "questions", label: "Câu Hỏi", icon: <HelpCircle size={24} /> },
    { id: "users", label: "Người Dùng", icon: <Users size={24} /> },
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

        <AnimatePresence mode="wait">
          {/* ───── LEVELS ───── */}
          {activeTab === "levels" && (
            <motion.div key="levels" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Cấp Độ</h2>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Tên cấp độ (VD: A1, Beginner)</label>
                  <input style={inputStyle} value={levelName} onChange={e => setLevelName(e.target.value)} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Mô tả</label>
                  <input style={inputStyle} value={levelDesc} onChange={e => setLevelDesc(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Điểm tối thiểu (Min Points)</label>
                    <input style={inputStyle} type="number" value={levelMinPoints} onChange={e => setLevelMinPoints(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Thứ tự (Order)</label>
                    <input style={inputStyle} type="number" value={levelOrder} onChange={e => setLevelOrder(Number(e.target.value))} />
                  </div>
                </div>
                {!editLevelId ? (
                  <button
                    onClick={() => handleAction("POST", "/levels", { name: levelName, description: levelDesc, minPoints: levelMinPoints, order: levelOrder })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                  >
                    <Plus size={18} /> Thêm cấp độ
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleAction("PATCH", `/levels/${editLevelId}`, { name: levelName, description: levelDesc, minPoints: levelMinPoints, order: levelOrder })}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                    >
                      <Save size={18} /> Lưu thay đổi
                    </button>
                    <button onClick={() => { setEditLevelId(""); setLevelName(""); setLevelDesc(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                  </div>
                )}
              </div>

              {/* List */}
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Các cấp độ hiện có</h3>
                  <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{levelsData.length} CẤP ĐỘ</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {levelsData.map((lvl) => (
                    <div key={lvl._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
                      <span style={{ width: "28px", height: "28px", background: "#eef2ff", color: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>{lvl.order}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "16px" }}>{lvl.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Min pts: {lvl.minPoints || 0} - {lvl.description}</div>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setEditLevelId(lvl._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={15} /></button>
                        <button onClick={() => handleAction("DELETE", `/levels/${lvl._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {levelsData.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có cấp độ nào.</p>}
                </div>
              </div>
            </motion.div>
          )}

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
                    <label style={labelStyle}>Cấp độ</label>
                    <select style={inputStyle} value={topicLevel} onChange={e => setTopicLevel(e.target.value)}>
                      {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                {!editTopicId ? (
                  <button
                    onClick={() => handleAction("POST", "/topics", { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                  >
                    <Plus size={18} /> Thêm mới
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleAction("PATCH", `/topics/${editTopicId}`, { title: topicTitle, order: topicOrder, level: topicLevel })}
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
                        <button onClick={() => handleAction("DELETE", `/topics/${t._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {topics.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có chủ đề nào.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── LESSONS ───── */}
          {activeTab === "lessons" && (
            <motion.div key="lessons" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Bài Học</h2>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Chọn chủ đề</label>
                  <select style={inputStyle} value={lessonTopicId} onChange={e => setLessonTopicId(e.target.value)}>
                    {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Tên bài học</label>
                    <input style={inputStyle} placeholder="VD: Lesson 1: Greetings" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Thứ tự</label>
                    <input style={inputStyle} type="number" value={lessonOrder} onChange={e => setLessonOrder(Number(e.target.value))} />
                  </div>
                </div>
                {!editLessonId ? (
                  <button onClick={() => handleAction("POST", "/lessons", { topicId: lessonTopicId, title: lessonTitle, order: lessonOrder, isPublished: true })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                    <Plus size={18} /> Thêm bài học
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleAction("PATCH", `/lessons/${editLessonId}`, { title: lessonTitle, order: lessonOrder, topicId: lessonTopicId })}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                      <Save size={18} /> Cập nhật
                    </button>
                    <button onClick={() => { setEditLessonId(""); setLessonTitle(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                  </div>
                )}
              </div>

              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Các bài học</h3>
                  <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{lessons.length} BÀI HỌC</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {lessons.map((l, i) => (
                    <div key={l._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
                      <span style={{ width: "28px", height: "28px", background: "#eef2ff", color: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>{i + 1}</span>
                      <div style={{ flex: 1, fontWeight: 700, fontSize: "16px" }}>{l.title}</div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => setEditLessonId(l._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={15} /></button>
                        <button onClick={() => handleAction("DELETE", `/lessons/${l._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {lessons.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có bài học nào.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── VOCABULARY ───── */}
          {activeTab === "vocabulary" && (
            <motion.div key="vocabulary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Thêm Từ Vựng</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Chọn chủ đề</label>
                    <select style={inputStyle} value={lessonTopicId} onChange={e => setLessonTopicId(e.target.value)}>
                      {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Chọn bài học</label>
                    <select style={inputStyle} value={vocabLessonId} onChange={e => setVocabLessonId(e.target.value)}>
                      {lessons.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}
                    </select>
                  </div>
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
                <button onClick={() => handleAction("POST", "/vocabulary", { lessonId: vocabLessonId, word, meaning, example, level: phonetic })}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                  <Plus size={18} /> Lưu từ vựng
                </button>
              </div>
            </motion.div>
          )}

          {/* ───── QUIZZES ───── */}
          {activeTab === "quizzes" && (
            <motion.div key="quizzes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Bài Kiểm Tra</h2>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Tiêu đề bài kiểm tra</label>
                  <input style={inputStyle} value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="VD: Quiz chương 1" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Phạm vi</label>
                    <select style={inputStyle} value={quizScopeType} onChange={e => setQuizScopeType(e.target.value)}>
                      <option value="LESSON">LESSON</option>
                      <option value="TOPIC">TOPIC</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>ID phạm vi</label>
                    <input style={inputStyle} value={quizScopeId} onChange={e => setQuizScopeId(e.target.value)} placeholder="ID bài học/chủ đề" />
                  </div>
                  <div>
                    <label style={labelStyle}>Điểm vượt qua (%)</label>
                    <input style={inputStyle} type="number" value={quizPassScore} onChange={e => setQuizPassScore(Number(e.target.value))} />
                  </div>
                </div>
                {!editQuizId ? (
                  <button onClick={() => handleAction("POST", "/quiz", { scopeType: quizScopeType, scopeId: quizScopeId || undefined, title: quizTitle, passScore: quizPassScore })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                    <Plus size={18} /> Tạo mới
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleAction("PATCH", `/quiz/${editQuizId}`, { scopeType: quizScopeType, scopeId: quizScopeId || undefined, title: quizTitle, passScore: quizPassScore })}
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
                  <button onClick={() => handleAction("POST", "/questions", { quizId: questionQuizId, sourceType: "CUSTOM", question, options: options.split(",").map(o => o.trim()), correctAnswer, type: "MCQ" })}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                    <Plus size={18} /> Thêm câu hỏi
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleAction("PATCH", `/questions/${editQuestionId}`, { question, options: options.split(",").map(o => o.trim()), correctAnswer })}
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

          {/* ───── USERS ───── */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* ── Edit form đầy đủ ── */}
              {editUserId && (
                <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", color: "#1e293b" }}>✏️ Chỉnh sửa hồ sơ người dùng</h2>

                  {/* Nhóm 1: Cơ bản */}
                  <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.5px", marginBottom: "14px" }}>THÔNG TIN CƠ BẢN</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={labelStyle}>Họ tên</label>
                        <input style={inputStyle} value={editUserName} onChange={e => setEditUserName(e.target.value)} placeholder="Tên người dùng" />
                      </div>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={editUserEmail} onChange={e => setEditUserEmail(e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Vai trò</label>
                        <select style={inputStyle} value={editUserRole} onChange={e => setEditUserRole(e.target.value as "USER" | "ADMIN")}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <label style={labelStyle}>URL ảnh đại diện</label>
                      <input style={inputStyle} value={editUserAvatarUrl} onChange={e => setEditUserAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" />
                    </div>
                  </div>

                  {/* Nhóm 2: Hồ sơ */}
                  <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", letterSpacing: "0.5px", marginBottom: "14px" }}>HỒ SƠ CÁ NHÂN</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <label style={labelStyle}>Số điện thoại</label>
                        <input style={inputStyle} value={editUserPhone} onChange={e => setEditUserPhone(e.target.value)} placeholder="0901234567" />
                      </div>
                      <div>
                        <label style={labelStyle}>Ngày sinh</label>
                        <input style={inputStyle} type="date" value={editUserDob} onChange={e => setEditUserDob(e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Giới tính</label>
                        <select style={inputStyle} value={editUserGender} onChange={e => setEditUserGender(e.target.value)}>
                          <option value="">-- Chọn --</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={labelStyle}>Địa chỉ</label>
                      <input style={inputStyle} value={editUserAddress} onChange={e => setEditUserAddress(e.target.value)} placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM" />
                    </div>
                    <div>
                      <label style={labelStyle}>Giới thiệu bản thân (Bio)</label>
                      <textarea style={{ ...inputStyle, resize: "none" }} rows={2} value={editUserBio} onChange={e => setEditUserBio(e.target.value)} placeholder="Viết vài dòng về bản thân..." />
                    </div>
                  </div>

                  {/* Nhóm 3: Học tập */}
                  <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.5px", marginBottom: "14px" }}>THÔNG TIN HỌC TẬP</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={labelStyle}>Cấp độ hiện tại</label>
                        <select style={inputStyle} value={editUserLevel} onChange={e => setEditUserLevel(e.target.value)}>
                          <option value="">-- Chọn --</option>
                          {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Cấp độ mục tiêu</label>
                        <select style={inputStyle} value={editUserTargetLevel} onChange={e => setEditUserTargetLevel(e.target.value)}>
                          <option value="">-- Chọn --</option>
                          {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Mục tiêu học tập</label>
                        <input style={inputStyle} value={editUserLearningGoal} onChange={e => setEditUserLearningGoal(e.target.value)} placeholder="VD: Du lịch, Công việc..." />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                      <div>
                        <label style={labelStyle}>Điểm tích lũy (Points)</label>
                        <input style={inputStyle} type="number" value={editUserPoints} onChange={e => setEditUserPoints(Number(e.target.value))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Số bài học đã xong</label>
                        <input style={inputStyle} type="number" value={editUserTotalLessons} onChange={e => setEditUserTotalLessons(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  {/* Nhóm 4: Trạng thái */}
                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.5px", marginBottom: "14px" }}>TRẠNG THÁI TÀI KHOẢN</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => setEditUserIsActive(!editUserIsActive)}
                        style={{
                          width: "52px", height: "28px", borderRadius: "14px", border: "none", cursor: "pointer",
                          background: editUserIsActive ? "#22c55e" : "#e2e8f0", position: "relative", transition: "background 0.2s"
                        }}
                      >
                        <span style={{
                          position: "absolute", top: "3px", left: editUserIsActive ? "26px" : "3px",
                          width: "22px", height: "22px", borderRadius: "50%", background: "white",
                          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                        }} />
                      </button>
                      <span style={{ fontWeight: 600, color: editUserIsActive ? "#16a34a" : "#ef4444", fontSize: "14px" }}>
                        {editUserIsActive ? "✅ Tài khoản đang hoạt động" : "🔒 Tài khoản bị khoá"}
                      </span>
                    </div>
                  </div>

                  {userMsg && (
                    <div style={{
                      marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                      background: userMsg.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
                      color: userMsg.startsWith("✅") ? "#16a34a" : "#ef4444"
                    }}>
                      {userMsg}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleUpdateUser}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                      <Save size={18} /> Lưu thay đổi
                    </button>
                    <button onClick={cancelEditUser}
                      style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* ── Users table ── */}
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>Danh Sách Người Dùng</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>
                      {users.length} NGƯỜI DÙNG
                    </span>
                    <button onClick={loadUsers}
                      style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#64748b" }}>
                      🔄 Làm mới
                    </button>
                  </div>
                </div>

                {/* Header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr 1.2fr auto", gap: "12px",
                  padding: "10px 16px", background: "#f8fafc", borderRadius: "10px", marginBottom: "8px",
                  fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px"
                }}>
                  <span>TÊN / EMAIL</span>
                  <span>VAI TRÒ / LEVEL</span>
                  <span>GIỚI TÍNH</span>
                  <span>NGÀY SINH / BIO</span>
                  <span>TRẠNG THÁI</span>
                  <span>ĐĂNG NHẬP / NGÀY TẠO</span>
                  <span>THAO TÁC</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {users.map(u => (
                    <div key={u._id}
                      style={{
                        display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr 1.2fr auto", gap: "12px",
                        alignItems: "center", padding: "14px 16px", borderRadius: "14px",
                        border: `1.5px solid ${u.isActive === false ? "#fecaca" : "#f1f5f9"}`,
                        background: u.isActive === false ? "#fff5f5" : "#fafafa",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#e0e7ff")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = u.isActive === false ? "#fecaca" : "#f1f5f9")}
                    >
                      {/* Tên + email + phone */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                          {u.avatarUrl
                            ? <img src={u.avatarUrl} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                            : <span style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,var(--primary),#6366f1)", color: "white", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{u.name.charAt(0).toUpperCase()}</span>
                          }
                          <div style={{ minWidth: 0 }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                            {u.phone && <div style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: 400 }}>📞 {u.phone}</div>}
                          </div>
                        </div>
                      </div>

                      {/* Role + Level + Mục tiêu */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, width: "fit-content",
                          background: u.role === "ADMIN" ? "#fef3c7" : "#ede9fe",
                          color: u.role === "ADMIN" ? "#d97706" : "#7c3aed"
                        }}>{u.role}</span>
                        {u.level ? (
                          <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, width: "fit-content", background: "#dbeafe", color: "#1d4ed8" }}>
                            📚 {u.level}{u.targetLevel ? ` → ${u.targetLevel}` : ""}
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Chưa xác định level</span>
                        )}
                        {u.learningGoal && <div style={{ fontSize: "11px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎯 {u.learningGoal}</div>}
                      </div>

                      {/* Giới tính */}
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        {u.gender === "MALE" ? "👨 Nam" : u.gender === "FEMALE" ? "👩 Nữ" : u.gender === "OTHER" ? "🧑 Khác" : <span style={{ color: "#cbd5e1" }}>—</span>}
                      </div>

                      {/* Ngày sinh + Bio */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                          {u.dateOfBirth
                            ? `🎂 ${new Date(u.dateOfBirth).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                            : <span style={{ color: "#e2e8f0" }}>Chưa có ngày sinh</span>}
                        </div>
                        {u.bio && (
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={u.bio}>
                            💬 {u.bio}
                          </div>
                        )}
                      </div>

                      {/* Trạng thái toggle nhanh */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button title={u.isActive !== false ? "Khoá tài khoản" : "Mở khoá tài khoản"} onClick={() => handleToggleActive(u)}
                          style={{
                            width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
                            background: u.isActive !== false ? "#22c55e" : "#e2e8f0", position: "relative", transition: "background 0.2s"
                          }}>
                          <span style={{
                            position: "absolute", top: "2px", left: u.isActive !== false ? "20px" : "2px",
                            width: "18px", height: "18px", borderRadius: "50%", background: "white",
                            transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                          }} />
                        </button>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: u.isActive !== false ? "#16a34a" : "#ef4444" }}>
                          {u.isActive !== false ? "Hoạt động" : "🔒 Khoá"}
                        </span>
                      </div>

                      {/* Đăng nhập cuối + Ngày tạo */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : <span style={{ color: "#cbd5e1" }}>Chưa đăng nhập</span>}
                        </div>
                        {u.createdAt && (
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            📅 Tạo: {new Date(u.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                          </div>
                        )}
                      </div>

                      {/* Thao tác */}
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => startEditUser(u)} title="Chỉnh sửa"
                          style={{ padding: "7px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)} title="Xóa"
                          style={{ padding: "7px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Chưa có người dùng nào.</p>
                  )}
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
