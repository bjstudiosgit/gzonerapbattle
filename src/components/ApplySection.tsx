import { motion } from "motion/react";
import { ChevronRight, Sword, Flame, Mic2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplySection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Orange Contrast Gradient */}
      <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      {/* Flow Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display italic uppercase mb-8 leading-[0.9] tracking-tighter">
            <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              THINK YOU’RE COLD?
            </span>{" "}
            <span className="text-brand">PROVE IT.</span>
          </h2>

          <p className="text-zinc-300 text-xl md:text-3xl mb-20 leading-[1.1] max-w-5xl mx-auto font-light tracking-tight">
            <span className="text-white font-bold uppercase text-xs tracking-[0.3em] block mb-6 opacity-50">The Standard</span>
            NOT EVERYONE BELONGS HERE. This isn’t open mic. The G-Zone is built for MCs who can write, perform, and hold their own under pressure. <span className="text-brand italic">No gas. No hand-holding. No second chances.</span> If you’ve got something real, step forward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <Flame className="text-brand" size={24} />,
              title: "THE PEN",
              subtitle: "Bars over everything.",
              desc: "If your material doesn't cut deep, you're just taking up space.",
              number: "01"
            },
            {
              icon: <Mic2 className="text-brand" size={24} />,
              title: "THE MIC",
              subtitle: "Clarity. Impact. Soul.",
              desc: "If the crowd can't feel the weight of your words, you've already lost.",
              number: "02"
            },
            {
              icon: <Sword className="text-brand" size={24} />,
              title: "THE STAGE",
              subtitle: "Command the arena.",
              desc: "This isn't a rehearsal—it's the G Zone. Own the space or get moved out of it.",
              number: "03"
            }
          ].map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative bg-zinc-900/20 border border-white/5 hover:border-brand/50 transition-all duration-500 overflow-hidden"
            >
              {/* Technical Grid Background */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Top Bar */}
              <div className="h-1 w-full bg-white/5 group-hover:bg-brand/50 transition-colors duration-500" />
              
              <div className="p-8 relative z-10">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 border border-brand/20 flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-500 transform group-hover:rotate-12">
                    <div className="group-hover:text-black transition-colors duration-500">
                      {point.icon}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 group-hover:text-brand transition-colors">
                    CRITERIA_{point.number}
                  </span>
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-3xl font-display italic uppercase mb-1 text-white tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                    {point.title}
                  </h3>
                  <div className="h-px w-12 bg-brand mb-6 group-hover:w-full transition-all duration-700" />
                  
                  <p className="font-mono text-[11px] uppercase tracking-widest text-brand mb-4 opacity-80">
                    {point.subtitle}
                  </p>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                    {point.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 border-r-2 border-b-2 border-brand" />
              </div>
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

          <p className="mt-12 text-zinc-200 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <AlertTriangle size={14} className="text-brand" />
            Warning: Applying may result in public humiliation, viral moments, and sudden respect from the culture.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
