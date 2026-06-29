import Link from "next/link";
import { Calendar, CircleDot, Eye, Play, Trophy } from "lucide-react";
import { formatBattleDate } from "../../data/battleDates";
import { gzoneBattles } from "../../data/gzone";
import { getBattleRouteHref } from "../../data/pengameBattles";

export const metadata = {
  title: "Gzone League | Lord of the Archives",
  description: "Gzone Season 1 battles and league standings.",
};

const parseViews = (views: string | number | null | undefined): number => {
  if (!views) return 0;
  const clean = String(views).replace(/,/g, "").toUpperCase();
  if (clean.endsWith("K")) return Number(clean.replace("K", "")) * 1000;
  if (clean.endsWith("M")) return Number(clean.replace("M", "")) * 1000000;
  return Number(clean) || 0;
};

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
};

export default function GzonePage() {
  const totalViews = gzoneBattles.reduce((total, battle) => total + parseViews(battle.views), 0);
  const sortedBattles = [...gzoneBattles].sort((a, b) => (a.seasonOrder || 0) - (b.seasonOrder || 0));

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24 text-white selection:bg-gzone selection:text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-wide text-zinc-400">Gzone</p>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Gzone <span className="text-gzone">League</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
              Season 1 battle archive.
            </p>
            <Link
              href="/gzone/league"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gzone/40 bg-gzone/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gzone transition-colors hover:bg-gzone hover:text-black"
            >
              <Trophy size={16} />
              Gzone League
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatCard icon={<Eye size={14} />} label="YouTube Views" value={formatViews(totalViews)} />
            <StatCard icon={<Play size={14} />} label="Total Battles" value={String(gzoneBattles.length)} />
          </div>
        </div>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <CircleDot className="text-gzone" size={20} />
            <h2 className="text-2xl font-display italic uppercase">Season 1 Battles</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/20">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-zinc-900/40">
                    <th className="px-3 py-4 text-xs font-semibold tracking-wide text-zinc-400 md:px-6">Ep</th>
                    <th className="px-3 py-4 text-xs font-semibold tracking-wide text-zinc-400 md:px-6">Battle</th>
                    <th className="hidden px-3 py-4 text-xs font-semibold tracking-wide text-zinc-400 md:table-cell md:px-6">Date</th>
                    <th className="hidden px-3 py-4 text-xs font-semibold tracking-wide text-zinc-400 md:table-cell md:px-6">Views</th>
                    <th className="px-3 py-4 text-right text-xs font-semibold tracking-wide text-zinc-400 md:px-6 md:text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedBattles.map((battle) => (
                    <tr key={battle.id} className="transition-colors hover:bg-white/5">
                      <td className="px-3 py-4 font-mono text-xs text-gzone md:px-6">
                        <Link href={getBattleRouteHref(battle)} className="hover:underline">
                          {battle.customEp}
                        </Link>
                      </td>
                      <td className="px-3 py-4 md:px-6">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase italic text-zinc-100 md:text-lg">
                          <Link href={`/mc/${battle.mc1}`} className="transition-colors hover:text-gzone hover:underline">
                            {battle.title.split(" vs ")[0]}
                          </Link>
                          {battle.winner === battle.mc1 && <Trophy size={14} className="text-gzone md:h-[18px] md:w-[18px]" />}
                          <Link href={getBattleRouteHref(battle)} className="text-xs text-zinc-500 transition-colors hover:text-gzone">
                            VS
                          </Link>
                          {battle.winner === battle.mc2 && <Trophy size={14} className="text-gzone md:h-[18px] md:w-[18px]" />}
                          <Link href={`/mc/${battle.mc2}`} className="transition-colors hover:text-gzone hover:underline">
                            {battle.title.split(" vs ")[1]}
                          </Link>
                        </div>
                      </td>
                      <td className="hidden px-3 py-4 text-xs text-zinc-400 md:table-cell md:px-6">
                        <span className="inline-flex items-center gap-2">
                          <Calendar size={14} className="text-zinc-600" />
                          {formatBattleDate(battle.date)}
                        </span>
                      </td>
                      <td className="hidden px-3 py-4 font-mono text-xs text-zinc-100 md:table-cell md:px-6">
                        {battle.views}
                      </td>
                      <td className="px-3 py-4 text-right md:px-6 md:text-left">
                        <span className="inline-flex items-center rounded-full border border-gzone/30 bg-gzone/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gzone">
                          {battle.statusNote}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-[160px] rounded-3xl border border-white/5 bg-zinc-900/30 p-6">
      <div className="mb-2 flex items-center gap-2 text-zinc-400">
        <span className="text-gzone">{icon}</span>
        <span className="text-[11px] font-semibold tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
