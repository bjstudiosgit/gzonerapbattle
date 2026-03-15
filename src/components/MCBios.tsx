import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mic2, Trophy, Zap, ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCBios() {
  return (
    <section id="mcs" className="py-24 relative bg-zinc-950 scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Combatants</h2>
            <h3 className="text-5xl md:text-6xl font-display italic uppercase mb-6">The <span className="text-brand">GZone</span> MC's</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          {mcs.filter(mc => mc.isActive !== false).map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative bg-zinc-950 hover:bg-zinc-900 transition-colors duration-300"
            >
              <Link to={`/mc/${mc.id}`} className="block p-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 border border-white/5">
                  <img 
                    src={mc.image} 
                    alt={mc.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                       if (target.src.includes('awaiting-photo.png')) return;
                      target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-40" />
                  
                  <div className="absolute top-2 left-2 bg-brand text-black w-6 h-6 rounded-full flex items-center justify-center font-display italic text-[10px] z-20">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-lg font-display italic uppercase leading-none truncate group-hover:text-brand transition-colors">{mc.name}</h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-brand"><Trophy size={10} /> {mc.wins}W</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Profile <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
