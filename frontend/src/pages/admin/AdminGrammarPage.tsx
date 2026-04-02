import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, Search, X, HelpCircle, BookOpen, ChevronRight } from "lucide-react";
import { api } from "../../api/client";
import { levelService, LevelItem } from "../../services/LevelService";

interface Grammar { _id: string; level: string; title: string; description: string; examples: string[]; }
interface ExerciseOption { _id: string; content: string; isCorrect: boolean; }
interface Exercise { _id: string; grammarId: string; question: string; type: "MCQ" | "FILL"; explanation?: string; options: ExerciseOption[]; }

type ActiveTab = "info" | "questions";
type PanelMode = "new" | "edit";

export const AdminGrammarPage = () => {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [levelsData, setLevelsData] = useState<LevelItem[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [panelMode, setPanelMode] = useState<PanelMode>("new");
  const [gSearch, setGSearch] = useState("");

  // Grammar Form
  const [grammarTitle, setGrammarTitle] = useState("");
  const [grammarDesc, setGrammarDesc] = useState("");
  const [grammarEx, setGrammarEx] = useState("");
  const [grammarLevel, setGrammarLevel] = useState("A1");

  // Exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exLoading, setExLoading] = useState(false);
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const [exQuestion, setExQuestion] = useState("");
  const [exType, setExType] = useState<"MCQ" | "FILL">("MCQ");
  const [exOptions, setExOptions] = useState("");
  const [exCorrect, setExCorrect] = useState("");
  const [exExplanation, setExExplanation] = useState("");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: null }), 3000);
  };

  const loadLevels = async () => {
    const res = await levelService.getAll();
    setLevelsData(res);
  };

  const loadGrammars = async (level: string) => {
    if (!level) return;
    const res = await api.get(`/grammars/level/${level}`);
    setGrammars(res.data.data || []);
  };

  const loadExercises = async (grammarId: string) => {
    setExLoading(true);
    try {
      const res = await api.get(`/grammar-exercises?grammarId=${grammarId}`);
      setExercises(res.data.data || []);
    } finally { setExLoading(false); }
  };

  useEffect(() => { loadLevels(); }, []);
  useEffect(() => { if (grammarLevel) loadGrammars(grammarLevel); }, [grammarLevel]);
  useEffect(() => {
    if (selectedGrammar) loadExercises(selectedGrammar._id);
    else setExercises([]);
  }, [selectedGrammar]);

  const selectGrammar = (g: Grammar) => {
    setSelectedGrammar(g);
    setPanelMode("edit");
    setActiveTab("info");
    setGrammarTitle(g.title);
    setGrammarDesc(g.description);
    setGrammarEx(g.examples?.join(", ") || "");
    setGrammarLevel(g.level);
  };

  const openNew = () => {
    setSelectedGrammar(null);
    setPanelMode("new");
    setActiveTab("info");
    setGrammarTitle("");
    setGrammarDesc("");
    setGrammarEx("");
  };

  const saveGrammar = async () => {
    if (!grammarTitle) return alert("Vui lòng nhập tiêu đề!");
    const payload = { level: grammarLevel, title: grammarTitle, description: grammarDesc, examples: grammarEx.split(",").map(s => s.trim()).filter(Boolean) };
    try {
      if (panelMode === "edit" && selectedGrammar) {
        await api.patch(`/grammars/${selectedGrammar._id}`, payload);
        showNotification("Cập nhật thành công!", "success");
        const updated = { ...selectedGrammar, ...payload };
        setSelectedGrammar(updated);
      } else {
        const res = await api.post("/grammars", payload);
        showNotification("Thêm thành công!", "success");
        const created = res.data.data;
        await loadGrammars(grammarLevel);
        if (created) selectGrammar(created);
      }
      await loadGrammars(grammarLevel);
    } catch (err: any) {
      showNotification(err.response?.data?.message || "Lỗi!", "error");
    }
  };

  const deleteGrammar = async (g: Grammar) => {
    if (!window.confirm(`Xóa "${g.title}"?`)) return;
    try {
      await api.delete(`/grammars/${g._id}`);
      showNotification("Đã xóa!", "success");
      if (selectedGrammar?._id === g._id) openNew();
      await loadGrammars(grammarLevel);
    } catch (err: any) { showNotification("Xóa thất bại!", "error"); }
  };

  const saveExercise = async () => {
    if (!selectedGrammar || !exQuestion) return;
    if (exType === "MCQ") {
      const opts = exOptions.split(",").map(s => s.trim()).filter(Boolean);
      if (opts.length < 2) return alert("Cần ít nhất 2 lựa chọn!");
      if (!exCorrect) return alert("Cần nhập đáp án đúng!");
      const options = opts.map(c => ({ content: c, isCorrect: c.trim() === exCorrect.trim() }));
      await api.post("/grammar-exercises", { grammarId: selectedGrammar._id, question: exQuestion, type: "MCQ", explanation: exExplanation || undefined, options });
    } else {
      await api.post("/grammar-exercises", { grammarId: selectedGrammar._id, question: exQuestion, type: "FILL", explanation: exCorrect || undefined });
    }
    showNotification("Đã thêm câu hỏi!", "success");
    closeExModal();
    loadExercises(selectedGrammar._id);
  };

  const deleteExercise = async (exId: string) => {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    await api.delete(`/grammar-exercises/${exId}`);
    showNotification("Đã xóa câu hỏi!", "success");
    if (selectedGrammar) loadExercises(selectedGrammar._id);
  };

  const closeExModal = () => {
    setIsExModalOpen(false);
    setExQuestion(""); setExType("MCQ"); setExOptions(""); setExCorrect(""); setExExplanation("");
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", outline: "none" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" } as const;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Toast */}
      <AnimatePresence>
        {notification.type && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 0, left: "50%", zIndex: 200, background: notification.type === "success" ? "#10b981" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" }}>

        {/* ═══════════════ LEFT: GRAMMAR LIST ═══════════════ */}
        <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
          {/* Header */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#1e293b" }}>Danh Sách Ngữ Pháp</h3>
              <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                <Plus size={14} /> Thêm mới
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input style={{ ...inputStyle, paddingLeft: "32px", fontSize: "13px" }} placeholder="Tìm ngữ pháp..." value={gSearch} onChange={e => setGSearch(e.target.value)} />
              </div>
              <select style={{ ...inputStyle, width: "auto", fontSize: "12px", color: "#374151", fontWeight: 700 }} value={grammarLevel} onChange={e => { setGrammarLevel(e.target.value); setSelectedGrammar(null); setPanelMode("new"); }}>
                {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {grammars.filter(g => g.title.toLowerCase().includes(gSearch.toLowerCase())).map(g => {
              const isSelected = selectedGrammar?._id === g._id;
              return (
                <div key={g._id}
                  onClick={() => selectGrammar(g)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", marginBottom: "6px", cursor: "pointer", border: "1.5px solid", borderColor: isSelected ? "var(--primary)" : "#f1f5f9", background: isSelected ? "#f5f3ff" : "white", transition: "all 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: isSelected ? "var(--primary)" : "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>{g.description}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteGrammar(g); }} style={{ padding: "5px", border: "none", background: "#fee2e2", borderRadius: "7px", cursor: "pointer", color: "#ef4444", flexShrink: 0 }}><Trash2 size={13} /></button>
                  <ChevronRight size={15} color={isSelected ? "var(--primary)" : "#cbd5e1"} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
            {grammars.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0", fontSize: "13px" }}>Chưa có ngữ pháp nào ở cấp độ này.</p>}
          </div>
        </div>

        {/* ═══════════════ RIGHT: DETAIL PANEL ═══════════════ */}
        <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
          
          {/* Panel Header */}
          <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#1e293b", margin: 0 }}>
                  {panelMode === "new" ? "Thêm Ngữ Pháp Mới" : selectedGrammar?.title}
                </h2>
                {panelMode === "edit" && <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>Level {selectedGrammar?.level}</p>}
              </div>
            </div>
            {/* Tabs — only show when editing existing grammar */}
            {panelMode === "edit" && (
              <div style={{ display: "flex", gap: "4px" }}>
                {([
                  { id: "info" as ActiveTab, label: "Thông Tin", icon: <BookOpen size={14} /> },
                  { id: "questions" as ActiveTab, label: `Câu Hỏi Bài Tập (${exercises.length})`, icon: <HelpCircle size={14} /> },
                ]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", background: "transparent", borderBottom: `2px solid ${activeTab === tab.id ? "var(--primary)" : "transparent"}`, color: activeTab === tab.id ? "var(--primary)" : "#94a3b8", marginBottom: "-1px", transition: "all 0.15s" }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Panel Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            <AnimatePresence mode="wait">

              {/* TAB: INFO / FORM */}
              {(panelMode === "new" || activeTab === "info") && (
                <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div style={{ display: "grid", gap: "16px", maxWidth: "640px" }}>
                    <div>
                      <label style={labelStyle}>Cấp độ</label>
                      <select style={inputStyle} value={grammarLevel} onChange={e => setGrammarLevel(e.target.value)}>
                        {levelsData.map(l => <option key={l._id} value={l.name}>{l.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Tiêu đề ngữ pháp</label>
                      <input style={inputStyle} value={grammarTitle} onChange={e => setGrammarTitle(e.target.value)} placeholder="VD: Present Simple" />
                    </div>
                    <div>
                      <label style={labelStyle}>Mô tả / Giải thích cấu trúc</label>
                      <textarea style={{ ...inputStyle, resize: "none", lineHeight: 1.6 } as any} rows={4} value={grammarDesc} onChange={e => setGrammarDesc(e.target.value)} placeholder="Giải thích ý nghĩa và cách dùng..." />
                    </div>
                    <div>
                      <label style={labelStyle}>Ví dụ (cách nhau bởi dấu phẩy)</label>
                      <textarea style={{ ...inputStyle, resize: "none" } as any} rows={3} value={grammarEx} onChange={e => setGrammarEx(e.target.value)} placeholder="I am a student, You are a teacher..." />
                    </div>
                    <div style={{ paddingTop: "8px" }}>
                      <button onClick={saveGrammar} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                        {panelMode === "edit" ? <><Save size={18} /> Lưu thay đổi</> : <><Plus size={18} /> Tạo ngữ pháp</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: QUESTIONS */}
              {panelMode === "edit" && activeTab === "questions" && (
                <motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ fontSize: "13px", color: "#64748b" }}>Câu hỏi cho bài: <strong>{selectedGrammar?.title}</strong></p>
                    <button onClick={() => setIsExModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: "#f0fdf4", color: "#10b981", border: "1px solid #86efac", borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                      <Plus size={14} /> Thêm câu hỏi
                    </button>
                  </div>

                  {exLoading ? (
                    <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>Đang tải...</p>
                  ) : exercises.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                      <HelpCircle size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                      <p style={{ fontWeight: 600, fontSize: "14px" }}>Chưa có câu hỏi nào</p>
                      <p style={{ fontSize: "12px" }}>Nhấn "Thêm câu hỏi" để bắt đầu.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {exercises.map((ex, i) => (
                        <div key={ex._id} style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <div style={{ fontWeight: 600, fontSize: "14px", flex: 1, lineHeight: 1.5 }}>{i + 1}. {ex.question}</div>
                            <button onClick={() => deleteExercise(ex._id)} style={{ padding: "5px 8px", border: "none", background: "#fee2e2", borderRadius: "8px", cursor: "pointer", color: "#ef4444", fontWeight: 600, fontSize: "12px", flexShrink: 0, marginLeft: "12px" }}>Xóa</button>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "11px", padding: "3px 10px", background: ex.type === "MCQ" ? "#dbeafe" : "#fef3c7", color: ex.type === "MCQ" ? "#1d4ed8" : "#d97706", borderRadius: "6px", fontWeight: 700 }}>{ex.type}</span>
                            {ex.type === "MCQ" && ex.options?.map(opt => (
                              <span key={opt._id} style={{ fontSize: "11px", padding: "3px 10px", background: opt.isCorrect ? "#dcfce7" : "#f1f5f9", color: opt.isCorrect ? "#15803d" : "#64748b", borderRadius: "6px", fontWeight: opt.isCorrect ? 700 : 500 }}>
                                {opt.isCorrect ? "✓ " : ""}{opt.content}
                              </span>
                            ))}
                            {ex.type === "FILL" && ex.explanation && (
                              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>✓ Đáp án: {ex.explanation}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ═══════════════ EXERCISE MODAL ═══════════════ */}
      <AnimatePresence>
        {isExModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: "white", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "540px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "19px", fontWeight: 800 }}>Thêm Câu Hỏi Bài Tập</h3>
                <button onClick={closeExModal} style={{ background: "#f1f5f9", border: "none", cursor: "pointer", color: "#64748b", borderRadius: "8px", padding: "6px" }}><X size={20} /></button>
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                <div><label style={labelStyle}>Câu hỏi</label><textarea style={{ ...inputStyle, resize: "none" } as any} rows={3} value={exQuestion} onChange={e => setExQuestion(e.target.value)} placeholder="VD: Chọn dạng đúng của động từ To Be..." /></div>
                <div><label style={labelStyle}>Loại câu hỏi</label>
                  <select style={inputStyle} value={exType} onChange={e => setExType(e.target.value as any)}>
                    <option value="MCQ">Trắc nghiệm (MCQ)</option>
                    <option value="FILL">Điền từ (FILL)</option>
                  </select>
                </div>
                {exType === "MCQ" && <>
                  <div><label style={labelStyle}>Các lựa chọn (cách nhau bởi dấu phẩy)</label><input style={inputStyle} value={exOptions} onChange={e => setExOptions(e.target.value)} placeholder="is, are, am, be" /></div>
                  <div><label style={labelStyle}>Đáp án đúng (phải giống hệt một trong các lựa chọn trên)</label><input style={inputStyle} value={exCorrect} onChange={e => setExCorrect(e.target.value)} placeholder="is" /></div>
                  <div><label style={labelStyle}>Giải thích (không bắt buộc)</label><input style={inputStyle} value={exExplanation} onChange={e => setExExplanation(e.target.value)} placeholder="..." /></div>
                </>}
                {exType === "FILL" && <>
                  <div><label style={labelStyle}>Đáp án đúng</label><input style={inputStyle} value={exCorrect} onChange={e => setExCorrect(e.target.value)} placeholder="going" /></div>
                  <div><label style={labelStyle}>Giải thích (không bắt buộc)</label><input style={inputStyle} value={exExplanation} onChange={e => setExExplanation(e.target.value)} placeholder="Giải thích lý do..." /></div>
                </>}
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button onClick={closeExModal} style={{ padding: "11px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
                <button onClick={saveExercise} style={{ padding: "11px 24px", background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>Lưu câu hỏi</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
