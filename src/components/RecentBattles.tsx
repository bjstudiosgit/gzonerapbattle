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

        <div className="grid md:grid-cols-2 gap-8">
          {recentBattles.map((battle, index) => {
            const mc1 = mcs.find(m => m.id === battle.mc1);
            const mc2 = mcs.find(m => m.id === battle.mc2);

            return (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-zinc-950/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-brand/30 transition-all p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {battle.isUnreleased && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} /> Unreleased
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-4 group-hover:border-brand/50 transition-colors">
                      <img src={mc1?.image} alt={mc1?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('awaiting-photo.png')) return;
                        target.src = `https://picsum.photos/seed/${mc1?.id}/100/100`;
                      }} />
                    </div>
                    <Link to={`/mc/${mc1?.id}`} className="font-display italic uppercase text-xl hover:text-brand transition-colors">{mc1?.name}</Link>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-brand font-display italic text-2xl">VS</div>
                    <Link 
                      to={`/battle/${battle.id}`}
                      className="w-12 h-12 bg-brand text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-brand/20"
                    >
                      <Play size={20} fill="currentColor" />
                    </Link>
                  </div>

                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-4 group-hover:border-brand/50 transition-colors">
                      <img src={mc2?.image} alt={mc2?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('awaiting-photo.png')) return;
                        target.src = `https://picsum.photos/seed/${mc2?.id}/100/100`;
                      }} />
                    </div>
                    <Link to={`/mc/${mc2?.id}`} className="font-display italic uppercase text-xl hover:text-brand transition-colors">{mc2?.name}</Link>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold text-orange-500">Season 1 • Battle #{battle.id}</span>
                  <Link to={`/battle/${battle.id}`} className="text-xs text-brand font-bold uppercase tracking-widest hover:underline">
                    Watch & Vote
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
