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
          <h2 className="text-3xl md:text-6xl font-display italic uppercase mb-6 leading-tight">
            <span className="bg-gradient-to-b from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(165,243,252,0.4)]">
              THINK YOU’RE COLD?
            </span>{" "}
            <span className="text-brand">PROVE IT.</span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl mb-16 leading-relaxed max-w-3xl mx-auto">
            NOT EVERYONE BELONGS HERE. This isn’t open mic. The G-Zone is built for MCs who can write, perform, and hold their own under pressure. No gas. No hand-holding. No second chances. If you’ve got something real, step forward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Flame className="text-brand" size={32} />,
              title: "THE PEN",
              desc: "Bars over everything.\n\nIf your material doesn't cut deep, you're just taking up space."
            },
            {
              icon: <Mic2 className="text-brand" size={32} />,
              title: "THE MIC",
              desc: "Clarity. Impact. Soul.\n\nIf the crowd can't feel the weight of your words, you've already lost."
            },
            {
              icon: <Sword className="text-brand" size={32} />,
              title: "THE STAGE",
              desc: "Command the arena.\n\nThis isn't a rehearsal—it's the G Zone. Own the space or get moved out of it."
            }
          ].map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-brand/40 transition-all group relative overflow-hidden"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.05] transition-opacity" />
              
              <div className="relative z-10">
                <div className="mb-6 p-4 bg-brand/5 rounded-2xl w-fit group-hover:bg-brand/10 transition-colors mx-auto border border-brand/10">
                  {point.icon}
                </div>
                <h3 className="text-2xl font-display italic uppercase mb-3 text-white text-center tracking-tight group-hover:text-brand transition-colors">{point.title}</h3>
                <p className="text-zinc-500 leading-relaxed whitespace-pre-line text-center text-sm md:text-base">{point.desc}</p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
              REQUEST A SLOT <ChevronRight size={20} />
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
