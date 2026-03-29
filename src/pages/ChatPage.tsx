import { motion } from "motion/react";
import { MessageSquare, Info } from "lucide-react";
import Chat from "../components/Chat";

export default function ChatPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-6 md:pb-12 bg-zinc-950 flex flex-col">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
        <div className="text-center mb-4 md:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-4xl font-display italic uppercase mb-1 md:mb-4 tracking-tighter"
          >
            <span className="text-orange-500">GINJAHOO v1</span> WELCOME BACK TO 2003 📟
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block text-zinc-400 max-w-2xl mx-auto text-lg font-medium"
          >
            Search nothing. Say everything.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex-grow w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black min-h-[500px] h-[60vh] md:h-[70vh] mb-4 md:mb-8"
        >
          <Chat />
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand/30 rounded-br-3xl pointer-events-none" />
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest">
            <Info size={12} className="text-brand" />
            Be respectful. No spamming. Keep it about the culture.
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            Powered by Supabase Realtime • G-Zone Official Chat
          </p>
        </div>
      </div>
    </div>
  );
}
