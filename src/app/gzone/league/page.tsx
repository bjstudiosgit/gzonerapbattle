"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { getGzoneStandings } from "../../../data/gzone";

type SortMode = "appearances" | "wins" | "losses" | "winRate" | "lossRate" | "points";

export default function GzoneLeaguePage() {
  const [sortMode, setSortMode] = useState<SortMode>("points");
  const standings = getGzoneStandings();
  const rankings = standings.slice(0, 3);
  const sortedStandings = useMemo(() => {
    return [...standings]
      .sort((a, b) => {
        const comparisons: Record<SortMode, number> = {
          appearances: b.battles - a.battles,
          wins: b.wins - a.wins,
          losses: b.losses - a.losses,
          winRate: getRate(b.wins, b.losses) - getRate(a.wins, a.losses),
          lossRate: getRate(b.losses, b.wins) - getRate(a.losses, a.wins),
          points: b.points - a.points,
        };

        const primary = comparisons[sortMode];
        if (primary !== 0) return primary;
        if (sortMode !== "losses" && a.losses !== b.losses) return a.losses - b.losses;
        return b.battles - a.battles;
      })
      .map((standing, index) => ({ ...standing, rank: index + 1 }));
  }, [standings, sortMode]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-display italic uppercase leading-tight md:text-6xl">
              Gzone <br />
              <span className="text-gzone">League</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 md:mt-6 md:text-lg">
              Current Gzone Season 1 leaderboard. Points are awarded once winners are added.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Trophy size={14} className="text-gzone" /> Current Top 3
            </h3>
            <div className="grid gap-4">
              {rankings.map((mc, index) => (
                <motion.div
                  key={mc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-900/40 p-4 backdrop-blur-sm transition-all hover:border-gzone/30"
                >
                  <Link href={`/mc/${mc.slug}`} className="flex flex-1 items-center gap-4" aria-label={`View ${mc.name}'s profile`}>
                    <div className="relative">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-zinc-800 text-xl font-bold italic text-gzone ${
                          index === 0 ? "border-gzone shadow-[0_0_15px_rgba(255,122,26,0.25)]" : "border-white/10"
                        }`}
                      >
                        {mc.name[0]}
                      </div>
                      <div
                        className={`absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black ${
                          index === 0
                            ? "border-gzone bg-gzone text-black"
                            : index === 1
                              ? "border-zinc-400 bg-zinc-400 text-black"
                              : "border-amber-700 bg-amber-700 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display text-lg italic uppercase transition-colors group-hover:text-gzone">
                        {mc.name}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {mc.wins} Wins • {mc.battles} Battles
                      </p>
                    </div>
                  </Link>
                  <div className="text-right">
                    <div className="font-display text-2xl italic text-gzone">{mc.points}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <section id="league" className="scroll-mt-24 py-24 pt-0">
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
                    ? "border-gzone bg-gzone/10 text-gzone"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-zinc-900/80">
                    <th className="hidden px-2 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:table-cell md:px-8 md:py-6 md:text-xs">
                      Rank
                    </th>
                    <th className="px-2 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      MC Name
                    </th>
                    <th className="px-1 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">Apps</span>
                      <span className="hidden md:inline">Appearances</span>
                    </th>
                    <th className="px-1 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">W</span>
                      <span className="hidden md:inline">Wins</span>
                    </th>
                    <th className="px-1 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">L</span>
                      <span className="hidden md:inline">Losses</span>
                    </th>
                    <th className="px-1 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">WR</span>
                      <span className="hidden md:inline">Win Ratio</span>
                    </th>
                    <th className="px-1 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">LR</span>
                      <span className="hidden md:inline">Loss Ratio</span>
                    </th>
                    <th className="px-2 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300 md:px-8 md:py-6 md:text-xs">
                      <span className="md:hidden">Pts</span>
                      <span className="hidden md:inline">Points</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStandings.map((mc) => (
                    <tr key={mc.id} className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5">
                      <td className="hidden px-2 py-3 md:table-cell md:px-8 md:py-6">
                        <span className={`font-display text-lg italic md:text-2xl ${mc.rank < 4 ? "text-gzone" : "text-zinc-300"}`}>
                          {mc.rank < 10 ? `0${mc.rank}` : mc.rank}
                        </span>
                      </td>
                      <td className="px-2 py-3 md:px-8 md:py-6">
                        <Link href={`/mc/${mc.slug}`} className="flex items-center gap-2 md:gap-4 group/name">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-[10px] font-bold text-gzone transition-colors md:h-10 md:w-10 md:text-base">
                            {mc.name[0]}
                          </div>
                          <span className="whitespace-nowrap text-[11px] font-bold uppercase italic transition-colors group-hover/name:text-gzone md:text-lg">
                            {mc.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-1 py-3 text-center font-mono text-[11px] text-zinc-300 md:px-8 md:py-6 md:text-base">
                        {mc.battles}
                      </td>
                      <td className="px-1 py-3 text-center font-mono text-[11px] text-zinc-300 md:px-8 md:py-6 md:text-base">
                        {mc.wins}
                      </td>
                      <td className="px-1 py-3 text-center font-mono text-[11px] text-zinc-300 md:px-8 md:py-6 md:text-base">
                        {mc.losses}
                      </td>
                      <td className="px-1 py-3 text-center font-mono text-[11px] text-zinc-300 md:px-8 md:py-6 md:text-base">
                        {formatRate(mc.wins, mc.losses)}
                      </td>
                      <td className="px-1 py-3 text-center font-mono text-[11px] text-zinc-300 md:px-8 md:py-6 md:text-base">
                        {formatRate(mc.losses, mc.wins)}
                      </td>
                      <td className="px-2 py-3 text-center text-[11px] font-bold text-zinc-100 md:px-8 md:py-6 md:text-base">
                        {mc.points.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-white/5 bg-zinc-950/50 px-8 py-4">
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Scoring: 3 Points per Win. Pending battles update once winners are added.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/gzone" className="text-sm font-bold uppercase tracking-widest text-gzone hover:underline">
              View Gzone Battle Archive
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function getRate(primary: number, secondary: number): number {
  const total = primary + secondary;
  if (total <= 0) return 0;
  return primary / total;
}

function formatRate(primary: number, secondary: number): string {
  return `${(getRate(primary, secondary) * 100).toFixed(1)}%`;
}
