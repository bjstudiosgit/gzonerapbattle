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
          src={person.listImage || person.image} 
          alt={person.name} 
          width={400}
          height={533}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${isMystery ? 'blur-md opacity-50' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
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
          <div className="flex items-center gap-2 mb-3 min-h-[2.5rem]">
            <span className="text-brand shrink-0">{person.icon}</span>
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em] leading-tight flex-1">
              {person.role}
            </span>
            <span className="w-8 h-px bg-white/10 shrink-0" />
          </div>
          <h4 className="text-2xl font-display italic uppercase leading-none group-hover:text-brand transition-colors">{person.name}</h4>
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
    <section id="staff" className="py-12 md:py-24 bg-black relative overflow-hidden scroll-mt-24">
      {/* Orange Contrast Gradient */}
      <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      {/* Flow Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display italic uppercase leading-tight mb-6">Let me hear you say <span className="text-brand">what?</span></h3>
          <p className="text-zinc-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-80">Meet the team running the UK's most uncensored arena.</p>
          <p className="text-brand font-bold uppercase tracking-widest mt-4">You know this right? we dont play no games!</p>
        </div>

        <div className="mb-8">
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6"
          >
            {[...hostsAndRingGirls, ...staffJudges].map(renderPerson)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
