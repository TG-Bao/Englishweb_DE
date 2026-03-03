import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const GrammarPage = () => {
  return (
    <AppShell>
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '20px', 
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <ShieldCheck size={40} />
          </div>
          <h1>Học Ngữ Pháp</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Trang học ngữ pháp đang được phát triển. Bạn sẽ sớm có thể học các cấu trúc câu Tiếng Anh từ cơ bản đến nâng cao tại đây!
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default GrammarPage;
