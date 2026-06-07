import { motion } from "motion/react";
import LeagueTable from "../components/LeagueTable";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings, getRankStars } from "../lib/ranking";
import { Link } from "react-router-dom";
import { Trophy, Shield, Target, ArrowDown, Activity, Medal, Star } from "lucide-react";
import { portraitImage } from "../lib/images";

export default function League() {
  const calculatedRankings = calculateRankings(battles, mcs);
  const topScore = calculatedRankings[0]?.totalScore ?? 0;

  const top3 = calculatedRankings
    .filter(rankData => rankData.id !== 'ldn-mikez')
    .slice(0, 3)
    .map((rankData, index) => {
      const mcData = mcs.find(m => m.id === rankData.id);
      return {
        id: rankData.id,
        slug: mcData?.slug || rankData.id,
        name: mcData?.name || rankData.id,
        image: mcData?.image,
        wins: rankData.wins,
        battles: rankData.battles,
        points: rankData.totalScore,
        rank: rankData.rank
      };
    });

  const getTierColors = (rankValue: number) => {
    switch(rankValue) {
      case 1: return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/40',
        text: 'text-yellow-500',
        shadow: 'shadow-[0_0_80px_rgba(234,179,8,0.15)]',
        medal: 'Gold'
      };
      case 2: return {
        bg: 'bg-zinc-400/10',
        border: 'border-zinc-400/40',
        text: 'text-zinc-400',
        shadow: 'shadow-[0_0_60px_rgba(161,161,170,0.1)]',
        medal: 'Silver'
      };
      case 3: return {
        bg: 'bg-amber-700/10',
        border: 'border-amber-700/40',
        text: 'text-amber-700',
        shadow: 'shadow-[0_0_60px_rgba(180,83,9,0.1)]',
        medal: 'Bronze'
      };
      default: return {
        bg: 'bg-zinc-900/40',
        border: 'border-white/5',
        text: 'text-white',
        shadow: '',
        medal: ''
      };
    }
  };

  return (
    <div className="min-h-screen pt-44 pb-24 relative overflow-hidden bg-zinc-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 font-display text-[30vw] text-white/[0.02] uppercase leading-none select-none tracking-tighter">
          Champions
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-24 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 text-center lg:text-left">
            <div className="w-full">
              <div className="flex flex-col items-center lg:items-start gap-6 mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-brand">
                  <Trophy size={14} className="text-brand" />
                  Season 1 Standings
                </div>
                <h2 className="text-4xl md:text-7xl font-display uppercase text-white tracking-tighter leading-[0.9]">
                  Most <span className="text-brand">Wanted</span>
                </h2>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={22} />
                  ))}
                </div>
              </div>

              <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-90 mx-auto lg:mx-0 mb-12">
                The scoring system is simple: 3 points for a win and 1 point for a loss.
                Track the rankings, monitor win/loss ratios, and see who is currently leading Season 1.
              </p>
              
            </div>
          </div>
        </header>

        {/* Gold, Silver, Bronze Podiums */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-14 mb-32 relative px-4 md:px-0 pt-8">
          {top3.map((mc, index) => {
             const isChampion = mc.points === topScore;
             const tier = getTierColors(isChampion ? 1 : mc.rank);
             const isGold = isChampion;

             return (
              <motion.div
                key={mc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative p-10 md:p-12 rounded-[3.5rem] border group transition-all duration-700 hover:-translate-y-2 ${
                  tier.bg
                } ${tier.border} ${tier.shadow} lg:h-[38rem] ${
                  isChampion ? 'lg:scale-110 lg:z-20' : 'lg:scale-100'
                } ${
                  index === 0 ? 'lg:order-2' : 
                  index === 1 ? 'lg:order-1' : 
                  'lg:order-3'
                }`}
              >
                <div className="absolute -top-8 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-1.5">
                  {[...Array(getRankStars(mc.rank))].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.45)] animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 rounded-[3.5rem] overflow-hidden">
                {mc.image && (
                  <img
                    src={portraitImage(mc.image, "profile")}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover grayscale opacity-35 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/seed/${mc.id}/600/800`;
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />
                <div className={`absolute inset-0 opacity-30 ${tier.bg}`} />
                </div>

                 <div className="relative z-10 flex items-center justify-between mb-48 md:mb-56">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display text-3xl border-2 transition-all ${
                    isGold ? 'bg-yellow-500 text-black border-yellow-500' : 
                    mc.rank === 2 ? 'bg-zinc-400 text-black border-zinc-400' :
                    'bg-amber-700 text-black border-amber-700'
                  }`}>
                    {mc.rank === 1 ? '01' : `0${mc.rank}`}
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-display tracking-tighter drop-shadow-md ${tier.text}`}>{mc.points}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 mt-1">PTS</p>
                  </div>
                </div>

                <div className="relative z-10 text-center">
                  {/* WANTED Badge for the top-ranked MCs */}
                  {mc.rank <= 3 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none scale-75 md:scale-100">
                      <div className="border-4 border-red-600 px-6 py-2 transform -rotate-12 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                        <span className="text-red-600 font-display text-4xl md:text-5xl tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">WANTED</span>
                      </div>
                    </div>
                  )}

                  {!mc.image && (
                    <div className="relative inline-block mb-10">
                      <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 bg-zinc-900 ${tier.border}`}>
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-display text-6xl text-zinc-500">
                          {mc.name[0]}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Link to={`/mc/${mc.slug}`} className="block group/link">
                    <h3 className={`text-4xl md:text-5xl font-display uppercase leading-none mb-6 transition-colors ${tier.text} group-hover/link:opacity-80`}>
                      {mc.name.split(' ')[0]} <br/> <span className="text-white">{mc.name.split(' ')[1] || ''}</span>
                    </h3>
                  </Link>
                  
                  <div className="flex flex-col items-center gap-3 text-[11px] uppercase font-black tracking-[0.4em] text-zinc-500 mt-10">
                     <div className="flex items-center gap-3">
                       <span className={tier.text}>{mc.wins} Wins</span>
                       <span className="opacity-20">•</span>
                       <span>{mc.battles} Clashes</span>
                     </div>
                  </div>
                </div>

                {/* Progress Strip */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, delay: index * 0.3 }}
                      className={`h-full ${
                      isGold ? 'bg-yellow-500' : mc.rank === 2 ? 'bg-zinc-400' : 'bg-amber-700'
                    }`}
                  />
                </div>
              </motion.div>
             );
          })}
        </div>


        
        {/* Full Table Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-14 relative"
        >
          <LeagueTable showTitle={false} />
        </motion.div>
      </div>
    </div>
  );
}
