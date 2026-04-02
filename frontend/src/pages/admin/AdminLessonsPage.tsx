import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, Upload } from "lucide-react";
import { api } from "../../api/client";
import { lessonService, LessonItem } from "../../services/LessonService";
import { levelService, LevelItem } from "../../services/LevelService";

export const AdminLessonsPage = () => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [levelsData, setLevelsData] = useState<LevelItem[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonImage, setLessonImage] = useState("");
  const [lessonLevelId, setLessonLevelId] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonIsPublished, setLessonIsPublished] = useState(false);
  const [editLessonId, setEditLessonId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadData = async () => {
    try {
      const [lesRes, lvlRes] = await Promise.all([lessonService.getAll(), levelService.getAll()]);
      setLessons(lesRes || []);
      setLevelsData(lvlRes || []);
      if (lvlRes?.length > 0 && !lessonLevelId) setLessonLevelId(lvlRes[0]._id);
    } catch (err) {
      console.error("Load data failed", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const l = lessons.find(l => l._id === editLessonId);
    if (l) {
      setLessonTitle(l.title);
      setLessonImage(l.image || "");
      setLessonLevelId(l.level_id || "");
      setLessonOrder(l.order || 1);
      setLessonIsPublished(l.isPublished !== false);
    }
  }, [editLessonId, lessons]);

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
      
      setLessonTitle("");
      setLessonImage("");
      setEditLessonId("");
    } catch (err: any) {
      console.error("Action failed", err);
      showNotification(err.response?.data?.message || "Thao tác thất bại!", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      showNotification("Đang tải ảnh lên...", "success");
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLessonImage(res.data.data.url);
      showNotification("Tải ảnh thành công!", "success");
    } catch (error) {
      console.error('Image upload failed', error);
      showNotification("Tải ảnh thất bại", "error");
    }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none", transition: "all 0.2s" };
  const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Cấu trúc UI tương tự AdminTopicsPage... */}
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 100, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", gap: "8px" }}
          >{notification.message}</motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Quản Lý Bài Học</h2>
        <div style={{ marginBottom: "20px" }}><label style={labelStyle}>Tên bài học</label><input style={inputStyle} value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} /></div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Ảnh đại diện</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={lessonImage} onChange={e => setLessonImage(e.target.value)} placeholder="URL ảnh..." />
            <div style={{ position: 'relative' }}>
              <button 
                type="button"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", background: "var(--primary-light)", color: "var(--primary)", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
              >
                <Upload size={18} /> Tải ảnh
              </button>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div><label style={labelStyle}>Sắp xếp</label><input style={inputStyle} type="number" value={lessonOrder} onChange={e => setLessonOrder(Number(e.target.value))} /></div>
          <div><label style={labelStyle}>Cấp độ (Level)</label><select style={inputStyle} value={lessonLevelId} onChange={e => setLessonLevelId(e.target.value)}>
            {levelsData.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
          </select></div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <div style={{ display: "flex", alignItems: "center", height: "45px", gap: "10px" }}>
              <input type="checkbox" checked={lessonIsPublished} onChange={e => setLessonIsPublished(e.target.checked)} style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "15px", fontWeight: 500 }}>Publish</span>
            </div>
          </div>
        </div>

        {!editLessonId ? (
          <button onClick={() => handleAction("POST", "/lessons", { title: lessonTitle, image: lessonImage, level_id: lessonLevelId, order: lessonOrder, isPublished: lessonIsPublished })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Plus size={18} /> Thêm mới</button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => handleAction("PATCH", `/lessons/${editLessonId}`, { title: lessonTitle, image: lessonImage, level_id: lessonLevelId, order: lessonOrder, isPublished: lessonIsPublished })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Save size={18} /> Lưu thay đổi</button>
            <button onClick={() => { setEditLessonId(""); setLessonTitle(""); setLessonImage(""); }} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontWeight: 800, fontSize: "17px", marginBottom: "20px" }}>Các bài học hiện có: {lessons.length}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {lessons.map(l => (
            <div key={l._id} style={{ display: "flex", gap: "16px", padding: "16px", borderRadius: "16px", border: "1.5px solid #f1f5f9", background: "#fafafa" }}>
              {l.image ? (
                <img src={l.image} alt="lesson" style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "#e2e8f0" }} />
              )}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontWeight: 700, fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Thứ tự: {l.order} {l.isPublished ? "· Public" : "· DRAFT"}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => setEditLessonId(l._id)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>Sửa</button>
                  <button onClick={() => handleAction("DELETE", `/lessons/${l._id}`)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
          {lessons.length === 0 && <p style={{ color: "#94a3b8" }}>Chưa có bài học nào.</p>}
        </div>
      </div>
    </motion.div>
  );
};
