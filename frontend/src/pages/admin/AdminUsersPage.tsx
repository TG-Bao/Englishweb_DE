import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Save, Trash2 } from "lucide-react";
import { userService, UserItem } from "../../services/UserService";
import { api } from "../../api/client";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [editUserId, setEditUserId] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<"USER" | "ADMIN">("USER");
  const [editUserIsActive, setEditUserIsActive] = useState(true);
  const [editUserPoints, setEditUserPoints] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    const u = users.find(u => u._id === editUserId);
    if (u) {
      setEditUserName(u.name);
      setEditUserEmail(u.email);
      setEditUserRole(u.role);
      setEditUserIsActive(u.isActive !== false);
      setEditUserPoints(u.points || 0);
    }
  }, [editUserId, users]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: null }), 3000);
  };

  const handleAction = async (method: "PATCH" | "DELETE", url: string, data?: any) => {
    try {
      let message = "";
      if (method === "PATCH") {
        await api.patch(url, data);
        message = "Cập nhật thành công!";
      } else if (method === "DELETE") {
         if (!window.confirm("Bạn có chắc chắn muốn xóa user này vĩnh viễn?")) return;
         await api.delete(url);
         message = "Xoá người dùng thành công!";
      }

      if (message) showNotification(message, "success");
      await loadUsers();
      
      setEditUserId("");
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
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Cập Nhật Người Dùng</h2>
          {!editUserId ? (
            <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Chọn người dùng từ danh sách để sửa.</div>
          ) : (
            <>
              <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Tên</label><input style={inputStyle} value={editUserName} onChange={e => setEditUserName(e.target.value)} /></div>
              <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Email</label><input style={inputStyle} value={editUserEmail} onChange={e => setEditUserEmail(e.target.value)} disabled /></div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div><label style={labelStyle}>Quyền (Role)</label><select style={inputStyle} value={editUserRole} onChange={e => setEditUserRole(e.target.value as "USER" | "ADMIN")}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select></div>
                <div><label style={labelStyle}>Điểm (Points)</label><input style={inputStyle} type="number" value={editUserPoints} onChange={e => setEditUserPoints(Number(e.target.value))} /></div>
              </div>

              <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" checked={editUserIsActive} onChange={e => setEditUserIsActive(e.target.checked)} style={{ width: "20px", height: "20px" }} />
                <span style={{ fontSize: "15px", fontWeight: 500 }}>Tài khoản đang hoạt động (Active)</span>
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => handleAction("PATCH", `/users/${editUserId}`, { name: editUserName, role: editUserRole, isActive: editUserIsActive, points: editUserPoints })} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}><Save size={18} /> Lưu thay đổi</button>
                <button onClick={() => setEditUserId("")} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
              </div>
            </>
          )}
        </div>

        <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "20px" }}>Tất cả người dùng ({users.length})</h3>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {users.map(u => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", border: "1.5px solid #f1f5f9", background: editUserId === u._id ? "#eff6ff" : "white", cursor: "pointer" }} onClick={() => setEditUserId(u._id)}>
                <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>{u.name.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b" }}>{u.name}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{u.email}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <span style={{ fontSize: "10px", padding: "2px 6px", background: u.role === "ADMIN" ? "#fee2e2" : "#f1f5f9", color: u.role === "ADMIN" ? "#ef4444" : "#475569", borderRadius: "4px", fontWeight: 700 }}>{u.role}</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", background: u.isActive !== false ? "#dcfce3" : "#fee2e2", color: u.isActive !== false ? "#10b981" : "#ef4444", borderRadius: "4px", fontWeight: 700 }}>{u.isActive !== false ? "ACTIVE" : "INACTIVE"}</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", background: "#fef3c7", color: "#d97706", borderRadius: "4px", fontWeight: 700 }}>Pts: {u.points || 0}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                   <button onClick={(e) => { e.stopPropagation(); handleAction("DELETE", `/users/${u._id}`); }} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
