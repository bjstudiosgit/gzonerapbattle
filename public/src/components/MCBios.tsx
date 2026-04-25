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
          <h3 className="text-4xl md:text-7xl font-display uppercase leading-none">The <span className="text-brand">Gzone</span> Roster</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {top5.map((mc, index) => (
            <MCCard key={mc.id} mc={mc} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
