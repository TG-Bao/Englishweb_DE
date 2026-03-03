import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const ListeningPage = () => {
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
            <Globe size={40} />
          </div>
          <h1>Luyện Nghe</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Trang luyện nghe đang được phát triển. Bạn sẽ sớm có thể luyện kỹ năng nghe qua các bài podcast, video và hội thoại thực tế!
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default ListeningPage;
