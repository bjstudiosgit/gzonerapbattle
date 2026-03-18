import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic2, Gavel, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";

type Category = "all" | "hosts" | "judges";

export default function HostsAndJudges() {
  const staffHosts = hosts.map(h => ({ ...h, type: 'hosts' as const, icon: <Mic2 size={14} /> }));
  const staffJudges = judges.map(j => ({ ...j, type: 'judges' as const, icon: <Gavel size={14} /> }));

  // Hosts: Ginga Jay, Darren Stewart, Passive, Louis Bowers
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
          src={person.image} 
          alt={person.name} 
          className={`w-full h-full object-cover transition-all duration-700 ${isMystery ? 'blur-md opacity-50' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        {/* Role Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
          <span className="text-brand">{person.icon}</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {person.displayTag || person.type.replace(/s$/, '')}
          </span>
        </div>

        {isMystery && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Large Grey X - X Factor Style */}
              <div className="absolute w-[70%] h-3 bg-zinc-600/90 rotate-45 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              <div className="absolute w-[70%] h-3 bg-zinc-600/90 -rotate-45 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              <div className="absolute w-[70%] h-3 bg-zinc-400/20 rotate-45 rounded-full blur-[2px]" />
              <div className="absolute w-[70%] h-3 bg-zinc-400/20 -rotate-45 rounded-full blur-[2px]" />
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-brand font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{person.role}</p>
          <h4 className="text-2xl font-display italic uppercase leading-none">{person.name}</h4>
        </div>
      </>
    );

    return (
      <motion.div
        key={`${person.type}-${person.id}`}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 ${isMystery ? 'cursor-default' : 'cursor-pointer'}`}
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
    <section id="staff" className="py-24 bg-zinc-950 relative overflow-hidden scroll-mt-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-5xl md:text-6xl font-display italic uppercase">Behind the <span className="text-brand">Chaos</span></h3>
          <p className="text-zinc-400 mt-4">Meet the team running the UK's most uncensored arena.</p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {hostsAndRingGirls.map(renderPerson)}
        </motion.div>

        <div className="mt-12">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {staffJudges.map(renderPerson)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
