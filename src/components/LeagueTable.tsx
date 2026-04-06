import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Trophy, Shield, Info, ArrowUpRight } from "lucide-react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings } from "../lib/ranking";

interface LeagueTableProps {
  limit?: number;
  showTitle?: boolean;
}

export default function LeagueTable({ limit, showTitle = true }: LeagueTableProps) {
  const calculatedRankings = calculateRankings(battles);
  
  let rankings = calculatedRankings
    .map((rankData) => {
      const mcData = mcs.find(m => m.id === rankData.id);
      return {
        rank: rankData.rank,
        id: rankData.id,
        slug: mcData?.slug || rankData.id,
        name: mcData?.name || rankData.id,
        points: rankData.totalScore,
        baseScore: rankData.baseScore,
        bonusScore: rankData.bonusScore,
        battles: rankData.battles,
        wins: rankData.wins,
        losses: rankData.losses,
        unreleased: battles.filter(b => b.isUnreleased && (b.mc1 === rankData.id || b.mc2 === rankData.id)).length,
        isDsq: mcData ? !mcData.isActive : false
      };
    });

  if (limit) {
    rankings = rankings.slice(0, limit);
  }

  return (
    <section id="league" className="py-16 md:py-24 scroll-mt-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0 opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showTitle && (
          <div className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full mb-8 shadow-2xl shadow-brand/10"
            >
              <Trophy size={14} className="text-brand" />
              <span className="text-[10px] md:text-xs uppercase font-black tracking-[0.4em] text-brand">Season 01 Leaderboard</span>
            </motion.div>
            
            <h3 className="text-4xl md:text-7xl font-display uppercase leading-[0.8] mb-8 tracking-tighter">
              The <span className="text-brand">League</span> Standings
            </h3>
            
            <p className="text-zinc-500 text-[10px] md:text-sm uppercase font-black tracking-[0.4em] opacity-80 max-w-2xl mx-auto">
              Real Power. Real Stakes. Real Rankings.
            </p>
          </div>
        )}

        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-white/10">
                  <th className="px-6 py-6 md:px-10 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 w-24">Rank</th>
                  <th className="px-6 py-6 md:px-10 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">The Contender</th>
                  <th className="px-4 py-6 md:px-6 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center text-zinc-600">Appearances</th>
                  <th className="px-4 py-6 md:px-6 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">W / L</th>
                  <th className="px-4 py-6 md:px-6 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">Base</th>
                  <th className="px-4 py-6 md:px-6 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center text-brand">Bonus</th>
                  <th className="px-6 py-6 md:px-10 md:py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-200 text-center bg-white/5">Total Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rankings.map((mc, index) => {
                  const isTop3 = index < 3 && !mc.isDsq;
                  return (
                    <motion.tr
                      key={mc.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className={`group hover:bg-white/[0.03] transition-all duration-300 relative ${mc.isDsq ? 'opacity-50 grayscale' : ''}`}
                    >
                      <td className="px-6 py-8 md:px-10 md:py-10">
                        <div className="flex items-center gap-2">
                           <span className={`font-display text-2xl md:text-4xl leading-none transition-colors ${
                              mc.isDsq ? 'text-zinc-700' : 
                              mc.rank === 1 ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]' :
                              mc.rank === 2 ? 'text-zinc-400 drop-shadow-[0_0_10px_rgba(161,161,170,0.3)]' :
                              mc.rank === 3 ? 'text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.3)]' :
                              'text-zinc-600 group-hover:text-zinc-400'
                           }`}>
                            {mc.rank < 10 ? `0${mc.rank}` : mc.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8 md:px-10 md:py-10">
                        <Link to={`/mc/${mc.slug}`} className="flex items-center gap-4 group/name relative">
                          <div className={`relative w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${isTop3 ? 'border-brand/40 shadow-[0_0_20px_rgba(242,125,38,0.2)]' : 'border-white/5 group-hover/name:border-brand/30'}`}>
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-display text-xl md:text-2xl text-zinc-500">
                              {mc.name[0]}
                            </div>
                            {/* In actual app, replace with image if available */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/name:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-display text-lg md:text-2xl uppercase tracking-tight transition-colors flex items-center gap-2 ${mc.isDsq ? 'text-zinc-500 line-through' : 'text-zinc-100 group-hover/name:text-brand'}`}>
                              {mc.name}
                              {!mc.isDsq && isTop3 && index === 0 && <Shield size={14} className="text-brand inline animate-pulse" />}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {mc.isDsq ? (
                                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-zinc-900 border border-zinc-700/50 rounded-md text-zinc-300">LOCKED</span>
                              ) : (
                                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Division 01</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-8 md:px-6 md:py-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <span className="font-mono text-sm md:text-lg font-black text-zinc-400">{mc.battles}</span>
                           {mc.unreleased > 0 && (
                            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[8px] font-black tracking-widest whitespace-nowrap">
                              <Clock size={10} strokeWidth={3} /> {mc.unreleased} <span className="hidden sm:inline">Unreleased</span>
                            </span>
                           )}
                        </div>
                      </td>
                      <td className="px-4 py-8 md:px-6 md:py-10 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-mono text-sm md:text-lg font-black">
                          <span className="text-emerald-500">{mc.wins}</span>
                          <span className="text-zinc-700">/</span>
                          <span className="text-rose-500">{mc.losses}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-8 md:px-6 md:py-10 text-center font-mono text-sm md:text-lg font-black ${mc.isDsq ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        {mc.baseScore}
                      </td>
                      <td className={`px-4 py-8 md:px-6 md:py-10 text-center font-mono text-sm md:text-lg font-black ${mc.isDsq ? 'text-zinc-700' : 'text-brand'}`}>
                        {mc.bonusScore > 0 ? (
                          <div className="inline-flex items-center gap-0.5">
                            <span className="text-xs">+</span>{mc.bonusScore}
                          </div>
                        ) : (
                          <span className="text-zinc-800">-</span>
                        )}
                      </td>
                      <td className={`px-6 py-8 md:px-10 md:py-10 text-center font-display text-2xl md:text-3xl bg-white/[0.02] ${isTop3 ? 'text-brand drop-shadow-[0_0_10px_rgba(242,125,38,0.3)]' : 'text-zinc-500'}`}>
                        {mc.points.toLocaleString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-1 border-t border-white/10 bg-zinc-950/80">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-10">
              <div className="flex items-center gap-4 group cursor-help">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-brand/40 group-hover:text-brand transition-colors">
                  <Info size={14} />
                </div>
                <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] leading-relaxed max-w-sm">
                  Official Scoring Criteria: <span className="text-zinc-300">3pts Win</span> • <span className="text-zinc-300">1pt Match</span> • <span className="text-zinc-300">0pts Loss</span> <br/>
                  Strategic modifiers applied for higher-bracket upsets.
                </p>
              </div>

              {limit && limit < calculatedRankings.length ? (
                <Link 
                  to="/league" 
                  className="px-8 py-3 rounded-xl bg-brand text-black font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                  View Full Data <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              ) : (
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
                  Season Official 2026
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
