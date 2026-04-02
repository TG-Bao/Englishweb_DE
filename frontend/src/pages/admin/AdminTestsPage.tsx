import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { api } from "../../api/client";

interface TestQuestion {
  id: string;
  question: string;
  type: "MCQ" | "FILL";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  level: string;
  timeLimit: number;
  questions: TestQuestion[];
}

export const AdminTestsPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [editTestId, setEditTestId] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("A1");
  const [timeLimit, setTimeLimit] = useState(20);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  
  // Question Builder Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState("");
  const [qText, setQText] = useState("");
  const [qType, setQType] = useState<"MCQ" | "FILL">("MCQ");
  const [qOptions, setQOptions] = useState("");
  const [qAnswer, setQAnswer] = useState("");
  const [qExplain, setQExplain] = useState("");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadTests = async () => {
    try {
      const res = await api.get("/tests");
      setTests(res.data.data || []);
    } catch (err) {
      console.error("Load tests failed", err);
    }
  };

  useEffect(() => { loadTests(); }, []);

  useEffect(() => {
    const t = tests.find(item => item._id === editTestId);
    if (t) {
      setTitle(t.title);
      setDescription(t.description);
      setLevel(t.level);
      setTimeLimit(t.timeLimit || 20);
      setQuestions(t.questions || []);
    } else {
      setTitle("");
      setDescription("");
      setLevel("A1");
      setTimeLimit(20);
      setQuestions([]);
    }
  }, [editTestId, tests]);

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
      await loadTests();
      if (method !== "DELETE") setEditTestId("");
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const saveQuestion = () => {
    if (!qText || !qAnswer) return alert("Vui lòng điền đủ câu hỏi và đáp án!");
    if (qType === "MCQ" && !qOptions) return alert("Vui lòng điền lựa chọn cho câu trắc nghiệm!");

    const newQ: TestQuestion = {
      id: editingQuestionId || Math.random().toString(36).substr(2, 9),
      question: qText,
      type: qType,
      options: qType === "MCQ" ? qOptions.split(",").map(s => s.trim()) : undefined,
      correctAnswer: qAnswer,
      explanation: qExplain
    };

    if (editingQuestionId) {
      setQuestions(prev => prev.map(q => q.id === editingQuestionId ? newQ : q));
    } else {
      setQuestions(prev => [...prev, newQ]);
    }
    closeQuestionModal();
  };

  const editQuestion = (q: TestQuestion) => {
    setEditingQuestionId(q.id);
    setQText(q.question);
    setQType(q.type);
    setQOptions(q.options ? q.options.join(", ") : "");
    setQAnswer(q.correctAnswer);
    setQExplain(q.explanation || "");
    setIsQuestionModalOpen(true);
  };

  const removeQuestion = (id: string) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setEditingQuestionId("");
    setQText("");
    setQType("MCQ");
    setQOptions("");
    setQAnswer("");
    setQExplain("");
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

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* FORM BÊN TRÁI */}
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800 }}>{editTestId ? "Sửa Đề Thi Tổng Hợp" : "Tạo Đề Thi Mới"}</h2>
            {editTestId && <button onClick={() => setEditTestId("")} style={{ padding: "8px 16px", background: "#f1f5f9", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer" }}>Thêm mới</button>}
          </div>

          <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Tên Đề Thi</label><input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Đề thi thử đại học A1" /></div>
          <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Mô tả</label><textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={labelStyle}>Trình Độ (Level)</label>
              <select style={inputStyle} value={level} onChange={e => setLevel(e.target.value)}>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Thời gian (phút)</label><input style={inputStyle} type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} /></div>
          </div>

          {/* QUẢN LÝ CÂU HỎI */}
          <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Câu Hỏi ({questions.length})</h3>
              <button onClick={() => setIsQuestionModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#f0f9ff", color: "#0ea5e9", border: "1px solid #bae6fd", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}><Plus size={16} /> Thêm câu hỏi</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{i + 1}. {q.question}</div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => editQuestion(q)} style={{ padding: "6px", border: "none", background: "white", borderRadius: "6px", cursor: "pointer", color: "#64748b", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}><Edit2 size={14} /></button>
                      <button onClick={() => removeQuestion(q.id)} style={{ padding: "6px", border: "none", background: "#fee2e2", borderRadius: "6px", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {q.type === "MCQ" && <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Lựa chọn: {q.options?.join(", ")}</div>}
                  <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>Đáp án: {q.correctAnswer}</div>
                </div>
              ))}
              {questions.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center", fontSize: "14px" }}>Chưa có câu hỏi nào trong đề thi này.</p>}
            </div>
          </div>
          
          <button onClick={() => {
            const payload = { title, description, level, timeLimit, questions };
            editTestId ? handleAction("PATCH", `/tests/${editTestId}`, payload) : handleAction("POST", "/tests", payload);
          }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "16px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>{editTestId ? <><Save size={18}/> Lưu Đề Thi</> : <><Plus size={18}/> Tạo Đề Thi</>}</button>
        </div>

        {/* LIST BÊN PHẢI */}
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "20px" }}>Danh Sách Đề Thi ({tests.length})</h3>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {tests.map(t => (
              <div key={t._id} onClick={() => setEditTestId(t._id)} style={{ display: "flex", flexDirection: "column", padding: "16px", borderRadius: "16px", border: "2px solid", borderColor: editTestId === t._id ? "var(--primary)" : "#f1f5f9", background: editTestId === t._id ? "#f0f9ff" : "white", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "#1e293b" }}>{t.title}</div>
                  <button onClick={(e) => { e.stopPropagation(); handleAction("DELETE", `/tests/${t._id}`); }} style={{ padding: "6px", borderRadius: "8px", border: "none", background: "#fee2e2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.description}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", padding: "4px 8px", background: "#f1f5f9", borderRadius: "6px", fontWeight: 700 }}>Luật: {t.timeLimit}p</span>
                  <span style={{ fontSize: "11px", padding: "4px 8px", background: "#dcfce3", color: "#16a34a", borderRadius: "6px", fontWeight: 700 }}>Level {t.level}</span>
                  <span style={{ fontSize: "11px", padding: "4px 8px", background: "#fef3c7", color: "#d97706", borderRadius: "6px", fontWeight: 700 }}>{t.questions?.length || 0} câu</span>
                </div>
              </div>
            ))}
            {tests.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center" }}>Chưa có đề thi nào.</p>}
          </div>
        </div>
      </div>

      {/* QUESTION MODAL */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: "white", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "600px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 800 }}>{editingQuestionId ? "Sửa Câu Hỏi" : "Thêm Câu Hỏi Mới"}</h3>
                <button onClick={closeQuestionModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={24} /></button>
              </div>

              <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Câu hỏi</label><textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={qText} onChange={e => setQText(e.target.value)} /></div>
              
              <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Loại (Type)</label><select style={inputStyle} value={qType} onChange={e => setQType(e.target.value as any)}>
                <option value="MCQ">Trắc nghiệm (MCQ)</option>
                <option value="FILL">Điền vào chỗ trống (FILL)</option>
              </select></div>

              {qType === "MCQ" && (
                <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Các lựa chọn (Cách nhau bởi dấu phẩy)</label><input style={inputStyle} value={qOptions} onChange={e => setQOptions(e.target.value)} placeholder="VD: Apple, Banana, Orange" /></div>
              )}

              <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Đáp án đúng</label><input style={inputStyle} value={qAnswer} onChange={e => setQAnswer(e.target.value)} placeholder="VD: Apple" /></div>
              <div style={{ marginBottom: "32px" }}><label style={labelStyle}>Giải thích (Không bắt buộc)</label><input style={inputStyle} value={qExplain} onChange={e => setQExplain(e.target.value)} placeholder="VD: Vì Apple là quả táo..." /></div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={closeQuestionModal} style={{ padding: "12px 24px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                <button onClick={saveQuestion} style={{ padding: "12px 24px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Lưu câu hỏi</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
