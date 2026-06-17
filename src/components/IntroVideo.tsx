import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Coins, Crown, Skull, Swords } from "lucide-react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateTotalViews } from "../lib/battleUtils";
import { soundManager } from "../lib/sounds";

export default function IntroVideo() {
  const totalViewsStr = calculateTotalViews(battles);
  const heroRules = [
    { icon: Crown, text: "No politics\nJust bars" },
    { icon: Skull, text: "No hand-holding\nNo favours" },
    { icon: Swords, text: "No excuses\nJust war" },
    { icon: Coins, text: "MC's Agree\nWe dont flip coins" },
  ];
  const releasedEpisodeCount = battles.filter(
    (battle) => battle.videoUrl && !battle.isUnreleased && !battle.isPlaceholder,
  ).length;
  const heroRevealLeadSeconds = 4;
  const [videoEnded, setVideoEnded] = useState(false);
  const [started, setStarted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, [started]);

  useEffect(() => {
    if (videoEnded) {
      soundManager.playImpact();
    }
  }, [videoEnded]);

  return (
    <section className="relative w-full min-h-screen overflow-x-hidden">
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
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              if (video.duration - video.currentTime <= heroRevealLeadSeconds && !videoEnded) {
                setVideoEnded(true);
              }
            }}
            onEnded={() => setVideoEnded(true)}
            className="w-full h-full object-cover"
          >
            <source src="/introdesktop.mp4" media="(min-width: 1024px)" type="video/mp4" />
            <source src="/introtablet.mp4" media="(min-width: 768px)" type="video/mp4" />
            <source src="/intromobile.mp4" type="video/mp4" />
            <track kind="captions" label="English" />
          </video>
        </motion.div>
        
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
          <>
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-30 flex min-h-[calc(100svh-2rem)] items-center pt-24 pb-10 md:min-h-screen md:pt-32 md:pb-16"
          >
            <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6 w-full">
              <div className="grid lg:grid-cols-[1.28fr_0.72fr] gap-8 items-center relative">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="relative z-10 max-w-4xl"
                >
                  <div className="mb-2">
                    <h1 className="font-display uppercase leading-[0.78] tracking-tight text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)]">
                      <span className="block text-[5.8rem] sm:text-[7rem] md:text-[9.5rem] lg:text-[8.6rem] xl:text-[10.4rem] text-brand">
                        Gzone
                      </span>
                      <span className="mt-3 block text-4xl sm:text-5xl md:text-7xl lg:text-6xl xl:text-7xl text-white italic tracking-normal">
                        Rap Battle League
                      </span>
                    </h1>
                  </div>

                  <div className="mb-4 inline-flex max-w-full items-center">
                    <p className="text-sm sm:text-xl font-black uppercase tracking-[0.14em] text-white">
                      Season 1 <span className="text-brand">&quot;Most Wanted&quot;</span> <span className="text-white">Where we dont play!</span>
                    </p>
                  </div>

                  <div className="mb-6 h-1 w-full max-w-3xl bg-brand shadow-[0_0_18px_rgba(242,125,38,0.6)]" />

                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {heroRules.map(({ icon: Icon, text }) => (
                      <div key={text} className="border-r border-white/15 last:border-r-0 text-center">
                        <Icon className="mx-auto mb-2 text-brand" size={31} strokeWidth={2.4} />
                        <p className="whitespace-pre-line text-xs sm:text-sm font-black uppercase leading-tight tracking-[0.08em] text-zinc-100">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 grid grid-cols-5 border border-brand/80 bg-black/65 shadow-[0_0_30px_rgba(0,0,0,0.55)]">
                    <div className="px-2 py-4 text-center sm:py-5">
                      <div className="font-display text-3xl sm:text-5xl text-brand">13.2K</div>
                      <div className="mt-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] text-white">Subscribers</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-4 text-center sm:py-5">
                      <div className="font-display text-3xl sm:text-5xl text-brand">{totalViewsStr}+</div>
                      <div className="mt-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] text-white">Total Views</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-4 text-center sm:py-5">
                      <div className="font-display text-3xl sm:text-5xl text-brand">{mcs.length}</div>
                      <div className="mt-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] text-white">Pro MCs</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-4 text-center sm:py-5">
                      <div className="font-display text-3xl sm:text-5xl text-brand">1</div>
                      <div className="mt-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] text-white">Season</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-4 text-center sm:py-5">
                      <div className="font-display text-3xl sm:text-5xl text-brand">{releasedEpisodeCount}</div>
                      <div className="mt-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] text-white">Episodes</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-display text-3xl sm:text-5xl uppercase italic leading-none text-white">
                        Next battle. <span className="text-brand">Be there.</span>
                      </p>
                      <Link
                        to="/events"
                        className="inline-flex items-center gap-3 border-2 border-brand px-6 py-3 font-display text-xl uppercase text-brand transition-colors hover:bg-brand hover:text-black"
                      >
                        Get Tickets <ChevronRight size={24} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="hidden lg:flex relative justify-end items-end z-0 self-end translate-x-10 xl:translate-x-16"
                >
                  <div className="relative group w-full max-w-[560px] xl:max-w-[660px] ml-auto">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand/30 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                    <img 
                      src="/gingerjaymodelpoint.png" 
                      alt="Ginga Jay" 
                      className="relative z-10 w-full max-h-[82vh] object-contain object-right-bottom transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4 drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none z-40" />
    </section>
  );
}
