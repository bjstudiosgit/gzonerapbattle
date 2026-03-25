import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, Minus, Clock } from "lucide-react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";

interface LeagueTableProps {
  limit?: number;
  showTitle?: boolean;
}

export default function LeagueTable({ limit, showTitle = true }: LeagueTableProps) {
  let rankings = mcs
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.battles;
      const bPoints = (b.wins * 3) + b.battles;
      if (bPoints !== aPoints) return bPoints - aPoints;
      
      // Tie-breaker: fewest losses
      if (a.losses !== b.losses) return a.losses - b.losses;
      
      // Tie-breaker: most battles
      return b.battles - a.battles;
    })
    .map((mc, index) => ({
      rank: index + 1,
      id: mc.id,
      slug: mc.slug,
      name: mc.name,
      points: (mc.wins * 3) + mc.battles,
      battles: mc.battles,
      wins: mc.wins,
      losses: mc.losses,
      unreleased: battles.filter(b => b.isUnreleased && (b.mc1 === mc.id || b.mc2 === mc.id)).length,
      change: "none",
      isDsq: !mc.isActive
    }));

  if (limit) {
    rankings = rankings.slice(0, limit);
  }

  return (
    <section id="league" className="py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Rankings</h2>
            <h3 className="text-5xl font-display italic uppercase">The Official <span className="text-brand">Leaderboard</span></h3>
          </div>
        )}

        <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900/80">
                  <th className="hidden md:table-cell px-2 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300">Rank</th>
                  <th className="px-2 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300">MC Name</th>
                  <th className="px-1 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">Apps</span>
                    <span className="hidden md:inline">Appearances</span>
                  </th>
                  <th className="px-1 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">W</span>
                    <span className="hidden md:inline">Wins</span>
                  </th>
                  <th className="px-1 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">L</span>
                    <span className="hidden md:inline">Losses</span>
                  </th>
                  <th className="px-2 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">Pts</span>
                    <span className="hidden md:inline">Points</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((mc, index) => (
                  <motion.tr
                    key={mc.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${mc.isDsq ? 'opacity-40 grayscale' : ''}`}
                  >
                    <td className="hidden md:table-cell px-2 py-3 md:px-8 md:py-6">
                      <span className={`font-display italic text-lg md:text-2xl ${mc.isDsq ? 'text-zinc-400' : (typeof mc.rank === 'number' && mc.rank < 4 ? 'text-brand' : 'text-zinc-300')}`}>
                        {typeof mc.rank === 'number' && mc.rank < 10 ? `0${mc.rank}` : mc.rank}
                      </span>
                    </td>
                    <td className="px-2 py-3 md:px-8 md:py-6">
                      <Link to={`/mc/${mc.slug}`} className="flex items-center gap-2 md:gap-4 group/name">
                        <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full bg-zinc-800 border ${mc.isDsq ? 'border-zinc-700 text-zinc-400' : 'border-white/10 text-brand group-hover/name:border-brand'} flex items-center justify-center font-bold transition-colors text-[10px] md:text-base shrink-0`}>
                          {mc.name[0]}
                        </div>
                        <span className={`font-bold text-[11px] md:text-lg uppercase italic transition-colors whitespace-nowrap ${mc.isDsq ? 'text-zinc-400 line-through' : 'group-hover/name:text-brand'}`}>{mc.name} {mc.isDsq && <span className="text-[7px] md:text-[10px] not-italic text-zinc-300 ml-1 md:ml-2 border border-zinc-800 px-1 py-0.5 rounded tracking-widest">LOCKED</span>}</span>
                      </Link>
                    </td>
                    <td className={`px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center ${mc.isDsq ? 'text-zinc-400' : 'text-zinc-300'}`}>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2">
                        {mc.battles}
                        {mc.unreleased > 0 && (
                          <span className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[10px] font-bold border border-brand/20 whitespace-nowrap">
                            <Clock size={10} />
                            {mc.unreleased} UNRELEASED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center ${mc.isDsq ? 'text-zinc-400' : 'text-zinc-300'}`}>{mc.wins}</td>
                    <td className={`px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center ${mc.isDsq ? 'text-zinc-400' : 'text-zinc-300'}`}>{mc.losses}</td>
                    <td className={`px-2 py-3 md:px-8 md:py-6 font-bold text-[11px] md:text-base text-center ${mc.isDsq ? 'text-zinc-400' : 'text-zinc-100'}`}>{mc.points.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {limit && limit < mcs.length && (
            <div className="p-8 bg-zinc-900/30 text-center border-t border-white/5">
              <Link to="/league" className="text-brand font-bold uppercase tracking-widest text-sm hover:underline">
                View Full League Table
              </Link>
            </div>
          )}
          <div className="px-8 py-4 bg-zinc-950/50 border-t border-white/5">
            <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold text-center">
              Scoring: 3 Points per Win • 1 Point per Appearance • 0 Points per Loss
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
