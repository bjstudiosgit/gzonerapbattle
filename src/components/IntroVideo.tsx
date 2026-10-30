import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
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
  const releasedRoyalRumbleCount = battles.filter(
    (battle) => battle.league === "royal-rumble" && battle.videoUrl && !battle.isUnreleased && !battle.isPlaceholder,
  ).length;
  const heroRevealLeadSeconds = 4;
  const [videoEnded, setVideoEnded] = useState(false);
  const [introAudioFinished, setIntroAudioFinished] = useState(true);

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

      {/* Shared Video Background */}
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)]">
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
        ) : null}
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoEnded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden={!videoEnded}
            className={`relative z-30 flex min-h-[calc(100svh-2rem)] items-center pt-24 pb-10 md:min-h-screen md:pt-32 md:pb-16 ${videoEnded ? '' : 'pointer-events-none'}`}
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
                    <h1 className="md:whitespace-nowrap font-display uppercase text-[clamp(1.6rem,4.5vw,4.5rem)] leading-none tracking-tight text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)]">
                      <span className="text-brand">Gzone</span> Rap Battle League
                    </h1>
                  </div>

                  <div className="mb-6 max-w-3xl">
                    <p className="md:whitespace-nowrap text-[clamp(0.65rem,1.35vw,1.25rem)] font-black uppercase tracking-[0.1em] text-white">
                      Season 1 <span className="text-brand">&quot;Most Wanted&quot;</span> Where we don&apos;t play!
                      <span aria-hidden="true" className="ml-2 text-yellow-400 tracking-[0.12em]">★★★★★</span>
                    </p>
                    <div className="mt-3 h-px w-full max-w-3xl bg-brand/70" />
                    <p className="mt-4 max-w-3xl font-sans font-normal sm:text-justify text-sm sm:text-xl leading-relaxed text-zinc-300">
                      The GZone is a UK battle rap league based at the World Famous Peacocks Gym in Canning Town, bringing hungry newcomers and established MCs together for live, uncensored clashes. Hosted by Ginga Jay and Darren &quot;The Dentist&quot; Stewart, with Passive as co-host and Flex FM&apos;s Most Wanted 2 as official DJs, GZone combines battle rap, live entertainment and UK underground culture in one high-pressure arena.
                    </p>
                  </div>

                  <div className="mb-10 h-px w-full max-w-3xl bg-brand/70" />

                  <div className="mb-12 grid w-full max-w-3xl grid-cols-3 sm:grid-cols-6">
                    <div className="px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">21.6K</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Subscribers</div>
                    </div>
                    <div className="border-l border-white/15 px-2 py-2 text-center sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{totalViewsStr}+</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Total Views</div>
                    </div>
                    <div className="border-t border-white/15 px-2 py-2 text-center sm:border-l sm:border-t-0 sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{releasedEpisodeCount}</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Episodes</div>
                    </div>
                    <div className="border-l border-t border-white/15 px-2 py-2 text-center sm:border-t-0 sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">8</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Freestyles</div>
                    </div>
                    <div className="border-l border-t border-white/15 px-2 py-2 text-center sm:border-t-0 sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{releasedRoyalRumbleCount}</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-normal sm:tracking-[0.12em] text-white">Royal Rumbles</div>
                    </div>
                    <div className="border-l border-t border-white/15 px-2 py-2 text-center sm:border-t-0 sm:py-3">
                      <div className="font-display text-xl sm:text-3xl text-brand">{mcs.length}</div>
                      <div className="mt-1 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-white">Artists</div>
                    </div>
                  </div>

                  <a
                    href="https://www.youtube.com/@gingajay"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on YouTube (opens in a new tab)"
                    className="group flex flex-nowrap items-center gap-x-3 gap-y-1 font-display text-[clamp(1rem,5.5vw,3rem)] uppercase italic leading-none text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    <span>Did you?</span>
                    <span className="inline-flex flex-nowrap items-center gap-x-4 gap-y-1">
                      <span className="text-brand">Follow us on</span>
                      <img src="/youtube-logo-fullcolor-white.png" alt="YouTube" className="h-[clamp(1.5rem,7.5vw,3.5rem)] w-auto transition-[filter] group-hover:brightness-110" />
                    </span>
                  </a>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="hidden lg:flex relative justify-end items-end z-0 self-end translate-x-10 xl:translate-x-16"
                >
                  <div className="relative w-full max-w-[560px] xl:max-w-[660px] ml-auto">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand/30 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                    <img 
                      src="/gingerjaymodelpoint.png" 
                      alt="Ginga Jay" 
                      className="relative z-10 w-full max-h-[82vh] object-contain object-right-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none z-40" />
    </section>
  );
}
