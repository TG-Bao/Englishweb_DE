import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../../api/client";
import { levelService, LevelItem } from "../../services/LevelService";

export const AdminLevelsPage = () => {
  const [levelsData, setLevelsData] = useState<LevelItem[]>([]);
  const [levelName, setLevelName] = useState("");
  const [levelDesc, setLevelDesc] = useState("");
  const [levelMinPoints, setLevelMinPoints] = useState(0);
  const [levelOrder, setLevelOrder] = useState(1);
  const [editLevelId, setEditLevelId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadLevels = async () => {
    try {
      const res = await levelService.getAll();
      setLevelsData(res);
    } catch (err) {
      console.error("Load levels failed", err);
    }
  };

  useEffect(() => { loadLevels(); }, []);

  useEffect(() => {
    const lvl = levelsData.find(l => l._id === editLevelId);
    if (lvl) {
      setLevelName(lvl.name);
      setLevelDesc(lvl.description || "");
      setLevelMinPoints(lvl.minPoints || 0);
      setLevelOrder(lvl.order || 1);
    }
  }, [editLevelId, levelsData]);

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
      await loadLevels();

      setLevelName("");
      setLevelDesc("");
      setLevelMinPoints(0);
      setLevelOrder(1);
      setEditLevelId("");
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none", transition: "all 0.2s" };
  const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Notification */}
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 100, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", gap: "8px" }}
          >{notification.message}</motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Cấp Độ</h2>
        <div style={{ marginBottom: "20px" }}><label style={labelStyle}>Tên cấp độ (VD: A1, Beginner)</label><input style={inputStyle} value={levelName} onChange={e => setLevelName(e.target.value)} /></div>
        <div style={{ marginBottom: "20px" }}><label style={labelStyle}>Mô tả</label><input style={inputStyle} value={levelDesc} onChange={e => setLevelDesc(e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div><label style={labelStyle}>Điểm tối thiểu (Min Points)</label><input style={inputStyle} type="number" value={levelMinPoints} onChange={e => setLevelMinPoints(Number(e.target.value))} /></div>
          <div><label style={labelStyle}>Thứ tự (Order)</label><input style={inputStyle} type="number" value={levelOrder} onChange={e => setLevelOrder(Number(e.target.value))} /></div>
        </div>
        {!editLevelId ? (
          <button onClick={() => handleAction("POST", "/levels", { name: levelName, description: levelDesc, minPoints: levelMinPoints, order: levelOrder })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Plus size={18} /> Thêm cấp độ</button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => handleAction("PATCH", `/levels/${editLevelId}`, { name: levelName, description: levelDesc, minPoints: levelMinPoints, order: levelOrder })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Save size={18} /> Lưu thay đổi</button>
            <button onClick={() => { setEditLevelId(""); setLevelName(""); setLevelDesc(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontWeight: 800, fontSize: "17px" }}>Các cấp độ hiện có</h3>
          <span style={{ background: "#eef2ff", color: "var(--primary)", fontWeight: 700, fontSize: "12px", padding: "4px 12px", borderRadius: "99px" }}>{levelsData.length} CẤP ĐỘ</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {levelsData.map((lvl) => (
            <div key={lvl._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", border: "1.5px solid #f1f5f9" }}>
              <span style={{ width: "28px", height: "28px", background: "#eef2ff", color: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>{lvl.order}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>{lvl.name}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Min pts: {lvl.minPoints || 0} - {lvl.description}</div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={() => setEditLevelId(lvl._id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer" }}><Edit2 size={15} color="#64748b" /></button>
                <button onClick={() => handleAction("DELETE", `/levels/${lvl._id}`)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer" }}><Trash2 size={15} color="#ef4444" /></button>
              </div>
            </div>
          ))}
          {levelsData.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>Chưa có cấp độ nào.</p>}
        </div>
      </div>
    </motion.div>
  );
};
