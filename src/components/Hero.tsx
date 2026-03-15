import { motion } from "motion/react";
import { Play, ChevronRight, Ticket } from "lucide-react";
import { mcs } from "../data/mcs";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center py-24 md:py-32 overflow-x-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale"
        >
          <source 
            src="https://player.vimeo.com/external/494252666.sd.mp4?s=727873424a0ce57b1ff566e7484565f1&profile_id=164&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50 z-10" />
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand/20 rounded-full blur-[120px] pointer-events-none z-20" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none z-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="animate-on-air">Latest Battle Out Now</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display italic leading-[0.9] uppercase mb-6 animate-on-air">
              Ginga <br />
              Entertainment <br />
              <span className="text-brand block text-2xl md:text-4xl mt-2">present the G Zone</span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              G Zone is where entertainment meets battle rap. The UK’s uncensored arena showcasing some of the best up-and-coming MCs, male and female. No scripts, no pens — just real clashes, raw energy, and moments you don’t want to miss.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.eventbrite.com/e/the-gzone-rap-battle-league-tickets-1983773740660#location" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand hover:bg-brand-dark text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105 inline-flex items-center"
              >
                Get Tickets <ChevronRight size={20} />
              </a>
              <a 
                href="https://www.youtube.com/watch?v=OGagI2K6StY&t=1546s" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all inline-flex items-center"
              >
                Watch Now <Play size={20} fill="currentColor" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-display italic">11.1K</div>
                <div className="text-zinc-500 text-xs uppercase tracking-tighter">Subscribers</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <div className="text-3xl font-display italic">{mcs.length}</div>
                <div className="text-zinc-500 text-xs uppercase tracking-tighter">Pro MCs</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <div className="text-3xl font-display italic">1</div>
                <div className="text-zinc-500 text-xs uppercase tracking-tighter">Seasons</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <a 
              href="https://www.youtube.com/watch?v=OGagI2K6StY&t=1546s"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand/20 block group max-w-md ml-auto"
            >
              <img 
                src="https://img.youtube.com/vi/OGagI2K6StY/maxresdefault.jpg" 
                alt="Featured Battle" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-white/5 group-hover:border-brand/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-brand font-bold text-sm uppercase tracking-widest">Out Now</span>
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Play size={12} fill="currentColor" /> Watch Now
                  </span>
                </div>
                <h3 className="text-2xl font-display italic uppercase text-orange-500 group-hover:text-brand transition-colors">Season 1</h3>
              </div>
            </a>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand rounded-full flex items-center justify-center font-display text-4xl text-black -rotate-12 z-20">
              G
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
