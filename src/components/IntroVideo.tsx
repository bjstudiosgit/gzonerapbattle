import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, ChevronRight, Share2 } from "lucide-react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";

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
      {started && <audio ref={audioRef} autoPlay src="/gzoneintro.mp4" preload="metadata" />}
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
            preload="metadata"
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
                  
                  <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-display italic leading-[1.1] uppercase mb-4 tracking-tight">
                      "It's the <span className="text-brand">G League baby</span> where we don't play"
                    </h1>
                  </div>
                  
                  <p className="text-zinc-200 text-lg max-w-xl mb-10 leading-relaxed">
                    Rising from the ashes, the UK’s rawest battle platform. No politics. No protection. You either perform… or you get performed on
                  </p>
                  
                  {/* Buttons removed as per user request */}
                  
                  <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center gap-12">
                    <div className="group">
                      <div className="text-4xl font-display italic text-white group-hover:text-brand transition-colors">11.4K</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Subscribers</div>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden sm:block" />
                    <div className="group">
                      <div className="text-4xl font-display italic text-white group-hover:text-brand transition-colors">165K+</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Total Views</div>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden sm:block" />
                    <div className="group">
                      <div className="text-4xl font-display italic text-white group-hover:text-brand transition-colors">{mcs.length}</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Pro MCs</div>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden sm:block" />
                    <div className="group">
                      <div className="text-4xl font-display italic text-white group-hover:text-brand transition-colors">1</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Seasons</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="relative lg:pl-12"
                >
                  <div className="relative group">
                    {/* Decorative Background Elements */}
                    <div className="absolute -inset-4 bg-brand/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative z-10 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl block group transition-all duration-500">
                      <iframe
                        className="w-full h-full border-0"
                        src="https://www.youtube-nocookie.com/embed/k7q6aKltaqQ?autoplay=1&mute=1&loop=1&playlist=k7q6aKltaqQ&controls=0&modestbranding=1&rel=0"
                        title="Featured Battle"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                      
                      {/* Cinematic Vignette for the video */}
                      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />
                    </div>

                    {/* Integrated G Badge */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand rounded-full flex items-center justify-center font-display text-xl text-black -rotate-12 z-20 shadow-2xl shadow-brand/40 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                      Office
                    </div>
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
