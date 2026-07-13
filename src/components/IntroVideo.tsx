import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";
import { battles } from "../data/battles";
import { calculateTotalViews } from "../lib/battleUtils";
import { soundManager } from "../lib/sounds";

export default function IntroVideo() {
  const totalViewsStr = calculateTotalViews(battles);
  const releasedEpisodeCount = battles.filter(
    (battle) => battle.videoUrl && !battle.isUnreleased && !battle.isPlaceholder,
  ).length;
  const heroRevealLeadSeconds = 4;
  const [videoEnded, setVideoEnded] = useState(false);
  const [introAudioFinished, setIntroAudioFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const stopRetrying = () => {
      window.removeEventListener("pointerdown", playIntro);
      window.removeEventListener("keydown", playIntro);
      window.removeEventListener("wheel", playIntro);
      window.removeEventListener("scroll", playIntro);
    };

    const playIntro = () => {
      audio.play().then(stopRetrying).catch(() => undefined);
    };

    playIntro();
    window.addEventListener("pointerdown", playIntro);
    window.addEventListener("keydown", playIntro);
    window.addEventListener("wheel", playIntro);
    window.addEventListener("scroll", playIntro);

    return stopRetrying;
  }, []);

  useEffect(() => {
    if (videoEnded) {
      soundManager.playImpact();
    }
  }, [videoEnded]);

  useEffect(() => {
    if (!introAudioFinished) return;

    (window as Window & { gzoneIntroAudioFinished?: boolean }).gzoneIntroAudioFinished = true;
    window.dispatchEvent(new Event("gzone:intro-audio-finished"));
  }, [introAudioFinished]);

  return (
    <section className="relative w-full min-h-screen overflow-x-hidden">
      <audio
        ref={audioRef}
        autoPlay
        src="/gzoneintro.mp4"
        preload="metadata"
        onEnded={() => setIntroAudioFinished(true)}
      />
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
            autoPlay
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
              onClick={() => {
                setVideoEnded(true);
                setIntroAudioFinished(true);
              }}
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
                  <div className="mb-4">
                    <h1 className="whitespace-nowrap font-display uppercase text-[clamp(1.6rem,4.5vw,4.5rem)] leading-none tracking-tight text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)]">
                      <span className="text-brand">Gzone</span> Rap Battle League
                    </h1>
                  </div>

                  <div className="mb-6 max-w-3xl">
                    <p className="whitespace-nowrap text-[clamp(0.65rem,1.35vw,1.25rem)] font-black uppercase tracking-[0.1em] text-white">
                      Season 1 <span className="text-brand">&quot;Most Wanted&quot;</span> Where we don&apos;t play!
                      <span className="ml-2 text-yellow-400 tracking-[0.12em]">★★★★★</span>
                    </p>
                    <div className="mt-3 h-px w-full max-w-3xl bg-brand/70" />
                    <p className="mt-4 max-w-3xl text-justify text-sm sm:text-xl leading-relaxed text-zinc-300">
                      The GZone is the UK&apos;s uncensored battle rap arena, where hungry newcomers and veteran MCs settle rivalries, test their bars, and prove themselves in front of a live crowd. Based at Peacocks Boxing Gym in Canning Town, the league puts every clash inside a real fighting venue built for pressure, performance, and unforgettable moments.
                    </p>
                  </div>

                  <div className="mb-10 h-px w-full max-w-3xl bg-brand/70" />

                  <div className="mb-12 grid w-full max-w-3xl grid-cols-5">
                    <div className="px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">13.4K</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Subscribers</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{totalViewsStr}+</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Total Views</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{mcs.length}</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Pro MCs</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">1</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Season</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{releasedEpisodeCount}</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Episodes</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex w-full max-w-3xl flex-col items-start justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-display text-3xl sm:text-5xl uppercase italic leading-none text-white">
                        Next battle. <span className="text-brand">Be there.</span>
                      </p>
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
