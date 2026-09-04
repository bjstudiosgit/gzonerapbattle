import { freestyleBattles, lastUpdated, seasonOneBattles } from "../data/battles";
import type { ReactNode } from "react";
import { mcs } from "../data/mcs";
import { Link, useNavigate } from "react-router-dom";
import { Play, Eye, Calendar, Trophy, Star } from "lucide-react";
import { calculateTotalViews, sortBattlesById } from "../lib/battleUtils";

function ScheduleLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "text-brand animate-pulse underline decoration-brand/30 underline-offset-4";
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} onClick={(e) => e.stopPropagation()} className={className}>
      {children}
    </Link>
  );
}

export default function BattlesPage({ variant = "season1" }: { variant?: "season1" | "freestyle" }) {
  const navigate = useNavigate();
  const isFreestyle = variant === "freestyle";
  const orderedBattles = sortBattlesById(isFreestyle ? freestyleBattles : seasonOneBattles);
  const totalViewsStr = calculateTotalViews(orderedBattles);
  const liveNowCount = orderedBattles.filter((battle) => battle.videoUrl).length;
  const inProductionCount = orderedBattles.filter((battle) => !battle.videoUrl && Boolean(battle.winner || battle.resultLabel)).length;
  const outstandingCount = orderedBattles.filter((battle) => battle.isUnreleased && !battle.videoUrl && !battle.winner && !battle.resultLabel).length;

  return (
    <div className="min-h-screen pt-32 md:pt-44 pb-16 md:pb-24 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="page-shell w-full max-w-[1200px] mx-auto px-[14px] md:px-5 lg:px-8 relative z-10">
        {/* Cinematic Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12 text-center lg:text-left">
          <div className="flex-1 w-full">
            <div className="flex flex-col items-center lg:items-start gap-4 md:gap-6 mb-8 md:mb-12">
              <h2 className="text-[clamp(2rem,10vw,3rem)] md:text-7xl font-display uppercase text-white tracking-tighter leading-[0.95] whitespace-normal md:whitespace-nowrap">
                {isFreestyle ? (
                  <>Freestyle <br className="md:hidden" /><span className="text-brand">League</span></>
                ) : (
                  <>Season 1 <br className="md:hidden" /><span className="text-brand">"Most Wanted"</span></>
                )}
              </h2>
              <div className="flex items-center gap-2 md:gap-3 scale-75 md:scale-100 origin-center md:origin-left">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
                ))}
              </div>
            </div>
            <p className="text-zinc-400 text-[0.95rem] md:text-lg max-w-full md:max-w-3xl leading-[1.6] md:leading-relaxed tracking-tight font-medium opacity-80 mx-auto lg:mx-0">
              {isFreestyle
                ? "The official archive of Gzone Freestyle League clashes. Follow every off-the-top battle, result, release, and moment from the Freestyle division."
                : "The archive of high-stakes collisions. Every clash recorded here is a piece of Gzone history, where the UK's top-tier MCs settled scores and established dominance. Review the impact, track the views, and relive the battles that defined the \"Most Wanted\" division."}
            </p>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full lg:w-auto">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-[2rem] flex-1 md:min-w-[220px] shadow-2xl group hover:border-brand/30 transition-colors">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-3">
                <Eye size={16} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-black">Total Engagement</span>
              </div>
              <div className="text-4xl md:text-5xl font-display text-white mb-1 group-hover:text-brand transition-colors">{totalViewsStr}</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest text-center md:text-left font-bold opacity-60">Synced: {lastUpdated}</div>
            </div>
            
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-[2rem] flex-1 md:min-w-[280px] shadow-2xl group hover:border-brand/30 transition-colors">
              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mb-5">
                <Play size={16} className="text-brand" />
                <span className="text-[10px] uppercase tracking-widest font-black">{isFreestyle ? "Freestyle League" : "Season 1 In Progress"}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6 text-center md:text-left">
                <div>
                  <div className="text-3xl md:text-[2.15rem] font-display text-emerald-400 group-hover:text-emerald-300 transition-colors">{liveNowCount}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Live Now</div>
                </div>
                <div className="px-2">
                  <div className="text-3xl md:text-[2.15rem] font-display text-brand group-hover:text-white transition-colors">{inProductionCount}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Production</div>
                </div>
                <div>
                  <div className="text-3xl md:text-[2.15rem] font-display text-zinc-300 group-hover:text-white transition-colors">{outstandingCount}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Scheduled</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Battles Table */}
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="sm:hidden p-4">
            <div className="grid gap-4">
              {orderedBattles.map((battle, index) => {
                const mc1 = mcs.find(m => m.id === battle.mc1);
                const mc2 = mcs.find(m => m.id === battle.mc2);
                const [titleMc1 = battle.mc1, titleMc2 = battle.mc2] = battle.title.split(" vs ");
                const mc1Name = mc1?.name || titleMc1 || battle.mc1;
                const mc2Name = mc2?.name || titleMc2 || battle.mc2;
                const isVsBattle = battle.title.toLowerCase().includes(" vs ");
                const isInProduction = !battle.videoUrl && Boolean(battle.winner || battle.resultLabel);
                const isTicketsOnSaleSoon = !battle.videoUrl && !isInProduction && (Boolean(battle.ticketsOnSaleSoon) || !battle.ticketUrl || battle.ticketUrl === "/events");
                const isTicketsOnSale = !battle.videoUrl && !isInProduction && !isTicketsOnSaleSoon && Boolean(battle.ticketUrl);

                return (
                  <button
                    key={battle.id}
                    type="button"
                    onClick={() => navigate(battle.ticketUrl || `/battle/${battle.slug}`)}
                    className="block w-full text-left bg-zinc-900/80 border border-white/5 rounded-2xl p-5 shadow-xl transition-all active:scale-[0.98]"
                  >
                    <div className="text-brand font-mono text-sm font-black opacity-80 mb-2">
                      #{battle.episode || (!battle.isUnreleased ? `0${index + 1}` : "TBC")}
                    </div>
                    {!isVsBattle ? (
                      <div className="mb-4">
                        <div className="font-display text-[1.35rem] leading-none uppercase text-white flex items-center gap-2">
                          <span>{battle.title}</span>
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">9-MC Clash</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-medium mt-1 truncate">
                          Tricky • Cookie • Passive • Deeno • Mello • 1 Flaymah • Btizz • Badee Harz • Jai-D
                        </p>
                      </div>
                    ) : (
                      <div className="font-display text-[1.35rem] leading-none uppercase text-white mb-4 flex items-center gap-2">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{mc1Name}</span>
                          {battle.winner === battle.mc1 && <Trophy size={14} className="text-brand shrink-0 animate-pulse" />}
                        </span>
                        <span className="text-zinc-600 text-sm font-black px-1 shrink-0">VS</span>
                        <span className="flex items-center gap-1.5 min-w-0">
                          {battle.winner === battle.mc2 && <Trophy size={14} className="text-brand shrink-0 animate-pulse" />}
                          <span className="truncate">{mc2Name}</span>
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 text-xs font-black tracking-widest uppercase">
                      <div className="text-zinc-500">
                        Impact: <span className="text-zinc-100 font-mono ml-1">{!battle.isUnreleased ? (battle.views || "---") : "---"}</span>
                      </div>
                      <div className="text-zinc-500">
                        Status: <span className={`ml-1 ${battle.videoUrl ? "text-emerald-400" : "text-brand"}`}>
                          {battle.videoUrl ? "Live" : isInProduction ? "In Production" : isTicketsOnSaleSoon ? "Tickets on Sale Soon" : isTicketsOnSale ? "Tickets on Sale" : "Coming Soon"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:block overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-0">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-6 md:px-8 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap w-24">ID</th>
                  <th className="px-6 py-6 md:px-8 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">The Battle</th>
                  <th className="hidden sm:table-cell px-6 py-6 md:px-8 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center whitespace-nowrap w-28">Impact</th>
                  <th className="hidden lg:table-cell px-6 md:px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap min-w-[200px]">Schedule</th>
                  <th className="px-6 py-6 md:px-8 md:py-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 text-right md:text-left whitespace-nowrap min-w-[190px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orderedBattles.map((battle, index) => {
                  const mc1 = mcs.find(m => m.id === battle.mc1);
                  const mc2 = mcs.find(m => m.id === battle.mc2);
                  const [titleMc1 = battle.mc1, titleMc2 = battle.mc2] = battle.title.split(" vs ");
                  const isVsBattle = battle.title.toLowerCase().includes(" vs ");
                  const leftPair = titleMc1.split("&").map(name => name.trim()).filter(Boolean);
                  const rightPair = titleMc2.split("&").map(name => name.trim()).filter(Boolean);
                  const isTwoVsTwo = leftPair.length === 2 && rightPair.length === 2;
                  const mc1Name = isTwoVsTwo ? titleMc1 : (mc1?.name || titleMc1 || battle.mc1);
                  const mc2Name = isTwoVsTwo ? titleMc2 : (mc2?.name || titleMc2 || battle.mc2);
                  const scheduleText = battle.date || "Coming Soon";
                  const scheduleLink = battle.ticketUrl || "/events";
                  const isInProduction = !battle.videoUrl && Boolean(battle.winner || battle.resultLabel);
                  const isTicketsOnSaleSoon = !battle.videoUrl && !isInProduction && (Boolean(battle.ticketsOnSaleSoon) || !battle.ticketUrl || battle.ticketUrl === "/events");
                  const isTicketsOnSale = !battle.videoUrl && !isInProduction && !isTicketsOnSaleSoon && Boolean(battle.ticketUrl);
                  const shouldShowComingSoon = battle.isUnreleased && Boolean(battle.ticketUrl);
                  
                  return (
                    <tr 
                      key={battle.id} 
                      onClick={() => navigate(battle.ticketUrl || `/battle/${battle.slug}`)}
                      className="group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-6 py-6 md:px-8 md:py-10 whitespace-nowrap">
                        <span className="font-mono text-brand text-sm md:text-lg font-black opacity-40 group-hover:opacity-100 transition-opacity">
                          {battle.episode || (!battle.isUnreleased ? `1x${String(index + 1).padStart(2, '0')}` : "")}
                        </span>
                      </td>
                      <td className="px-6 py-6 md:px-8 md:py-10">
                        <div className="flex flex-col gap-2">
                          {isTwoVsTwo ? (
                            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] grid-rows-2 items-center gap-x-3 gap-y-1 font-display uppercase text-lg md:text-xl text-zinc-100 group-hover:text-brand transition-colors">
                              <div className="text-right truncate">{leftPair[0]}</div>
                              <div className="row-span-2 text-zinc-600 text-[9px] md:text-sm font-black shrink-0 px-1">V</div>
                              <div className="text-left truncate">{rightPair[0]}</div>
                              <div className="text-right truncate">{leftPair[1]}</div>
                              <div className="text-left truncate">{rightPair[1]}</div>
                            </div>
                          ) : !isVsBattle ? (
                            <div className="flex items-center gap-3 font-display uppercase text-lg md:text-xl text-zinc-100 group-hover:text-brand transition-colors">
                              <span>{battle.title}</span>
                              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20 shrink-0">
                                9-MC Clash
                              </span>
                              <span className="text-xs font-sans font-medium text-zinc-400 normal-case truncate hidden lg:inline">
                                Tricky, Cookie, Passive, Deeno, Mello, 1 Flaymah, Btizz, Badee Harz, Jai-D
                              </span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-[120px_auto_120px] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 font-display uppercase text-lg md:text-xl text-zinc-100 group-hover:text-brand transition-colors">
                              <div className="text-right flex items-center justify-end gap-2 min-w-0">
                                <span className="truncate">{mc1Name}</span>
                                {battle.winner === battle.mc1 && <Trophy size={14} className="text-brand md:w-5 md:h-5 animate-pulse shrink-0" />}
                              </div>
                              
                              <div className="text-zinc-600 text-[9px] md:text-sm font-black shrink-0 px-1">VS</div>
                              
                              <div className="text-left flex items-center gap-2 min-w-0">
                                {battle.winner === battle.mc2 && <Trophy size={14} className="text-brand md:w-5 md:h-5 animate-pulse shrink-0" />}
                                <span className="truncate">{mc2Name}</span>
                              </div>
                            </div>
                          )}
                          <div className="lg:hidden flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-brand/40 shrink-0" /> 
                              {battle.isUnreleased || shouldShowComingSoon ? (
                                <ScheduleLink href={scheduleLink}>
                                  {scheduleText}
                                </ScheduleLink>
                              ) : (battle.date || "Scheduled")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-6 md:px-8 md:py-10 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1 text-zinc-100 font-mono text-sm md:text-lg">
                          <span className="text-[10px] uppercase font-black tracking-tighter text-zinc-600">Views</span>
                          <span className="group-hover:text-brand transition-colors">{!battle.isUnreleased ? (battle.views || "---") : "---"}</span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 md:px-8 py-10 whitespace-nowrap min-w-[200px]">
                        <div className="flex items-center gap-3 text-zinc-300 text-sm font-black uppercase tracking-widest whitespace-nowrap">
                          <Calendar size={18} className="text-brand opacity-40 shrink-0" />
                          {battle.isUnreleased || shouldShowComingSoon ? (
                            <ScheduleLink href={scheduleLink}>
                              {scheduleText}
                            </ScheduleLink>
                          ) : (battle.date || "TBD")}
                        </div>
                      </td>
                      <td className="px-6 py-6 md:px-8 md:py-10 text-right md:text-left whitespace-nowrap min-w-[190px]">
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                          <span className={`inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl border whitespace-nowrap ${
                            battle.videoUrl 
                              ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/20" 
                              : "bg-zinc-900 border-zinc-700 text-zinc-500"
                          }`}>
                            {battle.videoUrl ? "Live Now" : isInProduction ? "In Production" : isTicketsOnSaleSoon ? "Tickets on Sale Soon" : isTicketsOnSale ? "Tickets on Sale" : "Coming Soon"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

