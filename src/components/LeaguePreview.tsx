import { motion } from "motion/react";
import { mcs } from "../data/mcs";
import { Link } from "react-router-dom";
import { Trophy, ChevronRight, Medal } from "lucide-react";

export default function LeaguePreview() {
  const top3 = mcs
    .filter(mc => mc.id !== 'ldn-mikez')
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.battles;
      const bPoints = (b.wins * 3) + b.battles;
      if (bPoints !== aPoints) return bPoints - aPoints;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    })
    .slice(0, 3)
    .map((mc, index) => ({
      ...mc,
      points: (mc.wins * 3) + mc.battles,
      rank: index + 1
    }));

  return (
    <section className="py-12 md:py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-8">
              <Trophy size={12} />
              <span>Official Standings</span>
            </div>
            <h3 className="text-4xl md:text-7xl font-display italic uppercase leading-tight mb-8">
              The G Zone <span className="text-brand">League</span>
            </h3>
            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-80">
              The definitive leaderboard. 3 points for a win, 1 for an appearance. No politics, just performance.
            </p>
            
            <Link 
              to="/league" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-brand text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all duration-300 shadow-xl shadow-brand/20"
            >
              View Full League <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:border-brand/30 transition-all duration-500 ${
                index === 0 ? 'md:scale-105 border-brand/20 shadow-[0_0_40px_rgba(242,125,38,0.1)]' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black italic border-2 ${
                index === 0 ? 'bg-brand text-black border-brand shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 
                index === 1 ? 'bg-zinc-400 text-black border-zinc-400' : 
                'bg-amber-700 text-white border-amber-700'
              }`}>
                {index + 1}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 rounded-3xl overflow-hidden border-2 ${index === 0 ? 'border-brand' : 'border-white/10'}`}>
                    <img 
                      src={mc.image} 
                      alt={mc.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute -bottom-2 -right-2 bg-brand text-black p-1.5 rounded-lg shadow-xl">
                      <Trophy size={16} />
                    </div>
                  )}
                </div>

                <h4 className="text-2xl font-display italic uppercase mb-2 group-hover:text-brand transition-colors">{mc.name}</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Wins</div>
                    <div className="text-xl font-display italic text-white">{mc.wins}</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Losses</div>
                    <div className="text-xl font-display italic text-white">{mc.losses}</div>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Points</div>
                    <div className="text-3xl font-display italic text-brand">{mc.points}</div>
                  </div>
                  <Link 
                    to={`/mc/${mc.slug}`}
                    className="p-3 rounded-xl bg-white/5 text-white hover:bg-brand hover:text-black transition-all duration-300"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
