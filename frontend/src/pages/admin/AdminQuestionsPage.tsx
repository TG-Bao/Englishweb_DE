import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../../api/client";

interface Quiz { _id: string; title: string; }
interface Question { _id: string; quizId: string; question: string; options?: string[]; correctAnswer?: string; sourceType?: string; type?: string; }

export const AdminQuestionsPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionQuizId, setQuestionQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [qSourceType, setQSourceType] = useState("CUSTOM");
  const [qType, setQType] = useState("MCQ");
  const [editQuestionId, setEditQuestionId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadQuizzes = async () => {
    try {
      const res = await api.get("/quizzes/all");
      setQuizzes(res.data.data || []);
      if (res.data.data?.length > 0 && !questionQuizId) {
        setQuestionQuizId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error("Load quizzes failed", err);
    }
  };

  const loadQuestions = async (quizId: string) => {
    if (!quizId) return;
    try {
      const res = await api.get(`/questions/quiz/${quizId}`);
      setQuestions(res.data.data || []);
    } catch (err) {
      console.error("Load questions failed", err);
    }
  };

  useEffect(() => { loadQuizzes(); }, []);
  useEffect(() => { if (questionQuizId) loadQuestions(questionQuizId); }, [questionQuizId]);

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
      await loadQuestions(questionQuizId);
      
      setQuestion("");
      setOptions("");
      setCorrectAnswer("");
      setQSourceType("CUSTOM");
      setQType("MCQ");
      setEditQuestionId("");
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>{editQuestionId ? "Sửa Câu Hỏi" : "Thêm Câu Hỏi"}</h2>
          <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Bài kiểm tra</label><select style={inputStyle} value={questionQuizId} onChange={e => setQuestionQuizId(e.target.value)}>
            {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
          </select></div>
          <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Câu hỏi</label><textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={question} onChange={e => setQuestion(e.target.value)} /></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div><label style={labelStyle}>Nguồn (Source)</label><select style={inputStyle} value={qSourceType} onChange={e => setQSourceType(e.target.value)}>
              <option value="CUSTOM">Custom</option>
              <option value="VOCABULARY">Vocabulary</option>
              <option value="GRAMMAR">Grammar</option>
            </select></div>
            <div><label style={labelStyle}>Loại (Type)</label><select style={inputStyle} value={qType} onChange={e => setQType(e.target.value)}>
              <option value="MCQ">Trắc nghiệm</option>
              <option value="FILL_IN_THE_BLANK">Điền từ</option>
            </select></div>
          </div>

          <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Lựa chọn (Cách nhau bởi dấu phẩy)</label><input style={inputStyle} value={options} onChange={e => setOptions(e.target.value)} placeholder="A, B, C, D" /></div>
          <div style={{ marginBottom: "24px" }}><label style={labelStyle}>Đáp án đúng</label><input style={inputStyle} value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} /></div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => {
              const payload = { quizId: questionQuizId, question, options: options.split(",").map(o=>o.trim()), correctAnswer, sourceType: qSourceType, type: qType };
              editQuestionId ? handleAction("PATCH", `/questions/${editQuestionId}`, payload) : handleAction("POST", "/questions", payload);
            }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>{editQuestionId ? <Save size={18} /> : <Plus size={18} />} {editQuestionId ? "Lưu" : "Thêm"}</button>
            {editQuestionId && <button onClick={() => { setEditQuestionId(""); setQuestion(""); setOptions(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "20px" }}>Danh sách câu hỏi ({questions.length})</h3>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {questions.map(q => (
              <div key={q._id} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px", borderRadius: "16px", border: "1.5px solid #f1f5f9" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "4px" }}>{q.question}</div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>Options: {q.options?.join(", ")}</div>
                  <div style={{ fontSize: "13px", color: "#10b981", fontWeight: 600, marginTop: "4px" }}>Correct: {q.correctAnswer}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditQuestionId(q._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}><Edit2 size={16} /></button>
                  <button onClick={() => handleAction("DELETE", `/questions/${q._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {questions.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center" }}>Chưa có câu hỏi.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
