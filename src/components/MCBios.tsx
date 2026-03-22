import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mic2, Trophy, Zap, ChevronRight, Medal } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCBios() {
  const top3 = mcs
    .filter(mc => mc.isActive !== false && mc.id !== 'ldn-mikez')
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.battles;
      const bPoints = (b.wins * 3) + b.battles;
      if (bPoints !== aPoints) return bPoints - aPoints;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    })
    .slice(0, 3);

  return (
    <section id="mcs" className="py-24 relative bg-black scroll-mt-24 overflow-hidden">
      {/* Orange Contrast Gradient */}
      <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      {/* Flow Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Roster</h2>
          <h3 className="text-5xl md:text-6xl font-display italic uppercase mb-6">The <span className="text-brand">GZone</span> MC's</h3>
          <p className="text-zinc-300 mt-4 max-w-2xl mx-auto">Discover the battle rappers and MCs making waves in the UK battle rap scene.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {top3.map((mc, index) => (
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
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('awaiting-photo.png')) return;
                    target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                
                {/* Tags */}
                {mc.tags && mc.tags.length > 0 && (
                  <div className="absolute top-4 right-20 z-20 flex flex-col gap-1 items-end">
                    {mc.tags.map(tag => (
                      <span key={tag} className="bg-brand text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {mc.tiktok && (
                  <div className="absolute bottom-24 right-6 z-20">
                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-brand group-hover:bg-brand group-hover:text-black transition-all">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                  <span className="text-brand">
                    {index === 0 ? <Trophy size={14} /> : <Medal size={14} />}
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Rank #{index + 1}
                  </span>
                </div>

                {/* Points Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand/20 backdrop-blur-md border border-brand/30 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-widest">
                    {(mc.wins * 3) + mc.battles} PTS
                  </span>
                </div>

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
