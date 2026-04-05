import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";
import MCCard from "./MCCard";

export default function MCBios() {
  const top5 = mcs
    .filter(mc => mc.isActive !== false && mc.id !== 'ldn-mikez')
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.battles;
      const bPoints = (b.wins * 3) + b.battles;
      if (bPoints !== aPoints) return bPoints - aPoints;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    });

  return (
    <section id="mcs" className="py-24 md:py-32 relative scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display italic uppercase leading-none">The <span className="text-brand">GZone</span> Roster</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {top5.map((mc, index) => (
            <MCCard key={mc.id} mc={mc} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/mcs" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-black hover:border-brand transition-all group"
          >
            View All MCs
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
