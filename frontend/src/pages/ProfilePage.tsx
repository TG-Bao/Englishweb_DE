import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { getUser } from "../utils/auth";

const ProfilePage = () => {
  const user = getUser();
  
  return (
    <AppShell>
      <div className="container" style={{ padding: '80px 0' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px 40px' }}
        >
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), #6366f1)', 
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px', fontSize: '42px', fontWeight: '800',
            boxShadow: '0 12px 24px rgba(79, 70, 229, 0.3)'
          }}>
            {user?.name?.charAt(0).toUpperCase() || <User size={48} />}
          </div>
          
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{user?.name || "Người dùng"}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px' }}>{user?.email}</p>
          
          <div style={{ 
            textAlign: 'left', 
            background: 'var(--primary-light)', 
            padding: '24px', 
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)' 
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)' }}>Thông tin tài khoản</h3>
            <div style={{ display: 'grid', gap: '12px', fontSize: '15px' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Vai trò:</span>
                <span style={{ fontWeight: '600' }}>{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Ngày tham gia:</span>
                <span style={{ fontWeight: '600' }}>03/03/2026</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Trạng thái:</span>
                <span style={{ color: 'var(--green)', fontWeight: '600' }}>Đang hoạt động</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8 justify-center">
            <button className="btn btn-primary" style={{ padding: '12px 32px' }}>Chỉnh sửa hồ sơ</button>
            <button className="btn btn-secondary" style={{ padding: '12px 32px' }}>Đổi mật khẩu</button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
