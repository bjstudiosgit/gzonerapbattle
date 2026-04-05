import { motion } from "motion/react";
import { MessageSquare, Info } from "lucide-react";
import Chat from "../components/Chat";

export default function ChatPage() {
  return (
    <div className="min-h-screen pt-40 pb-12 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col relative z-10">
        <header className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full mb-8">
            <MessageSquare size={14} className="text-brand" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-brand">Secure Comms Node</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display italic uppercase leading-[0.85] tracking-tighter mb-4 shadow-2xl">
            GINJAHOO <span className="text-brand font-black">v1.2</span>
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-sm uppercase font-black tracking-[0.4em] opacity-80">
            DECRYPTING CULTURE. <span className="text-white">SAY EVERYTHING.</span>
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex-grow w-full max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-md min-h-[500px] h-[60vh] md:h-[70vh] mb-8 group"
        >
          <Chat />
          
          {/* Tactical Corner Overlays */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-brand/40 rounded-tl-[3rem] pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-brand/40 rounded-br-[3rem] pointer-events-none group-hover:scale-110 transition-transform" />
        </motion.div>
        
        <footer className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left opacity-50">
          <div className="flex items-center gap-3 text-zinc-500 text-[9px] uppercase font-black tracking-[0.34em]">
            <Info size={14} className="text-brand" />
            Be respectful. No spamming. Keep it about the culture.
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
            Realtime Encryption Active • <span className="text-brand">G-Zone Intranet</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
