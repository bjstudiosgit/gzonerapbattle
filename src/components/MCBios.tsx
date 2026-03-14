import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mic2, Trophy, Zap, ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCBios() {
  return (
    <section id="mcs" className="py-24 relative bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="max-w-xl">
            <h3 className="text-5xl font-display italic uppercase mb-6">The <span className="text-brand">GZone</span> MC's</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mcs.filter(mc => mc.isActive !== false).map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Link to={`/mc/${mc.id}`} className="block">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 border border-white/5">
                  <img 
                    src={mc.image} 
                    alt={mc.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                       if (target.src.includes('awaiting-photo.png')) return;
                      target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4 bg-brand text-black w-10 h-10 rounded-full flex items-center justify-center font-display italic text-xl">
                    #{index + 1}
                  </div>
                  
                  <div className="absolute bottom-6 left-6">
                    <h4 className="text-3xl font-display italic uppercase mb-1">{mc.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-brand font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Trophy size={12} /> {mc.wins} Wins</span>
                      <span className="flex items-center gap-1"><Zap size={12} /> {mc.style.split(' / ')[0]}</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="px-2">
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                  {mc.bio.substring(0, 80)}...
                </p>
                <Link to={`/mc/${mc.id}`} className="text-brand font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-2 transition-transform">
                  View Full Bio <Mic2 size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
