import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Clock, Eye } from "lucide-react";
import { battles } from "../data/battles";
import { mcs } from "../data/mcs";

export default function RecentBattles() {
  const recentBattles = [...battles]
    .filter(b => b.isUnreleased)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    .slice(0, 4);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  return (
    <section id="battles" className="relative py-24 overflow-hidden scroll-mt-24">
      {/* Background Flow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none z-20" />
        {/* Orange Contrast Gradient */}
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none z-10" />
        {/* Flow Overlays */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-5xl md:text-6xl font-display italic uppercase">Coming <span className="text-brand">Soon</span></h3>
          <p className="text-zinc-400 mt-4">New battles landing soon.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentBattles.map((battle, index) => {
            const mc1 = mcs.find(m => m.id === battle.mc1);
            const mc2 = mcs.find(m => m.id === battle.mc2);
            const videoId = getYouTubeId(battle.videoUrl);
            
            return (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 aspect-video lg:aspect-[3/4]"
              >
                <Link 
                  to={`/battle/${battle.slug}`} 
                  className="absolute inset-0 z-30" 
                  aria-label={`Watch ${mc1?.name} vs ${mc2?.name}`}
                />
                
                <div className="absolute inset-0 z-0">
                  {videoId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={battle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full relative flex overflow-hidden bg-zinc-900">
                      {/* MC 1 - Left Side */}
                      <div className="absolute inset-y-0 left-0 w-[55%] h-full overflow-hidden [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] z-10 border-r border-brand/20">
                        <img 
                          src={mc1?.image} 
                          alt={mc1?.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                          referrerPolicy="no-referrer" 
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>
                      
                      {/* MC 2 - Right Side */}
                      <div className="absolute inset-y-0 right-0 w-[55%] h-full overflow-hidden [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] z-0">
                        <img 
                          src={mc2?.image} 
                          alt={mc2?.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                          referrerPolicy="no-referrer" 
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* VS Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-sm border border-brand/30 w-12 h-12 rounded-full flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                          <span className="text-brand font-display italic text-xl">VS</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                </div>

                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  {battle.isUnreleased ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20">
                      <Clock size={10} /> Currently in Production
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand text-black text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20">
                      <Play size={10} fill="currentColor" /> Out Now
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                  <div className="mb-2">
                    <span className="text-brand font-black text-[8px] tracking-[0.3em] uppercase mb-1 block">
                      Episode 1x{String(battles.findIndex(b => b.id === battle.id) + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-xl font-display italic uppercase leading-none group-hover:text-brand transition-colors relative z-40">
                      <Link to={`/mc/${mc1?.slug}`} className="hover:text-brand hover:underline underline-offset-4 transition-colors">{mc1?.name}</Link> <span className="text-brand/50">VS</span> <Link to={`/mc/${mc2?.slug}`} className="hover:text-brand hover:underline underline-offset-4 transition-colors">{mc2?.name}</Link>
                    </h4>
                  </div>
                  
                  {!battle.isUnreleased && (
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">
                      <Eye size={12} className="text-brand" /> {battle.views} Views
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/battles" className="text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
            View All Battles <TrendingUp size={18} />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-200 text-[10px] uppercase tracking-widest leading-relaxed max-w-md text-center md:text-left">
            Subscribe to our YouTube channel and hit the bell icon to never miss a drop. New battles released weekly.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-200">Currently in Production: Btizz vs CJ Zino</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
