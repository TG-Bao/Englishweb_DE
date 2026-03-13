import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";
import { Globe, LogOut, User as UserIcon, BookOpen, Mic, ChevronDown, Settings, ShieldCheck, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUser());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUser(getUser());
    window.addEventListener("user-updated", handleUpdate);
    
    // Khôi phục Dark mode từ LocalStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    return () => window.removeEventListener("user-updated", handleUpdate);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { 
      label: "Học tập", 
      dropdown: [
        { label: "Từ vựng", path: "/vocabulary", icon: <BookOpen size={18} /> },
        { label: "Ngữ pháp", path: "/grammar", icon: <ShieldCheck size={18} /> },
      ]
    },
    { 
      label: "Nghe nói", 
      dropdown: [
        { label: "Luyện nghe", path: "/listening", icon: <Globe size={18} /> },
        { label: "Luyện nói", path: "/speaking", icon: <Mic size={18} /> },
      ]
    },
    { label: "Quiz", path: "/quiz" },
    { label: "Tiến độ", path: "/progress" },
  ];

  return (
    <div className="app">
      {!isAuthPage && (
        <header className="navbar">
          <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <div className="brand" onClick={() => navigate("/")} style={{ cursor: 'pointer', flex: 1 }}>
              <Globe size={28} />
              <span style={{ 
                letterSpacing: '-0.025em',
                fontWeight: 900
              }}>EnglishHub</span>
            </div>
            
            <nav className="nav-links" style={{ display: 'flex', justifyContent: 'center' }}>
              {navItems.map((item, idx) => (
                item.dropdown ? (
                  <div key={idx} className="nav-item">
                    <span className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                      {item.label} <ChevronDown size={14} style={{ marginLeft: 4, opacity: 0.6 }} />
                    </span>
                    <div className="dropdown-menu">
                      {item.dropdown.map((sub, sIdx) => (
                        <div key={sIdx} className="dropdown-item" onClick={() => navigate(sub.path)}>
                          {sub.icon} {sub.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="nav-item">
                    <NavLink 
                      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} 
                      to={item.path!}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                      {item.label}
                    </NavLink>
                  </div>
                )
              ))}
            </nav>

            <div className="flex items-center gap-4" style={{ flex: 1, justifyContent: 'flex-end' }}>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="profile-menu-container">
                    <div className="avatar" style={{ 
                      background: user.avatarUrl ? `url(${user.avatarUrl}) center/cover no-repeat` : 'var(--primary)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {!user.avatarUrl && (user.name?.charAt(0).toUpperCase() || "U")}
                    </div>
                    <div className="dropdown-menu profile-dropdown">
                      <div className="dropdown-header">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/profile")}>
                        <UserIcon size={18} /> Hồ sơ người dùng
                      </div>
                      {user.role === "ADMIN" && (
                        <div className="dropdown-item" onClick={() => navigate("/admin")}>
                          <ShieldCheck size={18} /> Quản lý hệ thống
                        </div>
                      )}
                      <div className="dropdown-item" onClick={() => navigate("/settings")}>
                        <Settings size={18} /> Cài đặt
                      </div>
                      <div className="divider" style={{ margin: '8px 0' }}></div>
                      <div className="dropdown-item" onClick={logout} style={{ color: '#ef4444' }}>
                        <LogOut size={18} /> Đăng xuất
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </button>
                  <button className="btn btn-soft-gradient" onClick={() => navigate("/register")} style={{ padding: '8px 20px', fontSize: '14px', fontWeight: '600' }}>
                    Đăng ký
                  </button>
                  <button className="btn btn-ghost" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%', marginLeft: '8px' }}>
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppShell;
