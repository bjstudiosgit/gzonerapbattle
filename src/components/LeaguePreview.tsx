import { motion } from "motion/react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings } from "../lib/ranking";
import { Link } from "react-router-dom";
import { Trophy, ChevronRight, Medal } from "lucide-react";

export default function LeaguePreview() {
  const calculatedRankings = calculateRankings(battles);
  
  const top3 = calculatedRankings
    .filter(rankData => rankData.id !== 'ldn-mikez')
    .slice(0, 3)
    .map((rankData, index) => {
      const mcData = mcs.find(m => m.id === rankData.id);
      return {
        id: rankData.id,
        slug: mcData?.slug || rankData.id,
        name: mcData?.name || rankData.id,
        image: mcData?.image || '',
        wins: rankData.wins,
        losses: rankData.losses,
        battles: rankData.battles,
        points: rankData.totalScore,
        rank: index + 1
      };
    });

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-15 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-8">
              <Trophy size={12} />
              <span>Official Standings</span>
            </div>
            <h3 className="text-4xl md:text-7xl font-display uppercase leading-tight mb-8">
              The Gzone <span className="text-brand">League</span>
            </h3>
            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-80">
              Earn it. 3 for a win. 1 for the battle. Bonus points for beating higher-ranked opponents. Nothing else matters.
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
              className="relative group bg-gradient-to-b from-zinc-900 to-zinc-950 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-brand/50 transition-all duration-500 shadow-2xl hover:shadow-brand/10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {/* Trophy Icon centered above image */}
                  <div className={`mb-4 flex justify-center ${
                    index === 0 ? 'text-[#FFD700]' : 
                    index === 1 ? 'text-[#C0C0C0]' : 
                    'text-[#CD7F32]'
                  }`}>
                    <Trophy size={32} strokeWidth={1.5} />
                  </div>
                  
                  <div className={`w-32 h-32 rounded-full overflow-hidden border-2 p-1 ${
                    index === 0 ? 'border-[#FFD700]/50' : 
                    index === 1 ? 'border-[#C0C0C0]/50' : 
                    'border-[#CD7F32]/50'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={mc.image} 
                        alt={mc.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                <h4 className="text-2xl font-display uppercase mb-1 tracking-wide group-hover:text-brand transition-colors">{mc.name}</h4>
                <div className="text-brand font-black text-[10px] uppercase tracking-[0.3em] mb-6">{mc.points} Points</div>
                
                <div className="flex items-center gap-6 mb-8 bg-black/60 px-8 py-3 rounded-full border border-white/5">
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Wins</div>
                    <div className="text-xl font-display text-white">{mc.wins}</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Losses</div>
                    <div className="text-xl font-display text-white">{mc.losses}</div>
                  </div>
                </div>

                <Link 
                  to={`/mc/${mc.slug}`}
                  className="w-full py-3 rounded-full bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand hover:text-black transition-all duration-300 flex items-center justify-center gap-2 border border-white/5 hover:border-brand"
                >
                  View Profile <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
