import { motion } from "motion/react";
import { Download } from "lucide-react";

const flyers = [
  {
    id: "main",
    title: "April Showdown - Main Flyer",
    src: "/flyers/26thAprilall.png",
    aspect: "aspect-[4/5]"
  },
  {
    id: "tapped24-grams",
    title: "Tapped 24 VS Grams",
    src: "/flyers/Tapped24vsGrams.png",
    aspect: "aspect-square"
  },
  {
    id: "rico-deeno",
    title: "Rico VS Deeno",
    src: "/flyers/RicovsDeeno.png",
    aspect: "aspect-square"
  },
  {
    id: "ryno-roman",
    title: "Ryno VS Roman",
    src: "/flyers/RynovsRoman.png",
    aspect: "aspect-square"
  },
  {
    id: "deeno-badee",
    title: "Deeno VS Badee Harz",
    src: "/flyers/Deeno Vs Badee Harz.png",
    aspect: "aspect-square"
  },
  {
    id: "btizz-1flaymr",
    title: "Btizz VS 1Flaymr",
    src: "/flyers/Btizzvs1flaymr.png",
    aspect: "aspect-square"
  }
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

        <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest mb-4 border border-brand/20">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                Next Event
              </div>
              <h2 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight">26th April <span className="text-zinc-500">Showdown</span></h2>
            </div>
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest">
              6 Assets Available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flyers.map((flyer, index) => (
              <motion.div
                key={flyer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`group relative bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-brand/40 shadow-2xl transition-all duration-500 hover:-translate-y-2 ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className={`relative w-full ${flyer.aspect} overflow-hidden`}>
                  <img 
                    src={flyer.src} 
                    alt={flyer.title}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between">
                    <div>
                      <p className="text-white font-display uppercase text-xl tracking-tight mb-1">{flyer.title}</p>
                      <p className="text-brand text-[10px] font-black uppercase tracking-widest">Official Asset</p>
                    </div>
                    <a 
                      href={flyer.src}
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
      </div>
    </div>
  );
}
