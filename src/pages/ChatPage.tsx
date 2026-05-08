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
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-7xl font-display uppercase leading-[0.85] tracking-tighter shadow-2xl">
              GINGAHOO <span className="text-brand font-black italic">V2.0</span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-white/80 uppercase tracking-tighter">
                Feat. <span className="text-brand">GingaJayBot</span>
              </h2>
              
              <p className="max-w-xl text-zinc-400 text-sm md:text-base font-medium tracking-tight leading-relaxed opacity-80">
                The worlds first AI battle rap chat. <br />
                GingaJayBot is an AI entertainment feature.
              </p>
            </div>
          </div>
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
        </footer>
      </div>
    </div>
  );
}
