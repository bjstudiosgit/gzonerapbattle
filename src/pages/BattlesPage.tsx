import { battles, lastUpdated } from "../data/battles";
import { mcs } from "../data/mcs";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Eye, Calendar, Trophy } from "lucide-react";
import { calculateTotalViews } from "../lib/battleUtils";

export default function BattlesPage() {
  const navigate = useNavigate();
  const totalViewsStr = calculateTotalViews(battles);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-white selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
          <div>
            <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.4em] mb-4">In Progress</h1>
            <h2 className="text-3xl md:text-6xl font-display italic uppercase leading-none mb-2">
              Season <span className="text-brand">01</span>
            </h2>
            <p className="text-brand font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm">"Most Wanted"</p>
          </div>
          
          {/* Summary Stats */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full md:w-auto">
            <div className="bg-zinc-900/30 border border-white/5 p-3 md:p-8 rounded-3xl flex-1 md:min-w-[180px]">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-1">
                <Eye size={12} className="text-brand" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Total Views</span>
              </div>
              <div className="text-2xl md:text-4xl font-display italic text-white mb-0.5">{totalViewsStr}</div>
              <div className="flex items-center justify-center md:justify-between mt-0.5">
                <div className="text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest">Last updated: {lastUpdated}</div>
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-white/5 p-3 md:p-8 rounded-3xl flex-1 md:min-w-[180px]">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-1">
                <Play size={12} className="text-brand" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Episodes</span>
              </div>
              <div className="text-2xl md:text-4xl font-display italic text-white">{battles.length}</div>
            </div>
          </div>
        </div>

        {/* Battles Table */}
        <div className="bg-zinc-900/20 rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900/40">
                  <th className="px-1 py-3 md:px-6 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Ep</th>
                  <th className="px-1 py-3 md:px-6 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Battle</th>
                  <th className="hidden md:table-cell px-2 py-3 md:px-6 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Date</th>
                  <th className="hidden md:table-cell px-2 py-3 md:px-6 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Views</th>
                  <th className="px-1 py-3 md:px-6 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 text-right md:text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {battles.map((battle, index) => {
                  const mc1 = mcs.find(m => m.id === battle.mc1);
                  const mc2 = mcs.find(m => m.id === battle.mc2);
                  
                  return (
                    <motion.tr 
                      key={battle.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      onClick={() => navigate(`/battle/${battle.slug}`)}
                      className="group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-1 py-3 md:px-6 md:py-6">
                        <Link to={`/battle/${battle.slug}`} className="font-mono text-brand text-[9px] md:text-sm hover:underline" aria-label={`Episode ${battle.episode || `1x${String(index + 1).padStart(2, '0')}`} details`}>{battle.episode || `1x${String(index + 1).padStart(2, '0')}`}</Link>
                      </td>
                      <td className="px-1 py-3 md:px-6 md:py-6">
                        <div className="block group-hover:translate-x-1 transition-transform">
                          <span className="font-display italic uppercase text-[10px] md:text-2xl text-zinc-100 group-hover:text-brand transition-colors flex items-center gap-1 md:gap-3">
                            <span className="flex items-center gap-1 md:gap-2">
                              {battle.winner === battle.mc1 && <Trophy size={10} className="text-brand md:w-[18px] md:h-[18px]" />}
                              <Link to={`/mc/${mc1?.slug}`} onClick={(e) => e.stopPropagation()} className="hover:text-brand hover:underline underline-offset-4 transition-colors">
                                {mc1?.name || battle.mc1}
                              </Link>
                            </span>
                            <Link to={`/battle/${battle.slug}`} className="text-zinc-400 text-[8px] md:text-sm hover:text-brand transition-colors" aria-label={`Watch ${mc1?.name || battle.mc1} vs ${mc2?.name || battle.mc2}`}>VS</Link>
                            <span className="flex items-center gap-1 md:gap-2">
                              <Link to={`/mc/${mc2?.slug}`} onClick={(e) => e.stopPropagation()} className="hover:text-brand hover:underline underline-offset-4 transition-colors">
                                {mc2?.name || battle.mc2}
                              </Link>
                              {battle.winner === battle.mc2 && <Trophy size={10} className="text-brand md:w-[18px] md:h-[18px]" />}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar size={14} className="opacity-50" />
                          {battle.isUnreleased ? "In production" : (battle.date || "TBD")}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-6">
                        <div className="flex items-center gap-2 text-zinc-100 font-mono text-xs">
                          <span className="w-1 h-1 rounded-full bg-brand/50" />
                          {battle.views || "0"}
                        </div>
                      </td>
                      <td className="px-1 py-3 md:px-6 md:py-6 text-right md:text-left">
                        <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/10 ${
                          battle.videoUrl 
                            ? "bg-emerald-500 text-black shadow-emerald-500/20" 
                            : "bg-zinc-800 text-zinc-400 border-white/5"
                        }`}>
                          {battle.videoUrl ? "Out Now" : "Upcoming"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-dashed border-white/10 rounded-3xl">
          <p className="text-zinc-400 text-xs uppercase tracking-widest max-w-md text-center sm:text-left">
            Season 1 is currently in progress. New battles released weekly.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Live Season</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
