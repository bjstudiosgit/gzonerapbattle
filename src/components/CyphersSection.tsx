import { motion } from "motion/react";
import { Mic2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CyphersSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-black border-t border-white/5">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <Link to="/cyphers" className="block">
            <div className="bg-zinc-950/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/5 hover:border-brand/30 transition-all overflow-hidden relative">
              {/* Decorative background icon */}
              <Mic2 className="absolute -right-8 -bottom-8 w-64 h-64 text-brand/5 -rotate-12 group-hover:text-brand/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-4xl md:text-6xl font-display italic uppercase mb-4">
                    The G Zone <span className="text-brand">Cyphers</span>
                  </h3>
                  <p className="text-zinc-400 text-lg max-w-2xl">
                    Raw talent, unfiltered bars. Watch the latest G Zone cyphers featuring the best up-and-coming MCs from across the UK.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-brand text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest group-hover:scale-105 transition-transform shrink-0">
                  Watch Now <ArrowRight size={24} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
