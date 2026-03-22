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
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        {person.tiktok && (
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-brand group-hover:bg-brand group-hover:text-black transition-all">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
              </svg>
            </div>
          </div>
        )}
        
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
    <section id="staff" className="py-24 bg-black relative overflow-hidden scroll-mt-24">
      {/* Orange Contrast Gradient */}
      <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      {/* Flow Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-5xl md:text-6xl font-display italic uppercase">Let me hear you say <span className="text-brand">what?</span></h3>
          <p className="text-zinc-200 mt-4">Meet the team running the UK's most uncensored arena.</p>
        </div>

        <div className="mb-8">
          <h4 className="text-xl font-display italic uppercase text-brand border-l-4 border-brand pl-4 mb-6">Hosts</h4>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {hostsAndRingGirls.map(renderPerson)}
          </motion.div>
        </div>

        <div className="mt-16 mb-8">
          <h4 className="text-xl font-display italic uppercase text-brand border-l-4 border-brand pl-4 mb-6">Judges</h4>
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
