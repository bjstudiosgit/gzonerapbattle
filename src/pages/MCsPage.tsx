import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mic2, Trophy, Zap, ChevronRight, AlertCircle } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCsPage() {
  const activeMcs = mcs.filter(mc => mc.isActive !== false);
  const inactiveMcs = mcs.filter(mc => mc.isActive === false);
  const totalMCs = mcs.length;
  const activeMCsCount = activeMcs.length;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-16 gap-12">
          <div className="flex-1">
            <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Roster</h1>
            <h2 className="text-5xl md:text-6xl font-display italic uppercase leading-none mb-6">The <span className="text-brand">GZone</span> MC's</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-3xl">
              The G-Zone roster brings together battle-tested MCs from across the scene, including names like Deeno and Grams, 
              with Passive serving on the judging panel. While some leagues focus on building their own brand first, the G-Zone 
              is built around the MCs themselves. This is an arena where the talent comes first, the battles speak for themselves, and the crowd decides who truly runs the stage.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm min-w-[140px]">
              <div className="text-brand font-display italic text-4xl mb-1">{totalMCs}</div>
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Total MCs</div>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm min-w-[140px]">
              <div className="text-white font-display italic text-4xl mb-1">{activeMCsCount}</div>
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Active Now</div>
            </div>
          </div>
        </div>

        {/* Active MCs */}
        <div className="mb-20">
          <h3 className="text-xl font-display italic uppercase mb-8 flex items-center gap-3">
            <Zap className="text-brand" size={20} /> Active Roster
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {activeMcs.map((mc, index) => (
              <motion.div
                key={mc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <Link to={`/mc/${mc.slug}`} aria-label={`View ${mc.name}'s profile`} className="block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-white/5 bg-zinc-900">
                    <img 
                      src={mc.image} 
                      alt={mc.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('awaiting-photo.png')) return;
                        target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                    
                    {/* Tags */}
                    {mc.tags && mc.tags.length > 0 && (
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
                        {mc.tags.map(tag => (
                          <span key={tag} className="bg-brand text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-display italic uppercase leading-none truncate group-hover:text-brand transition-colors">{mc.name}</h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-brand"><Trophy size={10} /> {mc.wins}W</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View Profile <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inactive / DSQ MCs */}
        {inactiveMcs.length > 0 && (
          <div>
            <h3 className="text-xl font-display italic uppercase mb-8 flex items-center gap-3 text-zinc-400">
              <AlertCircle size={20} /> In Lockdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {inactiveMcs.map((mc, index) => (
                <motion.div
                  key={mc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative opacity-60 grayscale"
                >
                  <Link to={`/mc/${mc.slug}`} aria-label={`View ${mc.name}'s profile`} className="block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-white/5 bg-zinc-900">
                      <img 
                        src={mc.image} 
                        alt={mc.name} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('awaiting-photo.png')) return;
                          target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                      
                      {/* Jail Bars Overlay */}
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="w-full h-full opacity-50" style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18%, #52525b 18%, #52525b 20%)',
                        }} />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center z-30">
                        <span className="bg-black/80 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10">LOCKED UP</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xl font-display italic uppercase leading-none truncate text-zinc-400">{mc.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Locked Up / Inactive</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
