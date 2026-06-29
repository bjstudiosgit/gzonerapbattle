"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { allMcs } from "../../../data/mcs";
import { formatBattleDate, parseBattleDate } from "../../../data/battleDates";
import { gzoneBattles } from "../../../data/gzone";
import {
  getBattleRouteHref,
  pengameBattles,
} from "../../../data/pengameBattles";
import type { Battle } from "../../../data/battleTypes";
import {
  getBattleParticipants,
  getBattleWinners,
  hasOfficialBattleResult,
  isDrawBattle,
  isLeagueEligibleBattle,
  isUnknownResultBattle,
  isUnresolvedBattle,
} from "../../../data/leagueStandings";
import { motion } from "motion/react";
import {
  Instagram,
  Twitter,
  Youtube,
  Play,
  ChevronLeft,
  Trophy,
  Scale,
  Ruler,
  MapPin,
  Zap,
  Star,
  Clock,
} from "lucide-react";

export default function McDetailClient({ slug }: { slug: string }) {
  const router = useRouter();

  const mc = allMcs.find((m) => m.slug === slug);

  if (!mc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display italic uppercase mb-4">MC Not Found</h1>
          <Link
            href="/mcs"
            className="text-brand hover:underline uppercase tracking-widest text-sm font-bold"
          >
            Back to MCs
          </Link>
        </div>
      </div>
    );
  }

  const mcBattles = [...pengameBattles, ...gzoneBattles]
    .filter(
      (battle) =>
        getBattleParticipants(battle).includes(mc.id) &&
        battle.statusNote !== "Cancelled" &&
        battle.winner !== "cancelled",
    )
    .sort((a, b) => (parseBattleDate(b.date) ?? 0) - (parseBattleDate(a.date) ?? 0));

  const wins = mc.wins;
  const losses = mc.losses;
  const draws = mcBattles.filter(
    (battle) => isLeagueEligibleBattle(battle) && isDrawBattle(battle),
  ).length;
  const unknownResults = mcBattles.filter(
    (battle) => isLeagueEligibleBattle(battle) && isUnknownResultBattle(battle),
  ).length;
  const unresolved = mcBattles.filter(
    (battle) => isLeagueEligibleBattle(battle) && isUnresolvedBattle(battle),
  ).length;
  const battleCount = mc.battles;
  const totalPoints = mc.wins * 3;

  const getMcName = (mcId: string) => allMcs.find((m) => m.id === mcId)?.name || mcId;

  const getBattleSides = (battle: Battle) => {
    const teamA = [battle.mc1, battle.mc3].filter(Boolean) as string[];
    const teamB = [battle.mc2, battle.mc4].filter(Boolean) as string[];
    return teamA.includes(mc.id)
      ? { mcTeam: teamA, opponentTeam: teamB }
      : { mcTeam: teamB, opponentTeam: teamA };
  };

  const getOutcome = (battle: Battle) => {
    if (!isLeagueEligibleBattle(battle)) return "UPCOMING";
    if (!hasOfficialBattleResult(battle)) return "NO RESULT";
    return getBattleWinners(battle).includes(mc.id) ? "WIN" : "LOSS";
  };

  const getEventLabel = (battle: Battle) => {
    if (battle.theme === "pengame") return "PenGame";
    if (battle.theme === "gzone") return "Gzone";
    return battle.theme;
  };

  const getThemeTextClass = (battle: Battle) => battle.theme === "gzone" ? "text-gzone" : "text-brand";
  const getThemeHoverClass = (battle: Battle) => battle.theme === "gzone" ? "group-hover:text-gzone" : "group-hover:text-brand";
  const getThemeHoverBgClass = (battle: Battle) => battle.theme === "gzone" ? "group-hover:bg-gzone" : "group-hover:bg-brand";

  const getBattleHref = (battle: Battle) => getBattleRouteHref(battle);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-white selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors uppercase tracking-[0.2em] text-[10px] font-bold mb-12 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to MC Roster
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src={mc.image}
                alt={mc.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

              {/* Battle Record Badge */}
              <div className="absolute bottom-8 right-8 w-20 h-20 bg-brand rounded-full flex flex-col items-center justify-center text-black shadow-[0_0_30px_rgba(242,125,38,0.4)]">
                <span className="text-[8px] font-black uppercase tracking-[0.25em] leading-none">W-L</span>
                <span className="font-display text-2xl italic leading-none">{mc.wins}-{mc.losses}</span>
              </div>
            </motion.div>
            <div className="mt-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
                Form
              </h2>
              <div className="flex flex-wrap gap-2">
                {mcBattles.map((battle) => {
                  const outcome = getOutcome(battle);
                  const formLabel = outcome === "WIN" ? "W" : outcome === "LOSS" ? "L" : "-";
                  const formClass =
                    outcome === "WIN"
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                      : outcome === "LOSS"
                        ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
                        : "border-white/10 bg-zinc-900/60 text-zinc-500";

                  return (
                    <Link
                      key={battle.id}
                      href={getBattleHref(battle)}
                      title={`${battle.displayTitle || battle.title}: ${outcome}`}
                      aria-label={`${battle.displayTitle || battle.title}: ${outcome}`}
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-black transition-transform hover:-translate-y-0.5 ${formClass}`}
                    >
                      {formLabel}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-none mb-4 tracking-tighter">
                {mc.name}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                <StatBadge
                  icon={<Trophy size={14} />}
                  label={`${wins}-${losses}-${draws} RECORD`}
                  highlight
                />
                <StatBadge icon={<Zap size={14} />} label={`${battleCount} BATTLES`} />
                <StatBadge icon={<Star size={14} />} label={`${totalPoints} POINTS`} />
                {unknownResults > 0 && <StatBadge icon={<Clock size={14} />} label={`${unknownResults} UNKNOWN`} />}
                {unresolved > 0 && <StatBadge icon={<Clock size={14} />} label={`${unresolved} UNRESOLVED`} />}
                {mc.weightClass && <StatBadge icon={<Scale size={14} />} label={mc.weightClass} />}
                {mc.height && <StatBadge icon={<Ruler size={14} />} label={mc.height} />}
                {mc.location && <StatBadge icon={<MapPin size={14} />} label={mc.location} />}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mb-12">
                {mc.instagram && (
                  <a
                    href={`https://instagram.com/${mc.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${mc.name} on Instagram`}
                    className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {mc.twitter && (
                  <a
                    href={`https://twitter.com/${mc.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${mc.name} on Twitter`}
                    className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {mc.youtube && (
                  <a
                    href={`https://youtube.com/${mc.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${mc.name} on YouTube`}
                    className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all"
                  >
                    <Youtube size={20} />
                  </a>
                )}
              </div>

              {/* Biography */}
              <div className="mb-16">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand" />
                  Biography
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">{mc.bio}</p>
              </div>

              {/* Battle History */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand" />
                  Battle History
                </h2>
                <div className="space-y-4">
                  {mcBattles.map((battle) => {
                    const { opponentTeam } = getBattleSides(battle);
                    const opponentId = opponentTeam[0];
                    const opponent = allMcs.find((m) => m.id === opponentId);
                    const opponentLabel = opponentTeam.map(getMcName).join(" & ") || "TBD";
                    const outcome = getOutcome(battle);
                    const outcomeClass =
                      outcome === "WIN"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : outcome === "LOSS"
                          ? "bg-rose-500/20 text-rose-500"
                          : "bg-zinc-700/40 text-zinc-400";
                    const themeTextClass = getThemeTextClass(battle);
                    const themeHoverClass = getThemeHoverClass(battle);
                    const themeHoverBgClass = getThemeHoverBgClass(battle);

                    return (
                      <Link
                        key={battle.id}
                        href={getBattleHref(battle)}
                        className="flex items-center justify-between gap-3 p-4 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                            <img
                              src={opponent?.image || `https://picsum.photos/seed/${opponentId}/100/100`}
                              alt={opponent?.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                VS {opponentLabel}
                              </span>
                              <span
                                className={`${outcomeClass} text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest`}
                              >
                                {outcome}
                              </span>
                            </div>
                            <h3 className={`font-display italic uppercase text-xl ${themeHoverClass} transition-colors truncate`}>
                              {battle.displayTitle || battle.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              <span className={`text-[10px] ${themeTextClass} font-black uppercase tracking-widest`}>
                                {getEventLabel(battle)}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                {battle.views || "0"} views
                              </span>
                              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                                {formatBattleDate(battle.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center ${themeHoverBgClass} group-hover:text-black transition-all shrink-0`}>
                          <Play size={16} fill="currentColor" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


function StatBadge({
  icon,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        highlight ? "bg-brand/5 border-brand/20" : "bg-zinc-900/40 border-white/5"
      }`}
    >
      <div className={highlight ? "text-brand" : "text-zinc-500"}>{icon}</div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          highlight ? "text-brand" : "text-zinc-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
