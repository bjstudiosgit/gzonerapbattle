import { motion } from "motion/react";
import LeagueTable from "../components/LeagueTable";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings } from "../lib/ranking";
import { Link } from "react-router-dom";
import { Trophy, Shield, Zap, Target, ArrowDown, Activity, Medal, Star } from "lucide-react";

export default function League() {
  const calculatedRankings = calculateRankings(battles, mcs);
  
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
        rank: index + 1
      };
    });

  const getTierColors = (index: number) => {
    switch(index) {
      case 0: return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/40',
        text: 'text-yellow-500',
        shadow: 'shadow-[0_0_80px_rgba(234,179,8,0.15)]',
        medal: 'Gold'
      };
      case 1: return {
        bg: 'bg-zinc-400/10',
        border: 'border-zinc-400/40',
        text: 'text-zinc-400',
        shadow: 'shadow-[0_0_60px_rgba(161,161,170,0.1)]',
        medal: 'Silver'
      };
      case 2: return {
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
                <h2 className="text-4xl md:text-7xl font-display uppercase text-white tracking-tighter">
                  Season 1 <span className="text-brand">"Most Wanted"</span>
                </h2>
                <div className="flex items-center gap-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={28} />
                  ))}
                </div>
              </div>
              
              <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-80 mx-auto lg:mx-0 mb-12">
                The Official League Standings. Every point earned is a testament to skill and dominance in the arena. 
                Track the rankings, monitor the win/loss ratios, and see who is currently leading the "Most Wanted" division.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-brand/20 transition-colors duration-700" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-brand/20 rounded-lg">
                        <Zap size={20} className="text-brand" fill="currentColor" />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display uppercase text-white tracking-tight">
                        The <span className="text-brand">Ranking</span> System
                      </h3>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6">Base Points System</p>
                        <div className="flex items-center justify-between max-w-md">
                          <div className="flex flex-col">
                            <span className="text-white text-3xl md:text-5xl font-display">3 PTS</span>
                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Win</span>
                          </div>
                          <div className="w-px h-12 bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-zinc-400 text-3xl md:text-5xl font-display">1 PT</span>
                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Match</span>
                          </div>
                          <div className="w-px h-12 bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-zinc-600 text-3xl md:text-5xl font-display">0 PTS</span>
                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Loss</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed border-l-2 border-brand/30 pl-6 italic max-w-xl">
                        “We use a ranked system similar to competitive sports and gaming. An MC’s position is determined by who they beat, not just how many wins they have. This ensures that the biggest upsets are rewarded fairly. Take risks and you climb faster. Play it safe and you stay where you are.”
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6 md:p-8">
                       <div className="flex items-center justify-between mb-8">
                         <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Bonus Points Table</span>
                         <div className="px-3 py-1 bg-brand/10 rounded-full text-brand text-[8px] font-black uppercase tracking-widest">Rank Difference</div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { range: "1–3 UP", bonus: "+1", desc: "UP" },
                          { range: "4–7 UP", bonus: "+2", desc: "UP" },
                          { range: "8+ UP", bonus: "+3", desc: "UP" }
                        ].map((item, i) => (
                          <div key={i} className="relative group/box overflow-hidden bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-brand/40 transition-colors text-center">
                            <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{item.range}</div>
                            <div className="text-3xl font-display text-brand mb-1">{item.bonus}</div>
                            <div className="text-zinc-500 text-[7px] font-black uppercase tracking-tighter opacity-40">Bonus Pts</div>
                          </div>
                        ))}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Gold, Silver, Bronze Podiums */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-14 mb-32 relative px-4 md:px-0 pt-8">
          {top3.map((mc, index) => {
             const tier = getTierColors(index);
             const isGold = index === 0;

             return (
              <motion.div
                key={mc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative p-10 md:p-12 rounded-[3.5rem] border group transition-all duration-700 hover:-translate-y-2 ${
                  tier.bg
                } ${tier.border} ${tier.shadow} ${
                  index === 0 ? 'lg:order-2 lg:scale-110 lg:z-20' : 
                  index === 1 ? 'lg:order-1' : 
                  'lg:order-3'
                }`}
              >
                <div className="absolute -top-8 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-1.5">
                  {[...Array(index === 0 ? 5 : index === 1 ? 4 : 3)].map((_, i) => (
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
                    src={mc.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover grayscale opacity-35 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />
                <div className={`absolute inset-0 opacity-30 ${tier.bg}`} />
                </div>

                 <div className="relative z-10 flex items-center justify-between mb-48 md:mb-56">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display text-3xl border-2 transition-all ${
                    isGold ? 'bg-yellow-500 text-black border-yellow-500' : 
                    index === 1 ? 'bg-zinc-400 text-black border-zinc-400' :
                    'bg-amber-700 text-black border-amber-700'
                  }`}>
                    {mc.rank === 1 ? '01' : `0${mc.rank}`}
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-display tracking-tighter drop-shadow-md ${tier.text}`}>{mc.points}</p>
                  </div>
                </div>

                <div className="relative z-10 text-center">
                  {/* WANTED Badge for the single top-ranked MC */}
                  {mc.rank === 1 && (
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
                      isGold ? 'bg-yellow-500' : index === 1 ? 'bg-zinc-400' : 'bg-amber-700'
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
