import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { mcs } from "../data/mcs";
import MCCard from "./MCCard";
import HostsAndJudges from "./HostsAndJudges";

export default function MCBios() {
  const top5 = mcs
    .filter(mc => mc.isActive !== false && mc.id !== 'ldn-mikez')
    .sort((a, b) => {
      const aPoints = (a.wins * 3) + a.losses;
      const bPoints = (b.wins * 3) + b.losses;
      if (bPoints !== aPoints) return bPoints - aPoints;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.battles - a.battles;
    });

  return (
    <section id="mcs" className="py-24 md:py-32 relative scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display uppercase leading-none">The Season One Line Up <span className="text-brand">&quot;Most Wanted&quot;</span></h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {top5.map((mc, index) => (
            <MCCard key={mc.id} mc={mc} index={index} />
          ))}
        </div>

        <HostsAndJudges embedded />

      </div>
    </section>
  );
}
