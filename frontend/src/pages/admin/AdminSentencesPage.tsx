import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { lessonService, LessonItem } from "../../services/LessonService";
import { sentenceService, SentenceItem } from "../../services/SentenceService";

export const AdminSentencesPage = () => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  
  const [sentenceLessonId, setSentenceLessonId] = useState("");
  const [sentenceText, setSentenceText] = useState("");
  const [sentenceType, setSentenceType] = useState<"speaking" | "listening">("speaking");
  const [sentenceOrder, setSentenceOrder] = useState(1);
  const [editSentenceId, setEditSentenceId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadData = async () => {
    try {
      const [lesRes, senRes] = await Promise.all([
        lessonService.getAll(),
        sentenceService.getAll()
      ]);
      setLessons(lesRes || []);
      setSentences(senRes || []);
    } catch (err) {
      console.error("Load data failed", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (editSentenceId) {
      const sentence = sentences.find(s => s._id === editSentenceId);
      if (sentence) {
        setSentenceLessonId(sentence.lesson_id);
        setSentenceText(sentence.text);
        setSentenceType(sentence.type as "speaking" | "listening");
        setSentenceOrder(sentence.order || 1);
      }
    }
  }, [editSentenceId, sentences]);

  const showNotification = (msg: string, type: "success" | "error") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: null }), 3000);
  };

  const handleSentenceAction = async (method: "POST" | "PATCH" | "DELETE") => {
    try {
      if (method !== "DELETE") {
         if (!sentenceLessonId) return window.alert("Chọn bài học trước!");
         if (!sentenceText) return window.alert("Nhập câu văn!");
      }

      const data = {
        lesson_id: sentenceLessonId,
        text: sentenceText,
        type: sentenceType,
        order: sentenceOrder,
      };

      if (method === "POST") {
        await sentenceService.create(data);
        showNotification("Thêm câu văn thành công! (Audio sẽ được tạo tự động)", "success");
      } else if (method === "PATCH") {
        await sentenceService.update(editSentenceId, data);
        showNotification("Cập nhật câu văn thành công!", "success");
      } else if (method === "DELETE") {
        if (!window.confirm("Bạn có chắc muốn xóa?")) return;
        await sentenceService.delete(editSentenceId);
        showNotification("Xóa câu văn thành công!", "success");
      }

      setSentenceText("");
      setSentenceType("speaking");
      setSentenceOrder(1);
      setEditSentenceId("");
      await loadData();
    } catch (err) {
      showNotification("Thao tác thất bại!", "error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 100, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", gap: "8px" }}
          >{notification.message}</motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Form */}
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>
            {editSentenceId ? "Sửa Câu Văn" : "Thêm Câu Văn"}
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Chọn bài học</label>
            <select style={inputStyle} value={sentenceLessonId} onChange={e => setSentenceLessonId(e.target.value)}>
              <option value="">-- Chọn bài học --</option>
              {lessons.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Câu tiếng Anh</label>
            <textarea style={{ ...inputStyle, resize: "none", minHeight: "80px" }} value={sentenceText} onChange={e => setSentenceText(e.target.value)} placeholder="Nhập câu..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Loại</label>
              <select style={inputStyle} value={sentenceType} onChange={e => setSentenceType(e.target.value as any)}>
                <option value="speaking">Speaking</option>
                <option value="listening">Listening</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Thứ tự</label>
              <input style={inputStyle} type="number" value={sentenceOrder} onChange={e => setSentenceOrder(Number(e.target.value))} />
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "24px", padding: "12px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "3px solid #16a34a" }}>
            💡 Lưu ý: Phần mềm sẽ tự động tạo file audio từ text
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            {!editSentenceId ? (
              <button onClick={() => handleSentenceAction("POST")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                <Plus size={18} /> Thêm câu văn
              </button>
            ) : (
              <>
                <button onClick={() => handleSentenceAction("PATCH")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  <Save size={18} /> Cập nhật
                </button>
                <button onClick={() => handleSentenceAction("DELETE")} style={{ padding: "14px 20px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Xóa
                </button>
                <button onClick={() => { setEditSentenceId(""); setSentenceText(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", maxHeight: "600px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px" }}>Danh Sách Câu Văn ({sentences.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sentences.map((sentence, i) => (
              <div key={sentence._id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", borderRadius: "12px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
                <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "12px", marginTop: "4px", minWidth: "20px" }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", wordBreak: "break-word" }}>{sentence.text}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    {sentence.type === "speaking" ? "🎤" : "👂"} {sentence.type}
                  </div>
                  {sentence.audio_url && (
                    <audio controls controlsList="nodownload" style={{ width: "100%", marginTop: "8px", height: "24px", borderRadius: "4px" }} src={sentence.audio_url} />
                  )}
                </div>
                <button onClick={() => { setEditSentenceId(sentence._id); setSentenceText(sentence.text); setSentenceType(sentence.type as any); setSentenceOrder(sentence.order || 1); setSentenceLessonId(sentence.lesson_id); }} style={{ padding: "6px", borderRadius: "8px", border: "none", background: "#f1f5f9", cursor: "pointer", color: "#64748b", flexShrink: 0 }}><Edit2 size={14} /></button>
              </div>
            ))}
            {sentences.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có câu văn nào</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
