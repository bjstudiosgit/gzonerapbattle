import { motion } from "motion/react";
import { ChevronRight, Sword, Flame, Mic2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplySection() {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden border-b border-white/5">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-2xl md:text-5xl font-display italic uppercase mb-6 leading-tight">
            THINK YOU'VE GOT BARS? <br /> <span className="text-brand">WHO WE'RE LOOKING FOR</span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl mb-16 leading-relaxed max-w-3xl mx-auto">
            We want MCs with hunger, lyrical precision, and the ability to command a crowd. 
            If you have the bars and the hunger, step up.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Flame className="text-brand" size={32} />,
              title: "The Hunger",
              desc: "We want MCs with the hunger to prove themselves in the pit. If you've got the drive to be the best, step up."
            },
            {
              icon: <Mic2 className="text-brand" size={32} />,
              title: "Lyrical Precision",
              desc: "Bars, schemes, and technical excellence. We're looking for lyrical precision and wordplay that commands respect."
            },
            {
              icon: <Sword className="text-brand" size={32} />,
              title: "Stage Presence",
              desc: "The ability to command a crowd and own the stage. We want performers who can handle the pressure of the G Zone."
            }
          ].map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:border-brand/50 transition-all group text-left"
            >
              <div className="mb-4 p-3 bg-brand/10 rounded-2xl w-fit group-hover:bg-brand/20 transition-colors">
                {point.icon}
              </div>
              <h3 className="text-2xl font-display italic uppercase mb-2 text-white">{point.title}</h3>
              <p className="text-zinc-500 leading-relaxed whitespace-pre-line">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-16">
            <Link 
              to="/apply" 
              className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-black px-12 py-5 rounded-full font-bold text-lg uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl shadow-brand/20"
            >
              ENTER THE RING <ChevronRight size={20} />
            </Link>
          </div>

          <p className="mt-12 text-zinc-500 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <AlertTriangle size={14} className="text-brand" />
            Warning: Applying may result in public humiliation, viral moments, and sudden respect from the culture.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
