import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout, Layers, BookOpen,
  ChevronDown, ShieldCheck, List, Globe, LogOut,
  FileText, Volume2, BarChart3, FolderOpen, GraduationCap, Users
} from "lucide-react";
import { clearAuth, getUser } from "../../utils/auth";
import { AnimatePresence, motion } from "framer-motion";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const navGroups = [
    {
      label: "NỘI DUNG",
      items: [
        { id: "levels", path: "/admin/levels", label: "Cấp Độ", icon: <Layers size={20} /> },
        { id: "topics", path: "/admin/topics", label: "Chủ Đề", icon: <Layout size={20} /> },
        { id: "lessons", path: "/admin/lessons", label: "Bài Học", icon: <FileText size={20} /> },
        { id: "sentences", path: "/admin/sentences", label: "Câu Văn", icon: <Volume2 size={20} /> },
      ]
    },
    {
      label: "KỸ NĂNG",
      items: [
        { id: "vocabulary", path: "/admin/vocabulary", label: "Từ Vựng", icon: <BookOpen size={20} /> },
        { id: "grammar", path: "/admin/grammar", label: "Ngữ Pháp", icon: <GraduationCap size={20} /> },
      ]
    },
    {
      label: "ĐÁNH GIÁ",
      items: [
        { id: "tests", path: "/admin/tests", label: "Đề Thi (Tests)", icon: <FolderOpen size={20} /> },
      ]
    },
    {
      label: "HỆ THỐNG",
      items: [
        { id: "users", path: "/admin/users", label: "Người Dùng", icon: <Users size={20} /> },
      ]
    },
  ];

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const currentPage = navGroups
    .flatMap(g => g.items)
    .find(item => location.pathname.startsWith(item.path));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      
      {/* ─── Sidebar ──────────────────────────────────────────── */}
      <aside style={{
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "fixed",
        top: 0, left: 0, zIndex: 40,
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        overflowY: "auto",
      }}>
        
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          onClick={() => navigate("/")}
        >
          <div style={{ background: "linear-gradient(135deg, #6c63ff, #5ac8fa)", borderRadius: "12px", padding: "10px", display: "flex", boxShadow: "0 8px 20px rgba(108,99,255,0.4)" }}>
            <Globe size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "16px", color: "white", letterSpacing: "-0.3px" }}>EnglishHub</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Admin Studio</div>
          </div>
        </div>

        {/* Nav Groups */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", padding: "0 12px", marginBottom: "8px" }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "11px 14px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(108,99,255,0.8), rgba(90,200,250,0.4))"
                          : "transparent",
                        color: isActive ? "white" : "rgba(255,255,255,0.55)",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "13.5px",
                        transition: "all 0.2s",
                        width: "100%",
                        textAlign: "left",
                        position: "relative",
                        boxShadow: isActive ? "0 4px 16px rgba(108,99,255,0.35)" : "none",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}}
                    >
                      <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                      {item.label}
                      {isActive && (
                        <span style={{ position: "absolute", right: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "white", boxShadow: "0 0 8px rgba(255,255,255,0.8)" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 14px", borderRadius: "12px", border: "none",
              cursor: "pointer", background: "transparent", color: "rgba(255,100,100,0.7)",
              fontWeight: 600, fontSize: "13.5px", width: "100%", textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#ff6464"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,100,0.7)"; }}
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ─── Main Content ──────────────────────────────────────── */}
      <main style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* Top Bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 40px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "rgba(100,116,139,0.5)", fontSize: "13px" }}>Admin</span>
              <span style={{ color: "#e2e8f0" }}>/</span>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>{currentPage?.label || "Dashboard"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "8px 16px", borderRadius: "100px", border: "1px solid #e2e8f0" }}>
              <ShieldCheck size={15} color="#6c63ff" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#6c63ff" }}>ADMIN</span>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #5ac8fa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", color: "white", cursor: "pointer" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "32px 40px" }}>
          {/* Page Title Block */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "4px", height: "28px", background: "linear-gradient(180deg, #6c63ff, #5ac8fa)", borderRadius: "99px" }} />
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#1e293b", margin: 0 }}>
                {currentPage?.label || "Admin Studio"}
              </h1>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
