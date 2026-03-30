import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCBios() {
  const top5 = mcs
    .filter(mc => mc.isActive !== false && mc.id !== 'ldn-mikez')
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.battles;
      const bPoints = (b.wins * 3) + b.battles;
      if (bPoints !== aPoints) return bPoints - aPoints;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    });

  return (
    <section id="mcs" className="py-24 md:py-32 relative bg-black scroll-mt-24 overflow-hidden">
      {/* Orange Contrast Gradient */}
      <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      {/* Flow Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display italic uppercase leading-none">The <span className="text-brand">GZone</span> Roster</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {top5.map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 cursor-pointer"
            >
              <Link to={`/mc/${mc.slug}`} className="block w-full h-full" aria-label={`View ${mc.name} profile`}>
                <img 
                  src={mc.image} 
                  alt={mc.name} 
                  width={400}
                  height={533}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('awaiting-photo.png')) return;
                    target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                
                {/* Tags */}
                {mc.tags && mc.tags.length > 0 && (
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 items-end">
                    {mc.tags.map(tag => (
                      <span key={tag} className="bg-brand text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-brand font-bold text-[10px] uppercase tracking-[0.2em]">{mc.wins} Wins</p>
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">{mc.battles} Battles</p>
                  </div>
                  <h4 className="text-3xl font-display italic uppercase leading-none group-hover:text-brand transition-colors">{mc.name}</h4>
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
