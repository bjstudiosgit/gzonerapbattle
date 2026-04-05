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
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cinematic Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.5em] mb-4">Official Roster</h1>
            <h2 className="text-4xl md:text-7xl font-display italic uppercase leading-[0.8] mb-4">
              Season <span className="text-brand">01</span>
            </h2>
            <p className="text-brand font-bold uppercase tracking-[0.4em] text-[10px] md:text-base opacity-80">"Most Wanted" Division</p>
          </div>
          
          {/* Dashboard Stats */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full md:w-auto">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] flex-1 md:min-w-[240px] shadow-2xl group hover:border-brand/30 transition-colors">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-3">
                <Eye size={16} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-black">Total Engagement</span>
              </div>
              <div className="text-4xl md:text-5xl font-display italic text-white mb-1 group-hover:text-brand transition-colors">{totalViewsStr}</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest text-center md:text-left font-bold opacity-60">Synced: {lastUpdated}</div>
            </div>
            
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] flex-1 md:min-w-[180px] shadow-2xl group hover:border-brand/30 transition-colors">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-3">
                <Play size={16} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-black">Episodes</span>
              </div>
              <div className="text-4xl md:text-5xl font-display italic text-white group-hover:text-brand transition-colors">{battles.length}</div>
            </div>
          </div>
        </div>

        {/* Premium Battles Table */}
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">ID</th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">The Battle</th>
                  <th className="hidden lg:table-cell px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Schedule</th>
                  <th className="hidden sm:table-cell px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">Impact</th>
                  <th className="px-6 py-6 md:px-10 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 text-right md:text-left">Status</th>
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
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      onClick={() => navigate(`/battle/${battle.slug}`)}
                      className="group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-6 py-6 md:px-10 md:py-10">
                        <span className="font-mono text-brand text-sm md:text-lg font-black opacity-40 group-hover:opacity-100 transition-opacity">
                          {battle.episode || `1x${String(index + 1).padStart(2, '0')}`}
                        </span>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-10">
                        <div className="flex flex-col gap-2">
                          <div className="grid grid-cols-[120px_auto_120px] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 font-display italic uppercase text-lg md:text-xl text-zinc-100 group-hover:text-brand transition-colors">
                            <div className="text-right flex items-center justify-end gap-2 min-w-0">
                              <span className="truncate">{mc1?.name || battle.mc1}</span>
                              {battle.winner === battle.mc1 && <Trophy size={14} className="text-brand md:w-5 md:h-5 animate-pulse shrink-0" />}
                            </div>
                            
                            <div className="text-zinc-600 text-[9px] md:text-sm font-black shrink-0 px-1">VS</div>
                            
                            <div className="text-left flex items-center gap-2 min-w-0">
                              {battle.winner === battle.mc2 && <Trophy size={14} className="text-brand md:w-5 md:h-5 animate-pulse shrink-0" />}
                              <span className="truncate">{mc2?.name || battle.mc2}</span>
                            </div>
                          </div>
                          <div className="lg:hidden flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand/40" /> {battle.isUnreleased ? "In post-production" : (battle.date || "Scheduled")}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-10 py-10">
                        <div className="flex items-center gap-3 text-zinc-300 text-sm font-black uppercase tracking-widest">
                          <Calendar size={18} className="text-brand opacity-40" />
                          {battle.isUnreleased ? <span className="text-brand underline decoration-brand/30 underline-offset-4">In Production</span> : (battle.date || "TBD")}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-6 md:px-10 md:py-10 text-center">
                        <div className="inline-flex flex-col items-center gap-1 text-zinc-100 font-mono text-sm md:text-lg">
                          <span className="text-[10px] uppercase font-black tracking-tighter text-zinc-600">Views</span>
                          <span className="group-hover:text-brand transition-colors">{battle.views || "---"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-10 md:py-10 text-right md:text-left">
                        <span className={`inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl border ${
                          battle.videoUrl 
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/20" 
                            : "bg-zinc-800 text-zinc-400 border-white/10"
                        }`}>
                          {battle.videoUrl ? "Live Now" : "Coming Soon"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Footer Note */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-16 border border-dashed border-white/10 rounded-[3rem] bg-zinc-900/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h4 className="text-white font-display italic text-3xl md:text-5xl uppercase mb-3 leading-none">WHO RUNS <br className="hidden md:block"/><span className="text-brand">THE ZONE</span></h4>
            <p className="text-zinc-500 text-[10px] md:text-sm uppercase tracking-[0.3em] leading-relaxed font-black opacity-80 mt-6">
              No filters. No protection. <br/>
              If it happens in the ring — <span className="text-white italic">they sanctioned it.</span>
            </p>
          </div>
          <div className="flex items-center gap-4 bg-black/60 px-10 py-6 rounded-full border border-white/10 relative z-10 shadow-2xl">
            <div className="w-3 h-3 rounded-full bg-brand animate-pulse shadow-[0_0_20px_rgba(242,125,38,1)]" />
            <span className="text-sm md:text-lg font-black uppercase tracking-[0.4em] text-white">Live Phase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
