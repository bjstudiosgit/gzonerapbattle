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
      <>
        <img 
          src={person.listImage || person.image} 
          alt={person.name} 
          width={400}
          height={533}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-1000 ${isMystery ? 'blur-2xl scale-110 opacity-40' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        
        {isMystery && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
              <div className="absolute w-full h-2 bg-zinc-800 rotate-45 rounded-full" />
              <div className="absolute w-full h-2 bg-zinc-800 -rotate-45 rounded-full" />
            </div>
          </div>
        )}

        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-md text-black shadow-2xl border border-white/20">
            <span className="shrink-0">{person.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">
              {person.role}
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <h4 className="text-2xl md:text-3xl font-display uppercase leading-none group-hover:text-brand transition-all duration-300 transform group-hover:-translate-y-1">{person.name}</h4>
        </div>
      </>
    );

    return (
      <motion.div
        key={`${person.type}-${person.id}`}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:border-brand/40 ${isMystery ? 'cursor-default' : 'cursor-pointer'}`}
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
    <section id="staff" className="relative pb-24 scroll-mt-24">
      <div className="mb-12">
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 lg:gap-10"
        >
          {[...hostsAndRingGirls, ...staffJudges].map(renderPerson)}
        </motion.div>
      </div>
    </section>
  );
}
