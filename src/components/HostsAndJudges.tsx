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
    const personnelId = `GZ-${person.type.slice(0, 1).toUpperCase()}-${(index + 1).toString().padStart(2, '0')}`;
    
    const content = (
      <div className="flex flex-col h-full bg-zinc-950">
        <div className="relative aspect-[4/5] overflow-hidden shrink-0 group-hover:brightness-110 transition-all duration-300">
          {/* Tactical ID Stamp */}
          <div className="absolute top-3 left-3 z-30 font-mono text-[8px] text-white/40 tracking-widest uppercase pointer-events-none">
            {personnelId}
          </div>

          {/* Status Indicator */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-none">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-tighter">Status.</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(242,125,38,0.8)]" />
          </div>

          <img 
            src={person.listImage || person.image} 
            alt={person.name} 
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-1000 ${isMystery ? 'blur-2xl scale-110 opacity-40' : 'grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110'}`}
            referrerPolicy="no-referrer"
          />
          
          {/* Noise/Grit Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          {/* Retro scanline overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay group-hover:opacity-20 transition-opacity" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

          {isMystery && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute w-full h-1 bg-zinc-800 rotate-45" />
                <div className="absolute w-full h-1 bg-zinc-800 -rotate-45" />
              </div>
            </div>
          )}

          {/* Bottom Bar Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center gap-6 flex-1 relative border-t-2 border-white/5">
          <div className="space-y-1">
            <h4 className="text-3xl md:text-4xl font-display uppercase leading-tight text-white tracking-tighter transition-all duration-300 group-hover:text-brand">
              {person.name}
            </h4>
            <div className="w-12 h-0.5 bg-brand/30 mx-auto transform translate-y-1 group-hover:w-full group-hover:bg-brand transition-all duration-500" />
          </div>
          
          {(person.role === "Celebrity Guest" || person.isCelebrity) && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-[0.3em] border-2 border-black rotate-1 shadow-[4px_4px_0px_0px_rgba(242,125,38,1)] z-40">
              VIP.Guest
            </div>
          )}
          
          <div className="mt-auto w-full group/label">
            <div className="relative py-3 px-4 bg-brand text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="shrink-0 opacity-80">{person.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-none">
                {person.role}
              </span>
            </div>
            
            {/* Tactical label background elements */}
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-brand opacity-20" />
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-brand opacity-20" />
          </div>
        </div>
        
        {/* Tactical Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10 pointer-events-none group-hover:border-brand/40 transition-colors" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10 pointer-events-none group-hover:border-brand/40 transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10 pointer-events-none group-hover:border-brand/40 transition-colors" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10 pointer-events-none group-hover:border-brand/40 transition-colors" />
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
        className={`group relative h-full rounded-none overflow-hidden border border-white/5 bg-zinc-950 transition-all duration-300 hover:shadow-[20px_20px_60px_rgba(0,0,0,0.8)] ${isMystery ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {!isMystery && (
          <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        )}
        
        {isMystery ? (
          <div className="w-full h-full">{content}</div>
        ) : (
          <Link to={`/${typeToPath[person.type]}/${person.id}`} className="block w-full h-full relative z-20">
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
