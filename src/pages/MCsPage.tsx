import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { mcs } from "../data/mcs";
import MCCard from "../components/MCCard";
import StaffPage from "./StaffPage";

import { calculateRankings } from "../lib/ranking";
import { seasonOneBattles } from "../data/battles";
import { initialStreetEpisodes } from "./GzoneStreetFreestyles";
import { portraitImage } from "../lib/images";

export default function MCsPage() {
  const rankings = calculateRankings(seasonOneBattles, mcs);
  
  // Sort active MCs based on their calculated rank
  const activeMcs = mcs
    .filter(mc => mc.isActive !== false)
    .sort((a, b) => {
      const rankA = rankings.find(r => r.id === a.id)?.rank || 999;
      const rankB = rankings.find(r => r.id === b.id)?.rank || 999;
      return rankA - rankB;
    });

  const inactiveMcs = mcs.filter(mc => mc.isActive === false);
  const featuredBattleIds = new Set(["kime", "tricky", "afrodon"]);
  const battleMcs = activeMcs.filter(mc => mc.battles > 0 || featuredBattleIds.has(mc.id));
  const rosterMcs = [...battleMcs, ...inactiveMcs];
  const otherMcs = activeMcs.filter(mc => mc.battles === 0 && !featuredBattleIds.has(mc.id)).sort((a, b) => (a.id === "mello" ? -1 : b.id === "mello" ? 1 : 0));
  const guestRappers = [
    { name: "Cookie", image: "https://img.youtube.com/vi/d5YMlQZdNO4/hqdefault.jpg", href: "/battle/royal-rumble" },
    { name: "M.J", image: "https://img.youtube.com/vi/Cjh9PfQYe44/hqdefault.jpg", href: "/battle/royal-rumble-ep2" },
    ...initialStreetEpisodes
      .filter(episode => !mcs.some(mc => mc.name.toLowerCase() === episode.artist.toLowerCase()) && episode.artist !== "Passive")
      .map(episode => ({ name: episode.artist, image: `https://img.youtube.com/vi/${episode.videoId}/hqdefault.jpg`, href: `/outside?video=${episode.videoId}` })),
  ];
  const totalMCs = rosterMcs.length;
  const activeMCsCount = battleMcs.length;

  const getPoints = (mcId: string) => {
    return rankings.find(r => r.id === mcId)?.totalScore || 0;
  };

  return (
    <div className="pt-32 lg:pt-44 pb-16 lg:pb-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-10 lg:mb-24 gap-7 lg:gap-12 text-center lg:text-left">
          <div className="flex-1 w-full">
            <div className="flex flex-col items-center lg:items-start gap-3 md:gap-4 lg:gap-6 mb-5 lg:mb-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase text-white tracking-tighter leading-[0.9]">
                Battle <span className="text-brand">Rappers</span>
              </h2>
              <p className="text-brand font-black uppercase tracking-[0.3em] text-xs md:text-sm">Season 1 "Most Wanted"</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
                ))}
              </div>
            </div>
            <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-80 mx-auto lg:mx-0">
              The UK’s Most Wanted. We’ve brought together the scene's heaviest hitters and its most dangerous newcomers 
              under one roof. In the Gzone, your rank isn't a gift, it's a trophy won in battle. Step into the arena where 
              legends are forged and legacies are buried.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] md:min-w-[360px] shadow-2xl group hover:border-brand/30 transition-colors">
              <div className="grid grid-cols-3 gap-4 md:gap-6 text-center md:text-left">
                <div>
                  <div className="text-3xl md:text-[2.15rem] font-display text-brand group-hover:text-white transition-colors">{totalMCs}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Players</div>
                </div>
                <div className="px-2">
                  <div className="text-3xl md:text-[2.15rem] font-display text-emerald-400 group-hover:text-emerald-300 transition-colors">{activeMCsCount}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Alive</div>
                </div>
                <div>
                  <div className="text-3xl md:text-[2.15rem] font-display text-red-500 group-hover:text-red-400 transition-colors">{inactiveMcs.length}</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Wasted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle rappers, with wasted MCs continuing the same roster */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
            {rosterMcs.map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={index} rank={index + 1} points={getPoints(mc.id)} />
            ))}
          </div>
        </div>

        <section aria-labelledby="rappers-heading" className="mt-20 md:mt-28">
          <h2 id="rappers-heading" className="mb-8 font-display text-4xl uppercase text-white md:text-6xl">Rappers</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
            {otherMcs.map((mc) => (
              <Link key={mc.id} to={`/mc/${mc.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 hover:border-brand/60" aria-label={`View ${mc.name} profile`}>
                <img src={portraitImage(mc.image, "card")} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-2xl uppercase leading-none text-white group-hover:text-brand">{mc.name}</h3>
                </div>
              </Link>
            ))}
            {guestRappers.map((rapper) => (
              <Link key={rapper.name} to={rapper.href} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 hover:border-brand/60" aria-label={`View ${rapper.name} appearance`}>
                <img src={rapper.image} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-2xl uppercase leading-none text-white group-hover:text-brand">{rapper.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <StaffPage embedded />
    </div>
  );
}
