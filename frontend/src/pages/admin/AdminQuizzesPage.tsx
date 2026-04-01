import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../../api/client";
import { topicService } from "../../services/TopicService";
import { lessonService, LessonItem } from "../../services/LessonService";

interface Topic { _id: string; title: string; }
interface Quiz { _id: string; title: string; scopeType?: string; scopeId?: string; passScore?: number; }

export const AdminQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizScopeType, setQuizScopeType] = useState("TOPIC");
  const [quizScopeId, setQuizScopeId] = useState("");
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [editQuizId, setEditQuizId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadData = async () => {
    try {
      const [quizRes, topicRes, lesRes] = await Promise.all([
        api.get("/quizzes/all"),
        topicService.getAll(),
        lessonService.getAll()
      ]);
      setQuizzes(quizRes.data.data || []);
      setTopics(topicRes || []);
      setLessons(lesRes || []);
      
      if (!quizScopeId) {
        if (quizScopeType === "TOPIC" && topicRes?.length > 0) setQuizScopeId(topicRes[0]._id);
        else if (quizScopeType === "LESSON" && lesRes?.length > 0) setQuizScopeId(lesRes[0]._id);
      }
    } catch (err) {
      console.error("Load quizzes failed", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (quizScopeType === "TOPIC" && topics.length > 0) setQuizScopeId(topics[0]._id);
    else if (quizScopeType === "LESSON" && lessons.length > 0) setQuizScopeId(lessons[0]._id);
  }, [quizScopeType, topics, lessons]);

  useEffect(() => {
    const q = quizzes.find(q => q._id === editQuizId);
    if (q) {
      setQuizTitle(q.title);
      setQuizScopeType(q.scopeType || "LESSON");
      setQuizScopeId(q.scopeId || "");
      setQuizPassScore(q.passScore || 70);
    }
  }, [editQuizId, quizzes]);

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
      } else if (method === "PATCH") {
        await api.patch(url, data);
        message = "Cập nhật thành công!";
      } else if (method === "DELETE") {
        if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
        await api.delete(url);
        message = "Xóa thành công!";
      }

      if (message) showNotification(message, "success");
      await loadData();
      
      setQuizTitle("");
      setEditQuizId("");
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none", transition: "all 0.2s" };
  const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 100, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", gap: "8px" }}
          >{notification.message}</motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Bài Kiểm Tra</h2>
        <div style={{ marginBottom: "20px" }}><label style={labelStyle}>Tên bài kiểm tra</label><input style={inputStyle} value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="VD: Quiz Lesson 1" /></div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div><label style={labelStyle}>Loại (Scope)</label><select style={inputStyle} value={quizScopeType} onChange={e => setQuizScopeType(e.target.value)}>
            <option value="TOPIC">Topic</option>
            <option value="LESSON">Lesson</option>
          </select></div>
          <div><label style={labelStyle}>Phạm vi (Scope ID)</label><select style={inputStyle} value={quizScopeId} onChange={e => setQuizScopeId(e.target.value)}>
            {quizScopeType === "TOPIC" ? topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>) : lessons.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}
          </select></div>
          <div><label style={labelStyle}>Điểm qua (Pass Score %)</label><input style={inputStyle} type="number" value={quizPassScore} onChange={e => setQuizPassScore(Number(e.target.value))} /></div>
        </div>

        {!editQuizId ? (
          <button onClick={() => handleAction("POST", "/quizzes", { title: quizTitle, scopeType: quizScopeType, scopeId: quizScopeId, passScore: quizPassScore, isPublished: true })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Plus size={18} /> Thêm bài test</button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => handleAction("PATCH", `/quizzes/${editQuizId}`, { title: quizTitle, scopeType: quizScopeType, scopeId: quizScopeId, passScore: quizPassScore, isPublished: true })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Save size={18} /> Lưu thay đổi</button>
            <button onClick={() => { setEditQuizId(""); setQuizTitle(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontWeight: 800, fontSize: "17px", marginBottom: "20px" }}>Các bài kiểm tra ({quizzes.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {quizzes.map(q => (
            <div key={q._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>{q.title}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  {q.scopeType}: {q.scopeType === "TOPIC" ? topics.find(t=>t._id===q.scopeId)?.title : lessons.find(l=>l._id===q.scopeId)?.title} - Pass {q.passScore}%
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setEditQuizId(q._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b" }}><Edit2 size={16} /></button>
                <button onClick={() => handleAction("DELETE", `/quizzes/${q._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center" }}>Chưa có bài test nào.</p>}
        </div>
      </div>
    </motion.div>
  );
};
