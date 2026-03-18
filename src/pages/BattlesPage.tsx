import { battles } from "../data/battles";
import { mcs } from "../data/mcs";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Eye, Calendar, Trophy } from "lucide-react";

export default function BattlesPage() {
  // Helper to parse view strings like "46.3K" or "4,569" into numbers
  const parseViews = (viewStr: string | undefined): number => {
    if (!viewStr) return 0;
    const clean = viewStr.replace(/,/g, "").toUpperCase();
    if (clean.endsWith("K")) {
      return parseFloat(clean.replace("K", "")) * 1000;
    }
    if (clean.endsWith("M")) {
      return parseFloat(clean.replace("M", "")) * 1000000;
    }
    return parseInt(clean) || 0;
  };

  const totalViewsNum = battles.reduce((acc, b) => acc + parseViews(b.views), 0);
  const totalViewsStr = totalViewsNum >= 1000 
    ? (totalViewsNum / 1000).toFixed(1) + "K" 
    : totalViewsNum.toString();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-white selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h1 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">In Progress</h1>
            <h2 className="text-6xl md:text-9xl font-display italic uppercase leading-none">
              Season <span className="text-brand">01</span>
            </h2>
          </div>
          
          {/* Summary Stats */}
          <div className="flex gap-4 md:gap-8">
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl min-w-[180px]">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Eye size={14} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Total Views</span>
              </div>
              <div className="text-4xl font-display italic text-white">{totalViewsStr}</div>
            </div>
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl min-w-[180px]">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Play size={14} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Episodes</span>
              </div>
              <div className="text-4xl font-display italic text-white">{battles.length}</div>
            </div>
          </div>
        </div>

        {/* Battles Table */}
        <div className="bg-zinc-900/20 rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900/40">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Episode</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Battle</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Release Date</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Views</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Status</th>
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
                      className="group hover:bg-white/5 transition-all duration-300"
                    >
                      <td className="px-6 py-6">
                        <Link to={`/battle/${battle.slug}`} className="font-mono text-brand text-sm hover:underline">1x{String(index + 1).padStart(2, '0')}</Link>
                      </td>
                      <td className="px-6 py-6">
                        <Link to={`/battle/${battle.slug}`} className="block group-hover:translate-x-1 transition-transform">
                          <span className="font-display italic uppercase text-xl md:text-2xl text-zinc-100 group-hover:text-brand transition-colors flex items-center gap-3">
                            <span className="flex items-center gap-2">
                              {battle.winner === battle.mc1 && <Trophy size={18} className="text-brand" />}
                              <Link to={`/mc/${mc1?.slug}`} className="hover:text-brand hover:underline underline-offset-4 transition-colors">
                                {mc1?.name || battle.mc1}
                              </Link>
                            </span>
                            <span className="text-zinc-600 text-sm">VS</span>
                            <span className="flex items-center gap-2">
                              <Link to={`/mc/${mc2?.slug}`} className="hover:text-brand hover:underline underline-offset-4 transition-colors">
                                {mc2?.name || battle.mc2}
                              </Link>
                              {battle.winner === battle.mc2 && <Trophy size={18} className="text-brand" />}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar size={14} className="opacity-50" />
                          {battle.date || "TBD"}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-zinc-100 font-mono text-xs">
                          <span className="w-1 h-1 rounded-full bg-brand/50" />
                          {battle.views || "0"}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          battle.videoUrl 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-zinc-800 text-zinc-500 border border-white/5"
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
          <p className="text-zinc-500 text-xs uppercase tracking-widest max-w-md text-center sm:text-left">
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
