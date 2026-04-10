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
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 md:mb-24 gap-12 text-center lg:text-left">
          <div className="flex-1">
            <h2 className="text-5xl md:text-9xl font-display uppercase leading-[0.8] mb-8">
              The <span className="text-brand">Gzone</span> MC's
            </h2>
            <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed uppercase tracking-tight font-medium opacity-80 mx-auto lg:mx-0">
              The Gzone roster brings together battle-tested MCs from across the scene. 
              This is an arena where the talent comes first, the battles speak for themselves, and the crowd decides who truly runs the stage.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0 justify-center">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl min-w-[160px] shadow-2xl group hover:border-brand/40 transition-all">
              <div className="text-brand font-display text-4xl md:text-6xl mb-1 group-hover:scale-110 transition-transform">{totalMCs}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Roster</div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl min-w-[160px] shadow-2xl group hover:border-brand/40 transition-all">
              <div className="text-white font-display text-4xl md:text-6xl mb-1 group-hover:scale-110 transition-transform">{activeMCsCount}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Now</div>
            </div>
          </div>
        </div>

        {/* Active MCs Grid */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
            <h3 className="text-2xl md:text-4xl font-display uppercase flex items-center gap-4 text-white">
              <Zap className="text-brand animate-pulse" size={24} /> The Active Roster
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {activeMcs.map((mc, index) => (
              <MCCard key={mc.id} mc={mc} index={index} />
            ))}
          </div>
        </div>

        {/* Inactive / Cooling off Section */}
        {inactiveMcs.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-red-950/5 blur-[100px] pointer-events-none" />
            <div className="flex items-center gap-4 mb-10 opacity-50">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-2xl md:text-4xl font-display uppercase flex items-center gap-4 text-zinc-500">
                <AlertCircle size={24} /> Cooling off
              </h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0 duration-700">
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
