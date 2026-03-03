import AppShell from "../components/AppShell";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const SpeakingPage = () => {
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
            <Mic size={40} />
          </div>
          <h1>Luyện Nói</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Trang luyện nói đang được phát triển. Bạn sẽ sớm có thể luyện phát âm và giao tiếp Tiếng Anh với công nghệ nhận dạng giọng nói AI!
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default SpeakingPage;
