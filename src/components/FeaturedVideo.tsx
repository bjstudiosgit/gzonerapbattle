import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { seasonOneBattles } from "../data/battles";
import { youTubeEmbedUrl, youTubeThumbnailUrl } from "../lib/youtube";

export default function FeaturedVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const releasedBattles = seasonOneBattles
    .filter((battle) => !battle.isUnreleased && !battle.isPlaceholder && Boolean(battle.videoUrl))
    .sort((a, b) => Number(a.episode?.split("x")[1] || 0) - Number(b.episode?.split("x")[1] || 0));
  const featuredBattle = releasedBattles[releasedBattles.length - 1] ?? null;
  const featuredVideoUrl = featuredBattle?.videoUrl ?? "https://www.youtube.com/watch?v=-bKXRy3RxoY";
  const featuredBattleEmbedSrc = youTubeEmbedUrl(featuredVideoUrl, { autoplay: true })
    ?? youTubeEmbedUrl("https://www.youtube.com/watch?v=-bKXRy3RxoY", { autoplay: true });
  const featuredThumbnail = youTubeThumbnailUrl(featuredVideoUrl, "maxresdefault")
    ?? youTubeThumbnailUrl(featuredVideoUrl);

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

            {isPlaying && featuredBattleEmbedSrc ? (
              <iframe
                className="w-full h-full border-0"
                src={featuredBattleEmbedSrc}
                title={featuredTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="group absolute inset-0 h-full w-full overflow-hidden text-left"
                aria-label={`Play ${featuredTitle}`}
              >
                {featuredThumbnail && (
                  <img
                    src={featuredThumbnail}
                    alt={`${featuredTitle} video thumbnail`}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.dataset.fallback) return;
                      image.dataset.fallback = "true";
                      image.src = youTubeThumbnailUrl(featuredVideoUrl) ?? "";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-black shadow-[0_0_40px_rgba(242,125,38,0.45)] transition-transform duration-300 group-hover:scale-110">
                    <Play size={30} fill="currentColor" className="ml-1" />
                  </span>
                </span>
                <span className="absolute bottom-5 left-5 right-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                  Tap to play
                </span>
              </button>
            )}

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
