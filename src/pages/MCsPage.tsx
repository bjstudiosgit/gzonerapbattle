import { Link } from "react-router-dom";
import { Zap, AlertCircle } from "lucide-react";
import { mcs } from "../data/mcs";
import MCCard from "../components/MCCard";

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {activeMcs.map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={index} />
            ))}
          </div>
        </div>

        {/* Inactive / DSQ MCs */}
        {inactiveMcs.length > 0 && (
          <div>
            <h3 className="text-xl font-display italic uppercase mb-8 flex items-center gap-3 text-zinc-400">
              <AlertCircle size={20} /> In Lockdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {inactiveMcs.map((mc, index) => (
                <MCCard key={mc.id} mc={mc} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
