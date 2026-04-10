import { motion } from "motion/react";
import LeagueTable from "../components/LeagueTable";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateRankings } from "../lib/ranking";
import { Link } from "react-router-dom";
import { Trophy, Shield, Zap, Target, ArrowDown, Activity, Medal } from "lucide-react";

export default function League() {
  const calculatedRankings = calculateRankings(battles);
  
  const top3 = calculatedRankings
    .filter(rankData => rankData.id !== 'ldn-mikez')
    .slice(0, 3)
    .map((rankData, index) => {
      const mcData = mcs.find(m => m.id === rankData.id);
      return {
        id: rankData.id,
        slug: mcData?.slug || rankData.id,
        name: mcData?.name || rankData.id,
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
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden bg-zinc-950">
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
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full mb-10 shadow-2xl shadow-brand/5 mx-auto lg:mx-0"
              >
                <Medal size={14} className="text-brand" />
                <span className="text-[10px] md:text-xs uppercase font-black tracking-[0.4em] text-brand">Season 01 Podiums</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-6xl md:text-[8rem] font-display uppercase leading-[0.75] tracking-tighter mb-12 shadow-2xl"
              >
                THE OFFICIAL <br/><span className="text-brand drop-shadow-[0_0_30px_rgba(242,125,38,0.3)]">STANDINGS</span>
              </motion.h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-1 w-48 bg-gradient-to-r from-brand to-transparent mb-12 origin-left mx-auto lg:mx-0"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col md:flex-row gap-8 md:items-start"
              >
                <div className="flex-1">
                  <p className="text-zinc-500 text-sm md:text-lg uppercase font-black tracking-[0.2em] leading-relaxed max-w-2xl border-l-0 lg:border-l-2 border-brand/20 lg:pl-6 py-2">
                    The ultimate ranking for the Gzone Arena. 
                    Victory is earned with every punch — <span className="text-white">3 points for a win, 1 for a match, 0 for a loss.</span> 
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Gold, Silver, Bronze Podiums */}
        <div className="grid lg:grid-cols-3 gap-10 mb-32 relative px-4 md:px-0">
          {top3.map((mc, index) => {
             const tier = getTierColors(index);
             const isGold = index === 0;

             return (
              <motion.div
                key={mc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative p-10 md:p-12 rounded-[3.5rem] border overflow-hidden group transition-all duration-700 hover:-translate-y-2 ${
                  tier.bg
                } ${tier.border} ${tier.shadow} ${isGold ? 'lg:scale-110 lg:z-20 order-2' : index === 1 ? 'order-1' : 'order-3'}`}
              >
                {/* Visual Flair */}
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${tier.text}`}>
                  <Trophy size={120} strokeWidth={1} />
                </div>

                <div className="flex items-center justify-between mb-12">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display text-3xl border-2 transition-all ${
                    isGold ? 'bg-yellow-500 text-black border-yellow-500' : 
                    index === 1 ? 'bg-zinc-400 text-black border-zinc-400' :
                    'bg-amber-700 text-black border-amber-700'
                  }`}>
                    {mc.rank === 1 ? '01' : `0${mc.rank}`}
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 ${tier.text}`}>{tier.medal} Medalist</p>
                    <p className={`text-4xl font-display tracking-tighter drop-shadow-md ${tier.text}`}>{mc.points}</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative inline-block mb-10">
                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${
                      tier.border
                    }`}>
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-display text-6xl text-zinc-500">
                        {mc.name[0]}
                      </div>
                    </div>
                    <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-xl ring-4 ring-zinc-950 ${
                      isGold ? 'bg-yellow-500' : index === 1 ? 'bg-zinc-400' : 'bg-amber-700'
                    }`}>
                      <Medal size={24} />
                    </div>
                  </div>
                  
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

        {/* Bonus System Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 max-w-4xl mx-auto"
        >
          <div className="bg-zinc-900/50 border border-brand/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={80} className="text-brand" />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-display uppercase mb-8 text-white">
              The <span className="text-brand">Bonus</span> System
            </h3>
            
            <p className="text-zinc-400 text-sm md:text-lg uppercase font-black tracking-widest mb-10 leading-relaxed">
              The Gzone rewards those who take the biggest risks. Bonus points kick in when a <span className="text-brand">lower-ranked MC beats someone above them</span> in the standings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { range: "1–3 places higher", bonus: "+1 bonus" },
                { range: "4–7 places higher", bonus: "+2 bonus" },
                { range: "8+ places higher", bonus: "+3 bonus" }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
                  <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Rank Difference</div>
                  <div className="text-xl font-display text-white mb-4 uppercase">{item.range}</div>
                  <div className="text-2xl font-display text-brand">{item.bonus}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Full Table Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 relative"
        >
          <div className="flex flex-col items-center mb-16">
            <ArrowDown className="text-brand animate-bounce mb-6" size={32} />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent mb-8" />
            <h4 className="text-xl md:text-3xl font-display uppercase text-zinc-500 tracking-[0.2em]">The Full Standings</h4>
          </div>
          
          <div className="bg-zinc-950/40 backdrop-blur-3xl p-1 md:p-12 rounded-[5rem] border border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
            <LeagueTable showTitle={false} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
