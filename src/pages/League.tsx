import { motion } from "motion/react";
import LeagueTable from "../components/LeagueTable";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings } from "../lib/ranking";
import { Link } from "react-router-dom";
import { Trophy, Medal } from "lucide-react";

export default function League() {
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
        wins: rankData.wins,
        battles: rankData.battles,
        points: rankData.totalScore,
        rank: index + 1
      };
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Official Rankings</h1>
            <h2 className="text-3xl md:text-5xl font-display italic uppercase leading-tight">The G Zone <span className="text-brand">League</span></h2>
            <p className="text-zinc-400 mt-4 md:mt-6 max-w-xl text-sm md:text-lg leading-relaxed">
              The definitive leaderboard for the G Zone Rap Battle League. Everything is earned in the ring — 3 points for a win, 1 for an appearance, 0 for a loss. Bonus points reward upsets: +1 for beating someone 1–3 places above, +2 for 4–7, and +3 for 8+, while higher-ranked MCs gain no bonus for beating lower opponents. DSQ means the MC has withdrawn from the league.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Trophy size={14} className="text-brand" /> Current Top 3
            </h3>
            <div className="grid gap-4">
              {top3.map((mc, index) => (
                <motion.div
                  key={mc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-brand/30 transition-all"
                >
                  <Link 
                    to={`/mc/${mc.slug}`} 
                    aria-label={`View ${mc.name}'s profile`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-zinc-800 border ${index === 0 ? 'border-brand shadow-[0_0_15px_rgba(242,125,38,0.2)]' : 'border-white/10'} flex items-center justify-center font-bold text-brand text-xl italic`}>
                        {mc.name[0]}
                      </div>
                      <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${
                        index === 0 ? 'bg-brand text-black border-brand' : 
                        index === 1 ? 'bg-zinc-400 text-black border-zinc-400' : 
                        'bg-amber-700 text-white border-amber-700'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display italic uppercase text-lg group-hover:text-brand transition-colors">{mc.name}</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                        {mc.wins} Wins • {mc.battles} Battles
                      </p>
                    </div>
                  </Link>
                  <div className="text-right">
                    <div className="text-2xl font-display italic text-brand">{mc.points}</div>
                    <div className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">Points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <LeagueTable showTitle={false} />
      </div>
    </motion.div>
  );
}
