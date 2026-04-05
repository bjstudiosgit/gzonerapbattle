import { motion } from "motion/react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center p-10 md:p-16 bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] border border-brand/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/20 shadow-[0_0_30px_rgba(242,125,38,0.2)]">
          <CheckCircle2 className="text-brand" size={48} />
        </div>
        <h1 className="text-4xl md:text-6xl font-display italic uppercase text-white mb-6 leading-none tracking-tight">Entry <br/><span className="text-brand">Logged</span></h1>
        <p className="text-zinc-400 mb-10 leading-relaxed text-sm md:text-lg uppercase tracking-widest font-black opacity-80">
          Your application is in the ring. <br/>If your bars are serious, <span className="text-brand italic">we will be in touch.</span>
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-4 bg-brand hover:bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-brand/20 hover:scale-105"
        >
          Return Home <ChevronLeft size={20} />
        </Link>
      </motion.div>
    </div>
  );
}
