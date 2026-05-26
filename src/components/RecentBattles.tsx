import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, Clock, Eye } from "lucide-react";
import { battles } from "../data/battles";
import { mcs } from "../data/mcs";
import { portraitImage } from "../lib/images";

export default function RecentBattles() {
  const upcomingEpisodes = new Set([
    "1x15",
    "1x16",
    "1x17",
    "1x18",
    "1x19",
    "1x20",
    "1x21",
  ]);

  const recentBattles = [...battles]
    .filter((b) => b.episode && upcomingEpisodes.has(b.episode))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    .slice(0, 9);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  const unreleasedCount = battles.filter(b => b.isUnreleased).length;

  return (
    <section id="battles" className="relative py-16 md:py-24 overflow-hidden scroll-mt-24">
      {/* Background Flow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-carbon opacity-10 z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] z-20" />
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full z-10" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h3 className="text-4xl md:text-6xl font-display uppercase leading-none mb-6">
            Latest battles <br className="sm:hidden" />
            <span className="text-brand">out now & next up</span>
          </h3>
          <p className="text-brand font-bold tracking-[0.4em] text-[10px] md:text-base">Season 1 "Most Wanted"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {recentBattles.map((battle, index) => {
            const mc1 = mcs.find(m => m.id === battle.mc1);
            const mc2 = mcs.find(m => m.id === battle.mc2);
            const [titleMc1 = battle.mc1, titleMc2 = battle.mc2] = battle.title.split(" vs ");
            const mc1Name = mc1?.name || titleMc1 || battle.mc1;
            const mc2Name = mc2?.name || titleMc2 || battle.mc2;
            const videoId = getYouTubeId(battle.videoUrl);
            const isLive = Boolean(battle.videoUrl);
            
            return (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 aspect-[4/5] sm:aspect-square lg:aspect-[3/4] shadow-2xl transition-transform hover:-translate-y-2 duration-500"
              >
                <Link 
                  to={`/battle/${battle.slug}`} 
                  className="absolute inset-0 z-30" 
                  aria-label={`Watch ${mc1Name} vs ${mc2Name}`}
                />
                
                <div className="absolute inset-0 z-0">
                  {videoId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={battle.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full relative flex overflow-hidden bg-zinc-900">
                      <div className="absolute inset-y-0 left-0 w-[55%] h-full overflow-hidden [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] z-10 border-r border-brand/20">
                        <img 
                          src={portraitImage(mc1?.image, "card")} 
                          alt={mc1Name} 
                          loading="lazy" 
                          decoding="async"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                          referrerPolicy="no-referrer" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/seed/${mc1?.id || battle.id + "-left"}/400/533`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                      
                      <div className="absolute inset-y-0 right-0 w-[55%] h-full overflow-hidden [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] z-0">
                        <img 
                          src={portraitImage(mc2?.image, "card")} 
                          alt={mc2Name} 
                          loading="lazy" 
                          decoding="async"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                          referrerPolicy="no-referrer" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/seed/${mc2?.id || battle.id + "-right"}/400/533`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-black/90 backdrop-blur-md border border-brand/40 w-14 h-14 rounded-full flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(242,125,38,0.3)]">
                          <span className="text-brand font-display text-2xl">VS</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                </div>

                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {battle.isMainEvent && (
                    <div className="bg-brand text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl border border-brand/50 self-start">
                      Main Event
                    </div>
                  )}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl border border-white/10 ${
                    isLive
                      ? "bg-emerald-500 text-black shadow-emerald-500/30"
                      : "bg-[#f27d26] text-white shadow-orange-600/40"
                  }`}>
                    {isLive ? <Play size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
                    {isLive ? "Live Now" : "Coming Soon"}
                  </div>
                </div>

                <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                  <div className="mb-2">
                    <span className="text-brand font-black text-[9px] tracking-[0.4em] uppercase mb-1.5 block drop-shadow-lg">
                      Episode {battle.episode || `1x${String(battles.findIndex(b => b.id === battle.id) + 1).padStart(2, '0')}`}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-display uppercase leading-none group-hover:text-brand transition-colors drop-shadow-2xl">
                      <span className="relative z-40 pointer-events-none">{mc1Name}</span> 
                      <span className="text-brand/50 mx-1.5">VS</span> 
                      <span className="relative z-40 pointer-events-none">{mc2Name}</span>
                    </h4>
                  </div>
                  
                  {!battle.isUnreleased && battle.views && (
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-bold uppercase tracking-widest mt-2 bg-black/40 backdrop-blur-sm self-start px-3 py-1 rounded-full border border-white/5">
                      <Eye size={12} className="text-brand" /> {battle.views} Views
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
