import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Facebook, Chrome } from "lucide-react";
import { api } from "../api/client";
import { setAuth } from "../utils/auth";
import AppShell from "../components/AppShell";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      setAuth(token, user);
      navigate(user.role === "ADMIN" ? "/admin" : "/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Email hoặc mật khẩu không chính xác";
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
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập để tiếp tục hành trình học tiếng Anh</p>
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
              <label className="label">Email hoặc Tên đăng nhập</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  className="input" 
                  placeholder="Nhập email hoặc tên đăng nhập" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <div className="flex justify-between items-center mb-2">
                <label className="label" style={{ marginBottom: 0 }}>Mật khẩu</label>
                <a href="#" className="nav-link" style={{ fontSize: '13px', color: 'var(--primary)' }}>Quên mật khẩu?</a>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  className="input" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Nhập mật khẩu" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div 
                  className="input-icon" 
                  style={{ left: 'auto', right: '16px', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6" style={{ textAlign: 'left' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Ghi nhớ đăng nhập</label>
            </div>

            <button 
              className="btn btn-primary" 
              type="submit" 
              style={{ width: '100%', padding: '14px' }}
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="divider">
            <span>HOẶC TIẾP TỤC VỚI</span>
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
            Bạn chưa có tài khoản? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Đăng ký ngay</a>
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default LoginPage;
