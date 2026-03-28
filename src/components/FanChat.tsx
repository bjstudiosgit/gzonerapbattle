import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import Chat from "./Chat";

export default function FanChat() {
  return (
    <section className="py-12 md:py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-brand font-bold uppercase tracking-[0.3em] text-xs mb-4"
          >
            <MessageSquare size={14} />
            Live Interaction
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-display italic uppercase mb-6 tracking-tighter"
          >
            G-Zone <span className="text-brand">Fan Chat</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg"
          >
            we are working on this right now...
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black"
        >
          <Chat />
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand/30 rounded-br-3xl pointer-events-none" />
        </motion.div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            Powered by Supabase Realtime • G-Zone Official Chat
          </p>
        </div>
      </div>
    </section>
  );
}
