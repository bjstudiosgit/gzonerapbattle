import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Trophy, ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCBios() {
  const totalMCs = mcs.length;
  const activeMCs = mcs.filter(mc => mc.isActive !== false).length;

  return (
    <section id="mcs" className="py-24 relative bg-zinc-950 scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Roster</h2>
            <h3 className="text-5xl md:text-6xl font-display italic uppercase mb-6">The <span className="text-brand">GZone</span> MC's</h3>
            <p className="text-zinc-400 mt-4">Discover the battle rappers and MCs making waves in the UK battle rap scene.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm min-w-[140px]">
              <div className="text-brand font-display italic text-4xl mb-1">{totalMCs}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total MCs</div>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm min-w-[140px]">
              <div className="text-white font-display italic text-4xl mb-1">{activeMCs}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Now</div>
            </div>
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
              <Link to={`/mc/${mc.slug}`} className="block p-4" aria-label={`View ${mc.name} profile`}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 border border-white/5">
                  <img 
                    src={mc.image} 
                    alt={mc.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
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
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/mcs" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-black hover:border-brand transition-all group"
          >
            View All MCs
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
