import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "motion/react";
import { Download, Eye, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { flyerImage } from "../lib/images";

export type PromoFlyer = {
  id: string;
  title: string;
  event: string;
  date: string;
  category: "upcoming" | "august-29" | "royal-rumble" | "april-showdown";
  categoryLabel: string;
  src: string;
  aspect: string;
  direct?: boolean;
};

const allFlyers: PromoFlyer[] = [
  // 26th September 2026 (Upcoming)
  {
    id: "marni-gramz-vs-btizz",
    title: "Marni Gramz vs Btizz",
    event: "26th September 2026",
    date: "26 Sep 2026",
    category: "upcoming",
    categoryLabel: "26 Sep Clash",
    src: "/flyers/september-26-2026-marni-gramz-vs-btizz.jpg",
    aspect: "aspect-[3/4]",
    direct: true,
  },
  {
    id: "tymeless-vs-kime",
    title: "Tymeless vs K.I.M.E",
    event: "26th September 2026",
    date: "26 Sep 2026",
    category: "upcoming",
    categoryLabel: "26 Sep Clash",
    src: "/flyers/september-26-2026-tymeless-vs-kime.jpg",
    aspect: "aspect-[3/4]",
    direct: true,
  },
  {
    id: "afrodon-vs-akeezy",
    title: "Afrodon vs Akeezy",
    event: "26th September 2026",
    date: "26 Sep 2026",
    category: "upcoming",
    categoryLabel: "26 Sep Clash",
    src: "/flyers/september-26-2026-afrodon-vs-akeezy.jpg",
    aspect: "aspect-[3/4]",
    direct: true,
  },
  {
    id: "badee-harz-vs-roman",
    title: "Badee Harz vs Roman",
    event: "26th September 2026",
    date: "26 Sep 2026",
    category: "upcoming",
    categoryLabel: "26 Sep Clash",
    src: "/flyers/september-26-2026-badee-harz-vs-roman.jpg",
    aspect: "aspect-[3/4]",
    direct: true,
  },

  // 29th August 2026
  {
    id: "badee-harz-1flaymah",
    title: "Badee Harz vs 1 Flaymah",
    event: "29th August 2026",
    date: "29 Aug 2026",
    category: "august-29",
    categoryLabel: "29 Aug Event",
    src: "/flyers/august-29-2026-badee-harz-vs-1flaymah.png",
    aspect: "aspect-[3/4]",
    direct: true,
  },
  {
    id: "deeno-cj-zino",
    title: "Deeno vs C.J Zino",
    event: "29th August 2026",
    date: "29 Aug 2026",
    category: "august-29",
    categoryLabel: "29 Aug Event",
    src: "/flyers/august-29-2026-deeno-vs-cj.jpg",
    aspect: "aspect-[3/4]",
    direct: true,
  },
  {
    id: "zk-7wave",
    title: "Z.K vs 7Wave",
    event: "29th August 2026",
    date: "29 Aug 2026",
    category: "august-29",
    categoryLabel: "29 Aug Event",
    src: "/flyers/august-29-2026-zk-vs-7wave.png",
    aspect: "aspect-[3/4]",
    direct: true,
  },

  // 1st August 2026 (Royal Rumble)
  {
    id: "likkle-man",
    title: "Royal Rumble - Likkle Man",
    event: "Royal Rumble",
    date: "1 Aug 2026",
    category: "royal-rumble",
    categoryLabel: "Royal Rumble",
    src: "/flyers/august-2026-likkle-man.jpeg",
    aspect: "aspect-[4/5]",
    direct: true,
  },
  {
    id: "deeno-btizz",
    title: "Deeno vs Btizz",
    event: "Royal Rumble",
    date: "1 Aug 2026",
    category: "royal-rumble",
    categoryLabel: "Royal Rumble",
    src: "/flyers/august-2026-deeno-vs-btizz.jpeg",
    aspect: "aspect-[4/5]",
    direct: true,
  },
  {
    id: "zk-cj-zino",
    title: "Z.K vs CJ Zino",
    event: "Royal Rumble",
    date: "1 Aug 2026",
    category: "royal-rumble",
    categoryLabel: "Royal Rumble",
    src: "/flyers/august-2026-zk-vs-cj-zino.jpeg",
    aspect: "aspect-[4/5]",
    direct: true,
  },

  // 26th April 2026 (April Showdown)
  {
    id: "april-main",
    title: "April Showdown - Main Event",
    event: "April Showdown",
    date: "26 Apr 2026",
    category: "april-showdown",
    categoryLabel: "April Showdown",
    src: "/flyers/26thAprilall.png",
    aspect: "aspect-[4/5]",
    direct: false,
  },
  {
    id: "tapped24-grams",
    title: "Tapped 24 vs Grams",
    event: "April Showdown",
    date: "26 Apr 2026",
    category: "april-showdown",
    categoryLabel: "April Showdown",
    src: "/flyers/Tapped24vsGrams.png",
    aspect: "aspect-square",
    direct: false,
  },
  {
    id: "rico-deeno",
    title: "Ricko G vs Deeno",
    event: "April Showdown",
    date: "26 Apr 2026",
    category: "april-showdown",
    categoryLabel: "April Showdown",
    src: "/flyers/RicovsDeeno.png",
    aspect: "aspect-square",
    direct: false,
  },
  {
    id: "ryno-roman",
    title: "Ryno vs Roman",
    event: "April Showdown",
    date: "26 Apr 2026",
    category: "april-showdown",
    categoryLabel: "April Showdown",
    src: "/flyers/RynovsRoman.png",
    aspect: "aspect-square",
    direct: false,
  },
  {
    id: "btizz-1flaymr",
    title: "Btizz vs 1Flaymr",
    event: "April Showdown",
    date: "26 Apr 2026",
    category: "april-showdown",
    categoryLabel: "April Showdown",
    src: "/flyers/Btizzvs1flaymr.png",
    aspect: "aspect-square",
    direct: false,
  },
];

const filterCategories = [
  { id: "all", label: "All Flyers", count: allFlyers.length },
  {
    id: "upcoming",
    label: "26 Sep 2026",
    count: allFlyers.filter((f) => f.category === "upcoming").length,
    isUpcoming: true,
  },
  {
    id: "august-29",
    label: "29 Aug 2026",
    count: allFlyers.filter((f) => f.category === "august-29").length,
  },
  {
    id: "royal-rumble",
    label: "Royal Rumble",
    count: allFlyers.filter((f) => f.category === "royal-rumble").length,
  },
  {
    id: "april-showdown",
    label: "April Showdown",
    count: allFlyers.filter((f) => f.category === "april-showdown").length,
  },
];

const promoAsset = (flyer: PromoFlyer, variant: "card" | "lightbox") =>
  flyer.direct ? flyer.src : flyerImage(flyer.src, variant);

export default function PromoMaterialPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayedFlyers =
    selectedCategory === "all"
      ? allFlyers
      : allFlyers.filter((flyer) => flyer.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % displayedFlyers.length : 0));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + displayedFlyers.length) % displayedFlyers.length : 0
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, displayedFlyers.length]);

  const activeLightboxFlyer = lightboxIndex !== null ? displayedFlyers[lightboxIndex] : null;

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 relative overflow-hidden bg-[#050505]">
      <Helmet>
        <title>Flyers | Gzone Rap Battle League</title>
        <meta
          name="description"
          content="Browse and download official Gzone Rap Battle event flyers and clash posters."
        />
      </Helmet>

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase leading-[0.9] tracking-tight text-white">
              Flyers
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mt-3 font-medium">
              High-resolution event artwork and promotional clash posters. Free to download for MCs, media, promoters, and fans.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono font-bold uppercase tracking-wider pr-2 shrink-0">
            <Filter size={13} />
            Filter:
          </div>
          {filterCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-display uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand text-black font-black shadow-[0_0_20px_rgba(242,125,38,0.4)]"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? "bg-black/20 text-black" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modern Unified Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {displayedFlyers.map((flyer, index) => {
              const downloadUrl = promoAsset(flyer, "lightbox");
              const isUpcoming = flyer.category === "upcoming";

              return (
                <motion.div
                  layout
                  key={flyer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="group relative bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 hover:border-brand/50 transition-all duration-500 shadow-xl flex flex-col"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[3/4] w-full bg-black/90 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img
                      src={promoAsset(flyer, "card")}
                      alt={flyer.title}
                      loading="lazy"
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500 select-none"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.endsWith(flyer.src)) {
                          target.src = flyer.src;
                        }
                      }}
                    />

                    {/* Category / Date Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`text-[9px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md border ${
                          isUpcoming
                            ? "bg-brand/20 border-brand/40 text-brand"
                            : "bg-black/70 border-white/10 text-zinc-300"
                        }`}
                      >
                        {flyer.categoryLabel}
                      </span>
                    </div>

                    {/* Hover Overlay with Quick Action Buttons */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(index);
                        }}
                        className="w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
                        title="View Fullscreen"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={downloadUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-11 h-11 rounded-full bg-brand hover:bg-white text-black flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
                        title="Download Poster"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-4 bg-zinc-900/60 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
                    <div className="min-w-0">
                      <h3 className="font-display uppercase text-sm sm:text-base text-white truncate group-hover:text-brand transition-colors">
                        {flyer.title}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                        {flyer.event}
                      </p>
                    </div>
                    <a
                      href={downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-zinc-400 hover:text-brand p-1.5 transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modern Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxFlyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Modal Bar */}
            <div
              className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mb-0.5">
                  {activeLightboxFlyer.event} &bull; {activeLightboxFlyer.date}
                </span>
                <h2 className="font-display text-lg sm:text-2xl uppercase text-white truncate">
                  {activeLightboxFlyer.title}
                </h2>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={promoAsset(activeLightboxFlyer, "lightbox")}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-white text-black font-display text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-md"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div
              className="flex-1 relative flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Arrow */}
              {displayedFlyers.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (prev) => (prev! - 1 + displayedFlyers.length) % displayedFlyers.length
                    )
                  }
                  className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-brand text-white hover:text-black border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Flyer Image */}
              <motion.img
                key={activeLightboxFlyer.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                src={promoAsset(activeLightboxFlyer, "lightbox")}
                alt={activeLightboxFlyer.title}
                className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith(activeLightboxFlyer.src)) {
                    target.src = activeLightboxFlyer.src;
                  }
                }}
              />

              {/* Next Arrow */}
              {displayedFlyers.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev! + 1) % displayedFlyers.length)
                  }
                  className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-brand text-white hover:text-black border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Modal Bar */}
            <div
              className="text-center text-xs font-mono text-zinc-500 pt-2 border-t border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              Poster {(lightboxIndex ?? 0) + 1} of {displayedFlyers.length} &bull; Use &larr; &rarr; to navigate &bull; Press Esc to exit
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
