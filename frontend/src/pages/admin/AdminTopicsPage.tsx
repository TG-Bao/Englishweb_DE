import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../../api/client";
import { topicService } from "../../services/TopicService";
import { levelService, LevelItem } from "../../services/LevelService";

interface Topic { _id: string; title: string; order?: number; level?: string; }

export const AdminTopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levelsData, setLevelsData] = useState<LevelItem[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicOrder, setTopicOrder] = useState(1);
  const [topicLevel, setTopicLevel] = useState("A2");
  const [editTopicId, setEditTopicId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadData = async () => {
    try {
      const [topicRes, levelRes] = await Promise.all([topicService.getAll(), levelService.getAll()]);
      setTopics(topicRes || []);
      setLevelsData(levelRes || []);
    } catch (err) {
      console.error("Load data failed", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const t = topics.find(t => t._id === editTopicId);
    if (t) { setTopicTitle(t.title); setTopicOrder(t.order || 1); setTopicLevel(t.level || "A2"); }
  }, [editTopicId, topics]);

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
      
      setTopicTitle("");
      setEditTopicId("");
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
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Chủ Đề</h2>
        <div style={{ marginBottom: "20px" }}><label style={labelStyle}>Tên chủ đề</label><input style={inputStyle} placeholder="VD: Travel, Work..." value={topicTitle} onChange={e => setTopicTitle(e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div><label style={labelStyle}>Thứ tự</label><input style={inputStyle} type="number" value={topicOrder} onChange={e => setTopicOrder(Number(e.target.value))} /></div>
          <div><label style={labelStyle}>Cấp độ</label><select style={inputStyle} value={topicLevel} onChange={e => setTopicLevel(e.target.value)}>
            {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
          </select></div>
        </div>
        {!editTopicId ? (
          <button onClick={() => handleAction("POST", "/topics", { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Plus size={18} /> Thêm mới</button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => handleAction("PATCH", `/topics/${editTopicId}`, { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Save size={18} /> Lưu thay đổi</button>
            <button onClick={() => { setEditTopicId(""); setTopicTitle(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Các chủ đề hiện có</h3>
          <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{topics.length} CHỦ ĐỀ</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {topics.map((t, i) => (
            <div key={t._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#fafafa", transition: "all 0.15s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = "#e0e7ff")} onMouseLeave={e => (e.currentTarget.style.borderColor = "#f1f5f9")}>
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
  );
};
