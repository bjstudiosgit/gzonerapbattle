import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center p-12 bg-zinc-900 rounded-3xl border border-brand/20 shadow-2xl shadow-brand/5"
      >
        <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-brand" size={40} />
        </div>
        <h1 className="text-3xl font-display italic uppercase text-white mb-4">Application Successful</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your application has been received. If your bars are serious, we'll be in touch.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-brand hover:bg-brand-dark text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all"
        >
          Back to Base
        </Link>
      </motion.div>
    </div>
  );
}
