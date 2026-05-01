import { Link } from "react-router-dom";
import { Star, AlertCircle } from "lucide-react";
import { mcs } from "../data/mcs";
import MCCard from "../components/MCCard";

import { calculateRankings } from "../lib/ranking";
import { battles } from "../data/battles";

export default function MCsPage() {
  const rankings = calculateRankings(battles, mcs);
  
  // Sort active MCs based on their calculated rank
  const activeMcs = mcs
    .filter(mc => mc.isActive !== false)
    .sort((a, b) => {
      const rankA = rankings.find(r => r.id === a.id)?.rank || 999;
      const rankB = rankings.find(r => r.id === b.id)?.rank || 999;
      return rankA - rankB;
    });

  const inactiveMcs = mcs.filter(mc => mc.isActive === false);
  const totalMCs = mcs.length;
  const activeMCsCount = activeMcs.length;

  const getRank = (mcId: string) => {
    return rankings.find(r => r.id === mcId)?.rank || 0;
  };

  const getDisplayRank = (mcId: string) => {
    const position = activeMcs.findIndex((mc) => mc.id === mcId);
    return position >= 0 ? position + 1 : getRank(mcId);
  };

  const getPoints = (mcId: string) => {
    return rankings.find(r => r.id === mcId)?.totalScore || 0;
  };

  return (
    <div className="pt-44 pb-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 md:mb-24 gap-12 text-center lg:text-left">
          <div className="flex-1 w-full">
            <div className="flex flex-col items-center lg:items-start gap-6 mb-12">
              <h2 className="text-4xl md:text-7xl font-display uppercase text-white tracking-tighter">
                Season 1 <span className="text-brand">"Most Wanted"</span>
              </h2>
              <div className="flex items-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={28} />
                ))}
              </div>
            </div>
            <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-80 mx-auto lg:mx-0">
              The UK’s Most Wanted. We’ve brought together the scene's heaviest hitters and its most dangerous newcomers 
              under one roof. In the Gzone, your rank isn't a gift, it's a trophy won in battle. Step into the arena where 
              legends are forged and legacies are buried.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full md:w-auto">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl min-w-[160px] shadow-2xl group hover:border-brand/40 transition-all">
              <div className="text-brand font-display text-4xl md:text-6xl mb-1 group-hover:scale-110 transition-transform">{totalMCs}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Roster</div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl min-w-[160px] shadow-2xl group hover:border-brand/40 transition-all">
              <div className="text-white font-display text-4xl md:text-6xl mb-1 group-hover:scale-110 transition-transform">{activeMCsCount}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Now</div>
            </div>
          </div>
        </div>

        {/* Active MCs Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {activeMcs.map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={index} rank={getDisplayRank(mc.id)} points={getPoints(mc.id)} />
            ))}
          </div>
        </div>

        {/* Inactive / Wasted Section */}
        {inactiveMcs.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-red-950/5 blur-[100px] pointer-events-none" />
            <div className="flex items-center gap-4 mb-10 opacity-50">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-2xl md:text-4xl font-display uppercase flex items-center gap-4 text-zinc-500">
                <AlertCircle size={24} /> Wasted
              </h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0 duration-700">
              {inactiveMcs.map((mc, index) => (
                <MCCard key={mc.id} mc={mc} index={index} rank={getRank(mc.id)} points={getPoints(mc.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
