import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Facebook, Chrome } from "lucide-react";
import { api } from "../api/client";
import { setAuth } from "../utils/auth";
import AppShell from "../components/AppShell";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password });
      setAuth(res.data.data.token, res.data.data.user);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="auth-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card auth-card"
        >
          <div className="auth-header">
            <h2>Tham gia cùng chúng tôi</h2>
            <p>Bắt đầu hành trình chinh phục tiếng Anh ngay hôm nay</p>
          </div>

          <form onSubmit={onSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  background: '#fef2f2', 
                  color: '#ef4444', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  marginBottom: '20px',
                  border: '1px solid #fee2e2'
                }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="label">Họ và Tên</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input 
                  className="input" 
                  placeholder="Nhập họ và tên của bạn" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  className="input" 
                  type="email"
                  placeholder="Nhập địa chỉ email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="label">Mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  className="input" 
                  type="password" 
                  placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              type="submit" 
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
            </button>
          </form>

          <div className="divider">
            <span>HOẶC ĐĂNG KÝ VỚI</span>
          </div>

          <div className="social-login">
            <button className="btn-social" disabled={isLoading}>
              <Chrome size={20} color="#EA4335" /> Google
            </button>
            <button className="btn-social" disabled={isLoading}>
              <Facebook size={20} color="#1877F2" /> Facebook
            </button>
          </div>

          <p className="mt-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Bạn đã có tài khoản? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Đăng nhập ngay</a>
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default RegisterPage;
