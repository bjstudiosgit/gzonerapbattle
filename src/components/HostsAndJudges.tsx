import { motion } from "motion/react";
import { Mic2, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";

export default function HostsAndJudges() {
  const staffHosts = hosts.map(h => ({ ...h, type: 'hosts' as const, icon: <Mic2 size={14} /> }));
  const staffJudges = judges.map(j => ({ ...j, type: 'judges' as const, icon: <Gavel size={14} /> }));

  const hostsAndRingGirls = [
    staffHosts[0], // Ginga Jay
    staffHosts[1], // Darren Stewart
    staffHosts[3], // Passive
    staffHosts[2], // Louis Bowers
  ];

  const typeToPath: Record<string, string> = {
    hosts: 'host',
    judges: 'judge'
  };

  const renderPerson = (person: any, index: number) => {
    const isMystery = person.isMystery;
    const content = (
      <div className="flex flex-col h-full">
        <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-white/10 shrink-0">
          <img 
            src={person.listImage || person.image} 
            alt={person.name} 
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-700 ${isMystery ? 'blur-2xl scale-110 opacity-40' : 'grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105'}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          
          {/* Retro scanline overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />

          {isMystery && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute w-full h-2 bg-zinc-800 rotate-45" />
                <div className="absolute w-full h-2 bg-zinc-800 -rotate-45" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 flex flex-col items-start gap-4 bg-zinc-950 flex-1 relative">
          <h4 className="text-2xl md:text-3xl font-display uppercase leading-none text-white drop-shadow-[2px_2px_0px_rgba(242,125,38,1)] group-hover:text-brand group-hover:drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300 transform group-hover:-translate-y-1">{person.name}</h4>
          
          {(person.role === "Celebrity Guest" || person.isCelebrity) && (
            <div className="absolute top-2 right-2 bg-brand text-black px-2 py-0.5 text-[7px] font-black uppercase tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Celebrity
            </div>
          )}
          
          <div className="mt-auto flex w-full items-center justify-center gap-2 px-2 py-2 min-h-[44px] bg-brand text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
            <span className="shrink-0">{person.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight text-center">
              {person.role}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <motion.div
        key={`${person.type}-${person.id}`}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group relative h-full rounded-none overflow-hidden border-2 border-white/10 bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_rgba(242,125,38,1)] hover:border-brand ${isMystery ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {isMystery ? (
          <div className="w-full h-full">{content}</div>
        ) : (
          <Link to={`/${typeToPath[person.type]}/${person.id}`} className="block w-full h-full">
            {content}
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <section id="staff" className="relative py-24 scroll-mt-24 overflow-hidden">
      {/* Background Flow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-carbon opacity-10 z-10" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] z-20" />
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full z-10" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 lg:gap-10"
          >
            {[...hostsAndRingGirls, ...staffJudges].map(renderPerson)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
