import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { hosts } from "../data/hosts";
import { ArrowLeft, Mic2, Star, MapPin, Ruler, Instagram, Youtube, Quote } from "lucide-react";

export default function HostProfile() {
  const { id } = useParams<{ id: string }>();
  const host = hosts.find(h => h.id === id);

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Host not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/staff" 
          aria-label="Back to Staff"
          className="inline-flex items-center gap-3 text-zinc-500 hover:text-brand transition-all mb-12 uppercase tracking-[0.4em] text-[10px] font-black group/back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            {/* Subtle glow behind image */}
            <div className="absolute -inset-10 bg-radial from-brand/20 via-brand/5 to-transparent blur-3xl opacity-50 z-0" />
            
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand/20 z-10">
              <img 
                src={host.image} 
                alt={host.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${host.id}/400/500`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand rounded-full flex items-center justify-center font-display text-5xl text-black -rotate-12 z-20 shadow-xl">
              {host.name[0]}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <h1 className="text-7xl font-display uppercase leading-tight mb-2">
                {host.name}
              </h1>
              <div className="flex items-center gap-3 text-brand font-bold uppercase tracking-[0.2em] text-sm mb-6">
                <span>{host.nickname || (host.fields.includes("UFC VETERAN") ? "UFC VETERAN" : host.role)}</span>
              </div>

              {host.quote && (
                <div className="mb-8 border-l-4 border-brand pl-6 py-2">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <Quote size={16} fill="currentColor" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Fighter Quote</span>
                  </div>
                  <p className="text-xl font-display uppercase text-zinc-300 leading-tight">
                    "{host.quote}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                {host.height && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <Ruler size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{host.height}</span>
                  </div>
                )}
                {host.location && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <MapPin size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{host.location}</span>
                  </div>
                )}
                {host.fields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <Star size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{field}</span>
                  </div>
                ))}
              </div>

              {(host.instagram || host.tiktok || host.youtube) && (
                <div className="flex items-center gap-4 mt-8">
                  {host.instagram && (
                    <a 
                      href={host.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Follow on Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {host.tiktok && (
                    <a 
                      href={host.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Follow on TikTok"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                      </svg>
                    </a>
                  )}
                  {host.youtube && (
                    <a 
                      href={host.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Subscribe on YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="text-2xl font-display uppercase mb-4 text-white border-l-4 border-brand pl-4">Biography</h2>
              <div className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line">
                {host.bio}
              </div>
            </div>

            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              <h3 className="text-xl font-display uppercase mb-4 text-brand">League Role</h3>
              <div className="text-zinc-400 leading-relaxed relative z-10 whitespace-pre-line">
                {host.leagueRoleDescription || `As a ${host.role}, ${host.name} is responsible for maintaining the high-octane atmosphere of the Gzone. Whether it's introducing the combatants or providing expert commentary, they are an essential part of the Ginga Entertainment family.`}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
