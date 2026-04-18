import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpcomingEventLanding = () => {
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
              <h2 className="text-sm font-black text-brand uppercase tracking-[0.4em] mb-6">League Points On The Line</h2>
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
            <div className="relative group">
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                    Next Event
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
    </section>
  );
};
