import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, Minus } from "lucide-react";
import { mcs } from "../data/mcs";

interface LeagueTableProps {
  limit?: number;
  showTitle?: boolean;
}

export default function LeagueTable({ limit, showTitle = true }: LeagueTableProps) {
  // Sort MCs by battle count for now as a proxy for ranking
  let rankings = [...mcs]
    .sort((a, b) => b.battles - a.battles)
    .map((mc, index) => ({
      rank: index + 1,
      id: mc.id,
      name: mc.name,
      points: mc.battles * 100, // Placeholder points
      battles: mc.battles,
      change: "none"
    }));

  if (limit) {
    rankings = rankings.slice(0, limit);
  }

  return (
    <section id="league" className="py-24">
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
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Rank</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-zinc-500">MC Name</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Battles</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Points</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Trend</th>
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
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <span className={`font-display italic text-2xl ${index < 3 ? 'text-brand' : 'text-zinc-400'}`}>
                        {mc.rank < 10 ? `0${mc.rank}` : mc.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <Link to={`/mc/${mc.id}`} className="flex items-center gap-4 group/name">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-brand group-hover/name:border-brand transition-colors">
                          {mc.name[0]}
                        </div>
                        <span className="font-bold text-lg uppercase italic group-hover/name:text-brand transition-colors">{mc.name}</span>
                      </Link>
                    </td>
                    <td className="px-8 py-6 text-zinc-400 font-mono">{mc.battles}</td>
                    <td className="px-8 py-6 font-bold text-zinc-100">{mc.points.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      {mc.change === "up" && <TrendingUp className="text-emerald-500" size={20} />}
                      {mc.change === "none" && <Minus className="text-zinc-600" size={20} />}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {limit && limit < mcs.length && (
            <div className="p-8 bg-zinc-900/30 text-center">
              <Link to="/league" className="text-brand font-bold uppercase tracking-widest text-sm hover:underline">
                View Full League Table
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
