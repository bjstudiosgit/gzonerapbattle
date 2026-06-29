"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { pengameMcs } from "../data/mcs";
import { pengameBattles } from "../data/pengameBattles";

interface LeagueTableProps {
  limit?: number;
  showTitle?: boolean;
}

type SortMode = "appearances" | "wins" | "losses" | "winRate" | "lossRate" | "points";

export default function LeagueTable({ limit, showTitle = true }: LeagueTableProps) {
  const [sortMode, setSortMode] = useState<SortMode>("points");

  const rankings = useMemo(() => {
    const sorted = [...pengameMcs].sort((a, b) => {
      const comparisons: Record<SortMode, number> = {
        appearances: b.battles - a.battles,
        wins: b.wins - a.wins,
        losses: b.losses - a.losses,
        winRate: getWinRate(b.wins, b.losses) - getWinRate(a.wins, a.losses),
        lossRate: getLossRate(b.wins, b.losses) - getLossRate(a.wins, a.losses),
        points: getPoints(b) - getPoints(a),
      };

      const primary = comparisons[sortMode];
      if (primary !== 0) return primary;
      if (sortMode !== "losses" && a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    });

    return sorted.map((mc, index) => ({
      rank: index + 1,
      id: mc.id,
      slug: mc.slug,
      name: mc.name,
      points: getPoints(mc),
      battles: mc.battles,
      wins: mc.wins,
      losses: mc.losses,
      winRate: getWinRate(mc.wins, mc.losses),
      lossRate: getLossRate(mc.wins, mc.losses),
      unreleased: pengameBattles.filter(b => b.isUnreleased && (b.mc1 === mc.id || b.mc2 === mc.id)).length,
      change: "none",
    }));
  }, [sortMode]);

  const visibleRankings = limit ? rankings.slice(0, limit) : rankings;

  return (
    <section id="league" className="py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Rankings</h2>
            <h3 className="text-5xl font-display italic uppercase">PenGame <span className="text-brand">Leaderboard</span></h3>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            { value: "points", label: "Points" },
            { value: "appearances", label: "Appearances" },
            { value: "wins", label: "Wins" },
            { value: "losses", label: "Losses" },
            { value: "winRate", label: "Win Ratio" },
            { value: "lossRate", label: "Loss Ratio" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortMode(option.value as SortMode)}
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                sortMode === option.value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

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
                  <th className="px-1 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">WR</span>
                    <span className="hidden md:inline">Win Ratio</span>
                  </th>
                  <th className="px-1 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">LR</span>
                    <span className="hidden md:inline">Loss Ratio</span>
                  </th>
                  <th className="px-2 py-3 md:px-8 md:py-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-300 text-center">
                    <span className="md:hidden">Pts</span>
                    <span className="hidden md:inline">Points</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRankings.map((mc) => (
                  <tr key={mc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="hidden md:table-cell px-2 py-3 md:px-8 md:py-6">
                      <span className={`font-display italic text-lg md:text-2xl ${mc.rank < 4 ? "text-brand" : "text-zinc-300"}`}>
                        {mc.rank < 10 ? `0${mc.rank}` : mc.rank}
                      </span>
                    </td>
                    <td className="px-2 py-3 md:px-8 md:py-6">
                      <Link href={`/mc/${mc.slug}`} className="flex items-center gap-2 md:gap-4 group/name">
                        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-zinc-800 border border-white/10 text-brand group-hover/name:border-brand flex items-center justify-center font-bold transition-colors text-[10px] md:text-base shrink-0">
                          {mc.name[0]}
                        </div>
                        <span className="font-bold text-[11px] md:text-lg uppercase italic transition-colors whitespace-nowrap group-hover/name:text-brand">{mc.name}</span>
                      </Link>
                    </td>
                    <td className="px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center text-zinc-300">
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
                    <td className="px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center text-zinc-300">{mc.wins}</td>
                    <td className="px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center text-zinc-300">{mc.losses}</td>
                    <td className="px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center text-zinc-300">
                      {formatWinRate(mc.wins, mc.losses)}
                    </td>
                    <td className="px-1 py-3 md:px-8 md:py-6 font-mono text-[11px] md:text-base text-center text-zinc-300">
                      {formatLossRate(mc.wins, mc.losses)}
                    </td>
                    <td className="px-2 py-3 md:px-8 md:py-6 font-bold text-[11px] md:text-base text-center text-zinc-100">{mc.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {limit && limit < pengameMcs.length && (
            <div className="p-8 bg-zinc-900/30 text-center border-t border-white/5">
              <Link href="/league" className="text-brand font-bold uppercase tracking-widest text-sm hover:underline">
                View Full League Table
              </Link>
            </div>
          )}
          <div className="px-8 py-4 bg-zinc-950/50 border-t border-white/5">
            <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold text-center">
              Scoring: 3 Points per Win
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total <= 0) return "0.0%";
  return `${((wins / total) * 100).toFixed(1)}%`;
}

function getPoints(mc: { wins: number }): number {
  return mc.wins * 3;
}

function getWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total <= 0) return 0;
  return wins / total;
}

function formatLossRate(wins: number, losses: number): string {
  return `${(getLossRate(wins, losses) * 100).toFixed(1)}%`;
}

function getLossRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total <= 0) return 0;
  return losses / total;
}
