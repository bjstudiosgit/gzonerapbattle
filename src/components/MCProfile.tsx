import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { mcs } from "../data/mcs";
import { battles as allBattles } from "../data/battles";
import { ArrowLeft, Mic2, Trophy, Zap, Play, MapPin, Ruler, Weight, Instagram, Youtube, Quote } from "lucide-react";

export default function MCProfile() {
  const { id } = useParams<{ id: string }>();
  const mc = mcs.find(m => m.id === id);

  if (!mc) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        MC not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  const mcBattles = allBattles.filter(b => b.mc1 === mc.id || b.mc2 === mc.id);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/battles" className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-12 uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Back to Battles
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
                src={mc.image} 
                alt={mc.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('awaiting-photo.png')) return;
                  target.src = `https://picsum.photos/seed/${mc.id}/400/500`;
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20" />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

              {/* Jail Bars for Inactive MCs */}
              {!mc.isActive && (
                <>
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="w-full h-full opacity-60" style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18%, #52525b 18%, #52525b 20%)',
                    }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="bg-black/80 text-white px-8 py-4 border-2 border-white/10 rounded-2xl backdrop-blur-md">
                      <span className="text-brand font-display italic uppercase text-4xl tracking-[0.2em]">LOCKED UP</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand rounded-full flex items-center justify-center font-display text-5xl text-black -rotate-12 z-20 shadow-xl">
              {mc.name[0]}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <h1 className="text-7xl font-display italic uppercase leading-tight mb-2">
                {mc.name}
              </h1>
              <div className="flex items-center gap-3 text-brand font-bold uppercase tracking-[0.2em] text-sm mb-6">
                <span>{mc.nickname || "THE GLADIATOR"}</span>
                <span className="text-zinc-700">•</span>
                <span>G ZONE COMBATANT</span>
              </div>

              {mc.quote && (
                <div className="mb-8 border-l-4 border-brand pl-6 py-2">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <Quote size={16} fill="currentColor" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Fighter Quote</span>
                  </div>
                  <p className="text-xl font-display italic uppercase text-zinc-300 leading-tight">
                    "{mc.quote}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                {mc.weightClass && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <Weight size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{mc.weightClass}</span>
                  </div>
                )}
                {mc.height && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <Ruler size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{mc.height}</span>
                  </div>
                )}
                {mc.location && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <MapPin size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{mc.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                  <Trophy size={16} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.wins} Wins</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                  <Mic2 size={16} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.battles} Battles</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                  <Zap size={16} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.style}</span>
                </div>
              </div>
              
              {(mc.instagram || mc.tiktok || mc.youtube) && (
                <div className="flex items-center gap-4 mt-8">
                  {mc.instagram && (
                    <a 
                      href={mc.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Follow on Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {mc.tiktok && (
                    <a 
                      href={mc.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Follow on TikTok"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </a>
                  )}
                  {mc.youtube && (
                    <a 
                      href={mc.youtube} 
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
              <h2 className="text-2xl font-display italic uppercase mb-4 text-white border-l-4 border-brand pl-4">
                {mc.isActive ? "Biography" : "Status: Locked Up"}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {mc.bio}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display italic uppercase mb-6 text-white border-l-4 border-brand pl-4">Battle History</h2>
              <div className="space-y-4">
                {mcBattles.map((battle) => {
                  const opponentId = battle.mc1 === mc.id ? battle.mc2 : battle.mc1;
                  const opponent = mcs.find(m => m.id === opponentId);
                  return (
                    <div key={battle.id} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                          <img 
                            src={opponent?.image} 
                            alt={opponent?.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src.includes('awaiting-photo.png')) return;
                              target.src = `https://picsum.photos/seed/${opponent?.id}/100/100`;
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">vs Opponent</div>
                          <div className="text-xl font-display italic uppercase group-hover:text-brand transition-colors">{opponent?.name}</div>
                        </div>
                      </div>
                      <Link 
                        to={`/battle/${battle.id}`}
                        className="bg-zinc-800 p-3 rounded-full hover:bg-brand hover:text-black transition-all"
                      >
                        <Play size={20} fill="currentColor" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
