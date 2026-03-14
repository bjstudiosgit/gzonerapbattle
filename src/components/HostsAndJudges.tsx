import { motion } from "motion/react";
import { Mic2, Gavel, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { ringGirls } from "../data/ringgirls";

const judges = [
  { id: 1, name: "Judge Name", role: "Veteran MC", image: "https://picsum.photos/seed/judge1/400/400" },
  { id: 2, name: "Judge Name", role: "Lyricist", image: "https://picsum.photos/seed/judge2/400/400" },
  { id: 3, name: "Judge Name", role: "Battle Expert", image: "https://picsum.photos/seed/judge3/400/400" },
];

export default function HostsAndJudges() {
  return (
    <section id="hosts" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-20">
          
          {/* Hosts Section */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-black">
                <Mic2 size={24} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em]">The Voices</h2>
                <h3 className="text-4xl font-display italic uppercase">Official <span className="text-brand">Hosts</span></h3>
              </div>
            </div>

            <div className="flex flex-row gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {hosts.map((host, index) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative w-72 aspect-[3/4] flex-shrink-0 rounded-2xl overflow-hidden border border-white/5"
                >
                  <Link to={`/host/${host.id}`} className="block w-full h-full">
                    <img 
                      src={host.image} 
                      alt={host.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-brand font-bold text-xs uppercase tracking-widest mb-1">{host.role}</p>
                      <h4 className="text-2xl font-display italic uppercase">{host.name}</h4>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-brand/50 via-brand/10 to-transparent mt-12" />
          </div>

          {/* Judges Section */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-brand">
                <Gavel size={24} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">The Panel</h2>
                <h3 className="text-4xl font-display italic uppercase">The <span className="text-brand">Judges</span></h3>
              </div>
            </div>

            <div className="flex flex-row gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {judges.map((judge, index) => (
                <motion.div
                  key={judge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative w-64 aspect-[3/4] flex-shrink-0 rounded-2xl overflow-hidden border border-white/5"
                >
                  <img 
                    src={judge.image} 
                    alt={judge.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-brand font-bold text-xs uppercase tracking-widest mb-1">{judge.role}</p>
                    <h4 className="text-xl font-display italic uppercase">{judge.name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-brand/50 via-brand/10 to-transparent mt-12" />
          </div>

          {/* Ring Girls Section */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-brand">
                <Heart size={24} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">The Energy</h2>
                <h3 className="text-4xl font-display italic uppercase">Ring <span className="text-brand">Girls</span></h3>
              </div>
            </div>

            <div className="flex flex-row gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {ringGirls.map((girl, index) => (
                <motion.div
                  key={girl.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative w-72 aspect-[3/4] flex-shrink-0 rounded-2xl overflow-hidden border border-white/5"
                >
                  <Link to={`/ringgirl/${girl.id}`} className="block w-full h-full">
                    <img 
                      src={girl.image} 
                      alt={girl.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-brand font-bold text-xs uppercase tracking-widest mb-1">{girl.role}</p>
                      <h4 className="text-2xl font-display italic uppercase">{girl.name}</h4>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
