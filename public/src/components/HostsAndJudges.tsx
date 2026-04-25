import { motion } from "motion/react";
import { Mic2, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { portraitImage } from "../lib/images";

export default function HostsAndJudges() {
  const staffHosts = hosts.map(h => ({ ...h, type: 'hosts' as const, icon: <Mic2 size={14} /> }));
  const staffJudges = judges.map(j => ({ ...j, type: 'judges' as const, icon: <Gavel size={14} /> }));

  const hostsAndRingGirls = [
    {
      ...staffHosts[0],
      role: "Host",
      displayTag: "Host",
    }, // Ginga Jay
    {
      ...staffHosts[1],
      role: "Host",
      displayTag: "Host",
      isCelebrity: false,
    }, // Darren Stewart
    {
      ...staffHosts[3],
      role: "Judge",
      displayTag: "Judge",
      type: "judges" as const,
      icon: <Gavel size={14} />,
    }, // Passive
    staffHosts[2], // Louis Bowers
  ];

  const typeToPath: Record<string, string> = {
    hosts: 'host',
    judges: 'judge'
  };

  const formatRole = (role: string) => role.replace(/\s*\/\s*/g, " • ");

  const renderPerson = (person: any, index: number) => {
    const isMystery = person.isMystery;
    const personnelId = `GZ-${person.type.slice(0, 1).toUpperCase()}-${(index + 1).toString().padStart(2, '0')}`;
    const profileLabel = person.displayTag || person.nickname || person.fields?.[0] || person.role;
    const showVipFlag = person.role === "Celebrity Guest" || person.isCelebrity;
    
    const content = (
      <div className="flex h-full flex-col bg-zinc-950">
        <div className="relative aspect-[4/5] overflow-hidden shrink-0 border-b border-white/10 bg-black transition-all duration-500 group-hover:brightness-110">
          {/* Tactical ID Stamp */}
          <div className="absolute top-3 left-3 z-30 font-mono text-[8px] text-white/40 tracking-widest uppercase pointer-events-none transition-colors duration-300 group-hover:text-white/70">
            {personnelId}
          </div>

          {/* Status Indicator */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-none">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-tighter transition-colors duration-300 group-hover:text-white/60">Live.</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(242,125,38,0.8)] transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_14px_rgba(242,125,38,1)]" />
          </div>

          <img 
            src={portraitImage(person.listImage || person.image, "staff")} 
            alt={person.name} 
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover object-top transition-all duration-[1400ms] ${isMystery ? 'scale-110 blur-2xl opacity-40' : 'grayscale contrast-125 brightness-[0.88] group-hover:scale-[1.1] group-hover:-translate-y-1 group-hover:grayscale-0 group-hover:brightness-105'}`}
            referrerPolicy="no-referrer"
          />
          
          {/* Noise/Grit Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.92)_100%)] transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(242,125,38,0.22),transparent_36%)] opacity-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Retro scanline overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay group-hover:opacity-20 transition-opacity" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
          <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] skew-x-[-18deg] opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

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

          {!isMystery && (
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-5 pointer-events-none">
              <div className="flex items-end gap-3">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-white/85 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white">
                  {profileLabel}
                </p>
                <div className="mb-1 h-px flex-1 bg-gradient-to-r from-brand/50 to-transparent transition-all duration-500 group-hover:from-brand group-hover:to-brand/10" />
              </div>
            </div>
          )}
        </div>

        <div className="relative flex flex-1 flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(15,15,16,0.92)_0%,rgba(8,8,9,1)_100%)] p-5 md:p-6">
          {showVipFlag && (
            <div className="absolute -top-3 left-4 z-40 bg-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.3em] text-black border-2 border-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(242,125,38,1)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0">
              VIP Guest
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.34em] text-brand/70 transition-all duration-300 group-hover:tracking-[0.4em] group-hover:text-brand">
                {person.type === "hosts" ? "Host Profile" : "Featured Judge"}
              </p>
              <h4 className="text-3xl md:text-[2.5rem] font-display uppercase leading-[0.95] text-white tracking-[-0.05em] transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand">
                {person.name}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 bg-brand transition-all duration-500 group-hover:w-20" />
              <div className="h-px flex-1 bg-white/10 transition-colors duration-300 group-hover:bg-white/20" />
            </div>

            <p className="max-w-[18rem] text-[11px] uppercase tracking-[0.22em] text-white/58 transition-colors duration-300 group-hover:text-white/75">
              {profileLabel}
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-2 text-left text-[10px] uppercase tracking-[0.26em] text-white/45 transition-colors duration-300 group-hover:text-white/55">
              <span className="font-mono text-white/30">Role</span>
              <span className="text-white/75">{formatRole(person.role)}</span>
            </div>

            <div className="relative overflow-hidden border border-brand/45 bg-brand px-4 py-3 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.18)_45%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="relative flex items-center justify-center gap-3">
                <span className="shrink-0 opacity-80 transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110">{person.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] leading-none text-center">
                  {formatRole(person.role)}
                </span>
              </div>
            </div>
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
        whileHover={isMystery ? undefined : { y: -10 }}
        className={`group relative h-full overflow-hidden border border-white/10 bg-zinc-950 transition-all duration-500 hover:border-brand/50 hover:shadow-[0_24px_80px_rgba(0,0,0,0.55)] ${isMystery ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {!isMystery && (
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(242,125,38,0.02)_0%,rgba(242,125,38,0.08)_100%)] opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        {!isMystery && (
          <div className="pointer-events-none absolute inset-x-8 -bottom-px z-0 h-px bg-brand/0 blur-sm transition-all duration-500 group-hover:bg-brand/80 group-hover:shadow-[0_0_18px_rgba(242,125,38,0.75)]" />
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
