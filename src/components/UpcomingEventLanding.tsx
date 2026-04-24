import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, Clock, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const flyers = [
  "/flyers/26thAprilall.png",
  "/flyers/RicovsDeeno.png",
  "/flyers/RynovsRoman.png",
  "/flyers/Deeno Vs Badee Harz.png",
  "/flyers/Btizzvs1flaymr.png",
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export const UpcomingEventLanding = () => {
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  const flyerIndex = ((page % flyers.length) + flyers.length) % flyers.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const openFlyer = () => {
    setPage([0, 0]);
    setIsFlyerOpen(true);
  };
  return (
    <section className="relative py-24 overflow-hidden bg-[#050505]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[100px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Details (Mobile: Above Photo, Desktop: Right Side) */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-display text-brand uppercase tracking-tight mb-6">League Points On The Line</h2>
              <h3 className="text-4xl md:text-6xl font-display uppercase leading-tight mb-8 tracking-tight">
                Step In Or Stay <br />
                <span className="text-zinc-700">Forgotten</span>
              </h3>
              
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
                The G-Zone returns to the Peacock Gymnasium for a night of high-stakes battle rap. 
                Featuring a stacked card of veterans and rising stars, plus a special appearance from 
                Celebrity Judge & WBO Champion <span className="text-brand font-black">Denzel Bentley</span>.
              </p>

              {/* Battle Card Preview */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl md:col-span-2 border-brand/30 bg-brand/5">
                  <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                    Main Event
                  </div>
                  <div className="text-xl md:text-2xl font-display uppercase">Tapped 24 <span className="text-brand/40 italic text-sm">VS</span> Grams</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Co-Main</div>
                  <div className="text-lg font-display uppercase">Ricko <span className="text-brand/40 italic text-sm">VS</span> Deeno</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Heavyweight Clash</div>
                  <div className="text-lg font-display uppercase">Ryno <span className="text-brand/40 italic text-sm">VS</span> Roman</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Lyrical War</div>
                  <div className="text-lg font-display uppercase">Deeno <span className="text-brand/40 italic text-sm">VS</span> Badee Harz</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Contenders</div>
                  <div className="text-lg font-display uppercase">Btizz <span className="text-brand/40 italic text-sm">VS</span> 1Flaymr</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Side: Visual/Poster Style (Mobile: Below Details, Desktop: Left Side) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 order-2 lg:order-1"
          >
            <div 
              className="relative group cursor-pointer"
              onClick={openFlyer}
            >
              {/* Stack Effect (Behind Layers) */}
              <div className="absolute inset-4 -right-2 top-6 bg-zinc-800 rounded-3xl border border-white/5 -z-10 group-hover:-right-4 transition-all duration-500" />
              <div className="absolute inset-8 -right-4 top-12 bg-zinc-900 rounded-3xl border border-white/5 -z-20 group-hover:-right-8 transition-all duration-500" />

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="/flyers/26thAprilall.png" 
                  alt="G Zone April Showdown" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest w-fit">
                      Next Event
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest w-fit border border-white/10">
                      Full Card Gallery ({flyers.length})
                    </div>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-display uppercase leading-none mb-4 tracking-tighter">
                    April <span className="text-brand">Showdown</span>
                  </h3>
                  <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-brand" />
                      26th April
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-brand" />
                      Peacock Gymnasium
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-brand rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-[#050505] z-20"
              >
                <span className="text-[10px] font-black uppercase tracking-tighter text-black leading-none">Tickets</span>
                <span className="text-2xl font-black text-black leading-none">£10</span>
                <span className="text-[10px] font-black uppercase tracking-tighter text-black leading-none">From</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Flyer View (Carousel) */}
      <AnimatePresence>
        {isFlyerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setIsFlyerOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFlyerOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-brand transition-colors z-[210] p-2"
            >
              <X size={40} />
            </button>

            {/* Navigation Arrows */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-brand text-white hover:text-black rounded-full flex items-center justify-center transition-all z-[210] border border-white/10 hover:border-brand group"
              onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            >
              <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-brand text-white hover:text-black rounded-full flex items-center justify-center transition-all z-[210] border border-white/10 hover:border-brand group"
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
            >
              <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Carousel Container */}
            <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={page}
                  src={flyers[flyerIndex]}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -10000) {
                      paginate(1);
                    } else if (swipe > 10000) {
                      paginate(-1);
                    }
                  }}
                  className="absolute w-full h-full object-contain cursor-grab active:cursor-grabbing pointer-events-auto drop-shadow-[0_0_50px_rgba(242,125,38,0.2)]"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Swipe Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse pointer-events-none">
                <ChevronLeft size={12} />
                Swipe to explore match-ups
                <ChevronRight size={12} />
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl z-[210]">
              {flyers.map((flyer, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newDirection = index > flyerIndex ? 1 : -1;
                    setPage([index, newDirection]);
                  }}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden transition-all duration-300 border-2 
                    ${index === flyerIndex 
                      ? 'border-brand scale-110 shadow-[0_0_15px_rgba(242,125,38,0.5)]' 
                      : 'border-white/10 opacity-40 hover:opacity-100 hover:border-white/30'}`}
                >
                  <img src={flyer} alt={`Flyer ${index + 1}`} className="w-full h-full object-cover" />
                  {index === flyerIndex && (
                    <motion.div 
                      layoutId="activeThumb"
                      className="absolute inset-0 bg-brand/10"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Floating Counter */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand text-black rounded-full text-[10px] font-black tracking-widest z-[210] shadow-2xl">
              {flyerIndex + 1} / {flyers.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
