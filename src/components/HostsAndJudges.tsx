import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic2, Gavel, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { ringGirls } from "../data/ringgirls";
import { judges } from "../data/judges";

type Category = "all" | "hosts" | "judges" | "ringgirls";

export default function HostsAndJudges() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const allStaff = [
    ...hosts.map(h => ({ ...h, type: 'hosts' as const, icon: <Mic2 size={14} /> })),
    ...judges.map(j => ({ ...j, type: 'judges' as const, icon: <Gavel size={14} /> })),
    ...ringGirls.map(r => ({ ...r, type: 'ringgirls' as const, icon: <Heart size={14} /> }))
  ];

  const filteredStaff = activeCategory === "all" 
    ? allStaff 
    : allStaff.filter(s => s.type === activeCategory);

  const categories = [
    { id: "all", label: "All Staff", icon: <Users size={16} /> },
    { id: "hosts", label: "Hosts", icon: <Mic2 size={16} /> },
    { id: "judges", label: "Judges", icon: <Gavel size={16} /> },
    { id: "ringgirls", label: "Ring Girls", icon: <Heart size={16} /> },
  ];

  return (
    <section id="staff" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">The Team Behind The Battle</h2>
          <h3 className="text-4xl md:text-6xl font-display italic uppercase mb-8">Official <span className="text-brand">G Zone Crew</span></h3>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activeCategory === cat.id 
                    ? "bg-brand text-black border-brand" 
                    : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-brand/50"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredStaff.map((person, index) => (
              <motion.div
                key={`${person.type}-${person.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900"
              >
                <Link to={`/${person.type.replace('s', '')}/${person.id}`} className="block w-full h-full">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Role Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <span className="text-brand">{person.icon}</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{person.type.replace('s', '')}</span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-brand font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{person.role}</p>
                    <h4 className="text-2xl font-display italic uppercase leading-none">{person.name}</h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
