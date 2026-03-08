import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Calendar, MapPin, Edit2, Lock, Save, CheckCircle2, AlertCircle, Trophy, BookOpen, Target, Flag } from "lucide-react";
import { getUser, updateUser as updateStoredUser } from "../utils/auth";
import { api } from "../api/client";

const ProfilePage = () => {
  const user = getUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" as "success" | "error" });

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
    gender: user?.gender || "MALE",
    targetLevel: user?.targetLevel || "B1",
    learningGoal: user?.learningGoal || "",
    avatarUrl: user?.avatarUrl || "",
  });

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showMsg = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.patch("/auth/profile", formData);
      // Backend returns the full updated user object
      updateStoredUser(res.data.data);
      setIsEditing(false);
      showMsg("Cập nhật thông tin thành công!");
    } catch (err: any) {
      showMsg(err.response?.data?.message || "Cập nhật thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMsg("Mật khẩu xác nhận không khớp", "error");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/change-password", { oldPassword, newPassword });
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showMsg("Đổi mật khẩu thành công!");
    } catch (err: any) {
      showMsg(err.response?.data?.message || "Đổi mật khẩu thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
  };

  const statCardStyle = {
    flex: 1,
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  return (
    <AppShell>
      <div className="container" style={{ padding: '60px 0' }}>
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)",
                zIndex: 1000, background: message.type === "success" ? "#10b981" : "#ef4444",
                color: "white", padding: "12px 24px", borderRadius: "99px",
                display: "flex", alignItems: "center", gap: "8px", fontWeight: 600,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
            >
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Main Info Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', marginBottom: '32px' }}>
            {/* Profile Avatar Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
              style={{ padding: '48px 32px', textAlign: 'center' }}
            >
              <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: user?.avatarUrl ? `url(${user.avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), #6366f1)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '48px', fontWeight: '800',
              boxShadow: '0 12px 30px rgba(79, 70, 229, 0.3)',
              overflow: 'hidden'
            }}>
              {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || <User size={56} />)}
            </div>

              <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#1e293b', fontWeight: 800 }}>{user?.name}</h1>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>{user?.email}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#eef2ff', color: 'var(--primary)', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>
                  Trình độ: {user?.level || "A1"}
                </div>
                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>
                  {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Học viên'}
                </div>
              </div>
            </motion.div>

            {/* Statistics Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={statCardStyle}>
                  <div style={{ background: '#fef3c7', color: '#d97706', borderRadius: '12px', padding: '12px' }}><Trophy size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Điểm tích lũy</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{user?.points || 0}</div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={statCardStyle}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', borderRadius: '12px', padding: '12px' }}><BookOpen size={24} /></div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Bài học đã xong</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{user?.totalLessons || 0}</div>
                  </div>
                </motion.div>
              </div>

              {/* Targets Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="card" style={{ padding: '24px', flex: 1 }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="var(--primary)" /> Mục tiêu học tập
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>CẤP ĐỘ MỤC TIÊU</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '18px' }}>{user?.targetLevel || "Chưa đặt"}</div>
                  </div>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>LÝ DO HỌC</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{user?.learningGoal || "Chưa cập nhật"}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
            style={{ padding: '40px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Thông tin cá nhân</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px' }}
                >
                  <Edit2 size={16} /> Chỉnh sửa
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '8px 20px' }}>Hủy</button>
                   <button onClick={handleUpdateProfile} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px' }}>
                     <Save size={16} /> Lưu thay đổi
                   </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Họ và tên</label>
                    <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Ảnh đại diện (URL)</label>
                    <input style={inputStyle} value={formData.avatarUrl} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} placeholder="https://example.com/photo.jpg" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Trình độ mục tiêu</label>
                    <select style={inputStyle} value={formData.targetLevel} onChange={e => setFormData({...formData, targetLevel: e.target.value})}>
                      {["A1", "A2", "B1", "B2", "C1", "C2"].map(L => <option key={L} value={L}>{L}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Lý do học tập</label>
                    <input style={inputStyle} value={formData.learningGoal} onChange={e => setFormData({...formData, learningGoal: e.target.value})} placeholder="VD: Để đi du học, Thăng tiến..." />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Giới thiệu bản thân</label>
                  <textarea 
                    style={{ ...inputStyle, resize: 'none' }} 
                    rows={3} 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Viết vài dòng giới thiệu về bạn..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Số điện thoại</label>
                    <input style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="VD: 0987654321" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Giới tính</label>
                    <select style={inputStyle} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Địa chỉ</label>
                  <input style={inputStyle} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="VD: Hà Nội, Việt Nam" />
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div style={{ display: 'grid', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}><Phone size={20} /></div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Số điện thoại</div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.phone || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}><Mail size={20} /></div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Email liên hệ</div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.email}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}><MapPin size={20} /></div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Địa chỉ</div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.address || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}><Calendar size={20} /></div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Ngày tham gia</div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
               <button 
                 onClick={() => setShowPasswordModal(true)}
                 className="btn btn-secondary" 
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', border: 'none', background: 'none' }}
               >
                 <Lock size={16} /> Bảo mật & Đổi mật khẩu
               </button>
            </div>
          </motion.div>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowPasswordModal(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                style={{ position: 'relative', width: '100%', maxWidth: '450px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
              >
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#1e293b' }}>Đổi mật khẩu</h3>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.</p>
                
                <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Mật khẩu hiện tại</label>
                    <input type="password" style={inputStyle} value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Mật khẩu mới</label>
                    <input type="password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Xác nhận mật khẩu mới</label>
                    <input type="password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Hủy</button>
                    <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flex: 1 }}>
                      {isLoading ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
