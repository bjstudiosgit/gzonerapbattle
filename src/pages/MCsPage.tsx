import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mic2, Trophy, Zap, ChevronRight, AlertCircle } from "lucide-react";
import { mcs } from "../data/mcs";

export default function MCsPage() {
  const activeMcs = mcs.filter(mc => mc.isActive !== false);
  const inactiveMcs = mcs.filter(mc => mc.isActive === false);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Roster</h1>
          <h2 className="text-6xl font-display italic uppercase">The <span className="text-brand">GZone</span> MC's</h2>
          <p className="text-zinc-400 mt-4 max-w-2xl">
            The G-Zone roster brings together battle-tested MCs from across the scene, including names like Deenoo and Grams, 
            with Passive serving on the judging panel. While some leagues focus on building their own brand first, the G-Zone 
            is built around the MCs themselves. This is an arena where the talent comes first, the battles speak for themselves, and the crowd decides who truly runs the stage.
          </p>
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
                <Link to={`/mc/${mc.id}`} className="block">
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
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-display italic uppercase leading-none truncate group-hover:text-brand transition-colors">{mc.name}</h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
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
            <h3 className="text-xl font-display italic uppercase mb-8 flex items-center gap-3 text-zinc-500">
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
                  <Link to={`/mc/${mc.id}`} className="block">
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
                      <h4 className="text-xl font-display italic uppercase leading-none truncate text-zinc-500">{mc.name}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Locked Up / Inactive</p>
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
