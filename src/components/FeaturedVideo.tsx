import { motion } from "motion/react";
import { seasonOneBattles } from "../data/battles";

export default function FeaturedVideo() {
  const releasedBattles = seasonOneBattles
    .filter((battle) => !battle.isUnreleased && !battle.isPlaceholder && Boolean(battle.videoUrl))
    .sort((a, b) => Number(a.episode?.split("x")[1] || 0) - Number(b.episode?.split("x")[1] || 0));
  const featuredBattle = releasedBattles[releasedBattles.length - 1] ?? null;
  const featuredBattleEmbedSrc = featuredBattle?.videoUrl
    ? featuredBattle.videoUrl.includes("watch?v=")
      ? featuredBattle.videoUrl.replace("watch?v=", "embed/")
      : featuredBattle.videoUrl
    : "https://www.youtube-nocookie.com/embed/-bKXRy3RxoY";

  const featuredTitle = featuredBattle?.title?.replace(/\svs\s/i, " VS ") ?? "New battle";

  return (
    <section aria-labelledby="latest-battle-heading" className="relative w-full overflow-hidden pt-6 pb-16 sm:pt-10 md:pb-24">
      <div className="relative z-20 w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-10 w-full"
        >
          <p className="mb-4 flex items-center gap-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.24em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            Latest Battle
            <span aria-hidden="true" className="text-zinc-600">/</span>
            <span className="text-zinc-400">Out now</span>
          </p>
          <h2 id="latest-battle-heading" className="max-w-5xl font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.05] text-white">
            {featuredTitle}
          </h2>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full aspect-video"
        >
          <div className="relative w-full h-full rounded-sm sm:rounded-lg overflow-hidden border border-white/10 bg-[#050505]">

            <iframe
              className="w-full h-full border-0"
              src={featuredBattleEmbedSrc}
              title={featuredTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>

            {/* WANTED Stamp Overlay */}
            {featuredBattle?.isWanted && (
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
