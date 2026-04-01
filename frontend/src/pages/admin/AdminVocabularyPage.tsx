import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, Search, CheckCircle } from "lucide-react";
import { api } from "../../api/client";
import { topicService } from "../../services/TopicService";

interface Topic { _id: string; title: string; order?: number; level?: string; }
interface Vocabulary { _id: string; word: string; meaning: string; topic: string; level: string; example?: string; phonetic?: string; topicId: string; }

export const AdminVocabularyPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [vocabTopicId, setVocabTopicId] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [editVocabId, setEditVocabId] = useState("");
  const [vSearch, setVSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadData = async () => {
    try {
      const [topicRes, vocabRes] = await Promise.all([
        topicService.getAll(),
        api.get("/vocabularies")
      ]);
      setTopics(topicRes || []);
      setVocabularies(vocabRes.data.data || []);
      if (topicRes?.length > 0 && !vocabTopicId) {
        setVocabTopicId(topicRes[0]._id);
      }
    } catch (err) {
      console.error("Load data failed", err);
    }
  };

  useEffect(() => { loadData(); }, []);

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
      
      setWord("");
      setMeaning("");
      setExample("");
      setPhonetic("");
      setEditVocabId("");
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none", transition: "all 0.2s" };
  const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Cấu trúc UI tương tự AdminDashboard.tsx tab vocabulary */}
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 100, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", gap: "8px" }}
          >{notification.message}</motion.div>
        )}
      </AnimatePresence>

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
                  handleAction("PATCH", `/vocabularies/${editVocabId}`, payload);
                } else {
                  handleAction("POST", "/vocabularies", payload);
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
        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
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
                      <button onClick={() => handleAction("DELETE", `/vocabularies/${v._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
