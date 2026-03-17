import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Clock } from "lucide-react";
import { battles } from "../data/battles";
import { mcs } from "../data/mcs";

export default function RecentBattles() {
  const recentBattles = [...battles].reverse().slice(0, 4);

  return (
    <section id="battles" className="relative py-24 overflow-hidden scroll-mt-24">
      {/* Background Flow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-zinc-950 z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Arena</h2>
            <h3 className="text-5xl font-display italic uppercase">Recent <span className="text-brand">Battles</span></h3>
            <p className="text-zinc-400 mt-4">Watch the latest underground rap battles and MC clashes.</p>
          </div>
          <Link to="/battles" className="text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
            View All Battles <TrendingUp size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Released Battle */}
          {recentBattles.filter(b => !b.isUnreleased).slice(0, 1).map((battle) => {
            const mc1 = mcs.find(m => m.id === battle.mc1);
            const mc2 = mcs.find(m => m.id === battle.mc2);
            
            return (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/20 aspect-[16/9] lg:aspect-auto lg:h-full min-h-[400px]"
              >
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-brand/5 animate-pulse pointer-events-none" />
                </div>

                <div className="absolute top-6 left-6 z-20 flex gap-2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20">
                    <Play size={12} fill="currentColor" /> Out Now
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    Featured
                  </div>
                </div>

                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                  <div className="mb-6">
                    <span className="text-brand font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">
                      THE GRUDGE MATCH
                    </span>
                    <h4 className="text-4xl md:text-5xl font-display italic uppercase leading-none mb-4">
                      {mc1?.name} <span className="text-brand">VS</span> {mc2?.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-4">
                      <div className="w-14 h-14 rounded-full border-2 border-zinc-800 overflow-hidden relative z-10">
                        <img src={mc1?.image} alt={mc1?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="w-14 h-14 rounded-full border-2 border-zinc-800 overflow-hidden relative z-0">
                        <img src={mc2?.image} alt={mc2?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    <Link 
                      to={`/battle/${battle.id}`}
                      className="group/btn flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand transition-all transform hover:scale-105"
                    >
                      Watch Now <Play size={16} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                <Link to={`/battle/${battle.id}`} className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-brand/10 cursor-pointer" />
              </motion.div>
            );
          })}

          {/* Upcoming Drops Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="bg-zinc-900/40 rounded-3xl border border-white/5 p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Dropping Soon</h4>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">YouTube Premiere</span>
              </div>

              <div className="flex flex-col gap-6 flex-1">
                {recentBattles.filter(b => b.isUnreleased).slice(0, 3).map((battle, idx) => {
                  const mc1 = mcs.find(m => m.id === battle.mc1);
                  const mc2 = mcs.find(m => m.id === battle.mc2);
                  
                  return (
                    <div 
                      key={battle.id}
                      className={`flex items-center justify-between group/item ${idx !== 2 ? 'pb-6 border-b border-white/5' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          <div className="w-10 h-10 rounded-full border border-zinc-800 overflow-hidden">
                            <img src={mc1?.image} alt={mc1?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="w-10 h-10 rounded-full border border-zinc-800 overflow-hidden">
                            <img src={mc2?.image} alt={mc2?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Battle #{battle.id}</div>
                          <div className="text-lg font-display italic uppercase text-white group-hover/item:text-brand transition-colors">
                            {mc1?.name} <span className="text-brand/50">VS</span> {mc2?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Release</div>
                        <div className="text-sm font-display italic text-white uppercase">TBC</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest leading-relaxed">
                  Subscribe to our YouTube channel and hit the bell icon to never miss a drop.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
