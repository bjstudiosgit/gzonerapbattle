import { motion } from "motion/react";
import { Download } from "lucide-react";
import { flyerImage } from "../lib/images";

type PromoFlyer = {
  id: string;
  title: string;
  src: string;
  aspect: string;
};

const juneFlyers: PromoFlyer[] = [
  {
    id: "1flaymah-badee-harz",
    title: "1-Flay'Mah VS Badee-Harz",
    src: "/flyers/1flaymahvsbadeeharz.jpeg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "btizz-marni-gramz",
    title: "B-Tizz VS Marni Gramz",
    src: "/flyers/b-tizzcsmarnigramz.jpeg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tricky-roman",
    title: "Tricky VS Roman",
    src: "/flyers/trickyvsroman.jpeg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "zk-cj-zino",
    title: "Z.K VS C.J Zino",
    src: "/flyers/zkvscjzino.jpeg",
    aspect: "aspect-[4/5]",
  },
];

const aprilFlyers: PromoFlyer[] = [
  {
    id: "main",
    title: "April Showdown - Main Flyer",
    src: "/flyers/26thAprilall.png",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tapped24-grams",
    title: "Tapped 24 VS Grams",
    src: "/flyers/Tapped24vsGrams.png",
    aspect: "aspect-square",
  },
  {
    id: "rico-deeno",
    title: "Ricko G VS Deeno",
    src: "/flyers/RicovsDeeno.png",
    aspect: "aspect-square",
  },
  {
    id: "ryno-roman",
    title: "Ryno VS Roman",
    src: "/flyers/RynovsRoman.png",
    aspect: "aspect-square",
  },
  {
    id: "btizz-1flaymr",
    title: "Btizz VS 1Flaymr",
    src: "/flyers/Btizzvs1flaymr.png",
    aspect: "aspect-square",
  },
];

const promoEvents = [
  {
    id: "june-27",
    badge: "Next Event",
    badgeTone: "brand" as const,
    heading: "27th June",
    subheading: "Peacocks Boxing",
    flyers: juneFlyers,
  },
  {
    id: "april-showdown",
    badge: "Archive",
    badgeTone: "zinc" as const,
    heading: "26th April",
    subheading: "Showdown",
    flyers: aprilFlyers,
  },
];

export default function PromoMaterialPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-zinc-950">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 font-display text-[15vw] text-white/[0.02] uppercase leading-none select-none tracking-tighter whitespace-nowrap">
          Promo Assets
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-20 text-center lg:text-left">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-display uppercase leading-[0.85] tracking-tighter mb-8 shadow-2xl">
              PROMO <br/><span className="text-brand drop-shadow-[0_0_30px_rgba(242,125,38,0.3)]">MATERIAL</span>
            </h1>
            
            <div className="h-1 w-32 bg-gradient-to-r from-brand to-transparent mb-8 origin-left mx-auto lg:mx-0" />
            
            <p className="text-zinc-400 text-sm md:text-lg max-w-2xl leading-relaxed tracking-tight font-medium opacity-80 border-l-0 lg:border-l-2 border-brand/20 lg:pl-6 py-2 mx-auto lg:mx-0">
              Official artwork and promotional assets for upcoming events. Available for MCs, promoters, and media partners to download and share across social platforms.
            </p>
          </div>
        </header>

        <div className="space-y-10">
          {promoEvents.map((event) => {
            const badgeClassName =
              event.badgeTone === "brand"
                ? "bg-brand/10 text-brand border-brand/20"
                : "bg-white/5 text-zinc-300 border-white/10";

            const badgeDotClassName = event.badgeTone === "brand" ? "bg-brand animate-pulse" : "bg-zinc-500";

            return (
              <div key={event.id} className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-6 md:p-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${badgeClassName}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badgeDotClassName}`} />
                      {event.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight">
                      {event.heading} <span className="text-zinc-500">{event.subheading}</span>
                    </h2>
                  </div>
                  <div className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                    {event.flyers.length} Assets Available
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.flyers.map((flyer, index) => (
                    <motion.div
                      key={`${event.id}-${flyer.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`group relative bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-brand/40 shadow-2xl transition-all duration-500 hover:-translate-y-2 ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                    >
                      <div className={`relative w-full ${flyer.aspect} overflow-hidden`}>
                        <img
                          src={flyerImage(flyer.src, "card")}
                          alt={flyer.title}
                          width={640}
                          height={800}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallback = flyerImage(flyer.src, "lightbox");
                            if (!target.src.endsWith(fallback)) {
                              target.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between">
                          <div>
                            <p className="text-white font-display text-xl tracking-tight mb-1">{flyer.title}</p>
                            <p className="text-brand text-[10px] font-black tracking-widest">Official Asset</p>
                          </div>
                          <a
                            href={flyerImage(flyer.src, "lightbox")}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-brand text-black flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-[0_0_20px_rgba(242,125,38,0.4)] shrink-0 ml-4"
                            aria-label={`Download ${flyer.title}`}
                          >
                            <Download size={20} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
