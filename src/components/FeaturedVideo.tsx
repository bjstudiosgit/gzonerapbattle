import { motion } from "motion/react";
import { battles } from "../data/battles";
import { sortBattlesById } from "../lib/battleUtils";

export default function FeaturedVideo() {
  const releasedBattles = sortBattlesById(battles.filter(b => !b.isUnreleased));
  const latestBattle = releasedBattles.length > 0 ? releasedBattles[releasedBattles.length - 1] : null;
  const latestBattleEmbedSrc = latestBattle?.videoUrl
    ? latestBattle.videoUrl.includes("watch?v=")
      ? latestBattle.videoUrl.replace("watch?v=", "embed/")
      : latestBattle.videoUrl
    : "https://www.youtube-nocookie.com/embed/-bKXRy3RxoY";

  return (
    <section className="relative w-full min-h-[40vh] overflow-hidden flex flex-col items-center justify-center py-12 md:py-24">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-carbon opacity-15 z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 w-full"
        >
          <h2 className="text-3xl md:text-6xl font-display uppercase mb-6 tracking-tighter leading-tight text-brand">
            Latest Battle Deeno VS Grams out now!
          </h2>
          <p className="text-zinc-200 text-sm md:text-base font-medium tracking-normal max-w-2xl mx-auto">
            <span className="font-bold text-white">Episode 1x14</span> - Deeno the Viking vs Marni The Shadow Grams is now live in the Gzone arena.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-6xl aspect-video group"
        >
          {/* Intense Orange Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand to-orange-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(242,125,38,0.25)] bg-[#050505]">
            <iframe
              className="w-full h-full border-0"
              src={latestBattleEmbedSrc}
              title="YouTube video player"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            
            {/* Cinematic Vignette for the video */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />

            {/* WANTED Stamp Overlay */}
            {latestBattle?.isWanted && (
              <div className="absolute top-8 right-8 z-30 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 2, rotate: 15 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1
                  }}
                  className="border-4 border-red-600 px-6 py-2 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                >
                  <span className="text-red-600 font-display text-4xl md:text-6xl tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">WANTED</span>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
