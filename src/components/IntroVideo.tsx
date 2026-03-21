import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, ChevronRight, Share2 } from "lucide-react";
import { mcs } from "../data/mcs";

export default function IntroVideo() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [started, setStarted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, [started]);

  return (
    <section className="relative w-full bg-black min-h-[90vh] overflow-x-hidden">
      {started && <audio ref={audioRef} autoPlay src="/gzoneintro.mp4" />}
      {/* Shared Video Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            opacity: videoEnded ? 0.3 : 1,
            filter: videoEnded ? "grayscale(100%)" : "grayscale(0%)"
          }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <video
            autoPlay={started}
            muted
            playsInline
            onEnded={() => setTimeout(() => setVideoEnded(true), 2000)}
            className="w-full h-full object-cover"
          >
            <source src="/introdesktop.mp4" media="(min-width: 1024px)" type="video/mp4" />
            <source src="/introtablet.mp4" media="(min-width: 768px)" type="video/mp4" />
            <source src="/intromobile.mp4" type="video/mp4" />
            <track kind="captions" label="English" />
          </video>
        </motion.div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-10" />
        {videoEnded && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />
          </>
        )}
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <AnimatePresence>
        {!videoEnded ? (
          <motion.div
            key="skip-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 right-12 z-50"
          >
            {/* Skip Button */}
            <button 
              onClick={() => setVideoEnded(true)}
              className="text-white/70 hover:text-brand transition-colors uppercase tracking-[0.3em] text-[10px] font-bold flex items-center gap-2 group"
              aria-label="Skip Intro Video"
            >
              Skip Intro <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative min-h-[80vh] flex items-center pt-32 pb-12 z-30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                    </span>
                    <span className="">Latest Battle Out Now</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-7xl font-display italic leading-[0.9] uppercase mb-2 tracking-tighter">
                    Ginga <br />
                    Entertainment <br />
                    <span className="text-brand block text-2xl md:text-4xl mt-2">present the G Zone</span>
                  </h1>
                  <div className="text-zinc-200 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-8">
                    In association with Peacock Gymnasium
                  </div>
                  
                  <p className="text-zinc-200 text-lg max-w-xl mb-10 leading-relaxed">
                    Rising from the ashes, the UK’s rawest battle platform. No politics. No protection. You either perform… or you get performed on
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://www.eventbrite.com/e/the-gzone-rap-battle-league-tickets-1983773740660#location" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                      Get Tickets <ChevronRight size={18} />
                    </a>
                    <a 
                      href="https://www.youtube.com/watch?v=oUDDrQtoTHM" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                      Watch Now <Play size={18} fill="currentColor" />
                    </a>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-8">
                    <div>
                      <div className="text-3xl font-display italic">11.4K</div>
                      <div className="text-zinc-200 text-[10px] uppercase tracking-widest">Subscribers</div>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div>
                      <div className="text-3xl font-display italic">{mcs.length}</div>
                      <div className="text-zinc-200 text-[10px] uppercase tracking-widest">Pro MCs</div>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div>
                      <div className="text-3xl font-display italic">1</div>
                      <div className="text-zinc-200 text-[10px] uppercase tracking-widest">Seasons</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="relative"
                >
                  <a 
                    href="https://www.youtube.com/watch?v=oUDDrQtoTHM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand/20 block group max-w-md ml-auto"
                    aria-label="Watch Featured Battle: Tapped24 vs AJNA"
                  >
                    <img 
                      src="https://img.youtube.com/vi/oUDDrQtoTHM/maxresdefault.jpg" 
                      alt="Featured Battle" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-brand/50 transition-all duration-500 shadow-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                          <span className="text-brand font-bold text-[10px] uppercase tracking-[0.3em]">Season 01</span>
                        </div>
                        <span className="text-zinc-200 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
                          <Play size={12} fill="currentColor" /> Watch Now
                        </span>
                      </div>
                      <h3 className="text-2xl font-display italic uppercase text-white group-hover:text-brand transition-colors leading-none tracking-tight">
                        Tapped24 <span className="text-brand">VS</span> AJNA
                      </h3>
                    </div>
                  </a>
                  
                  {/* Floating G Badge */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand rounded-full flex items-center justify-center font-display text-4xl text-black -rotate-12 z-20 shadow-2xl shadow-brand/40">
                    G
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none z-40" />
    </section>
  );
}
