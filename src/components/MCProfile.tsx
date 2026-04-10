import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { mcs } from "../data/mcs";
import { battles as allBattles } from "../data/battles";
import { ArrowLeft, Mic2, Trophy, Zap, Play, MapPin, Ruler, Weight, Instagram, Youtube, Quote, Crown, Facebook, Mail, Music } from "lucide-react";

export default function MCProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const mc = mcs.find(m => m.slug === slug);

  if (!mc) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        MC not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  const mcBattles = allBattles.filter(b => b.mc1 === mc.id || b.mc2 === mc.id);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/mcs" 
          aria-label="Back to MCs"
          className="inline-flex items-center gap-3 text-zinc-500 hover:text-brand transition-all mb-12 uppercase tracking-[0.4em] text-[10px] font-black group/back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to MC Roster
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
                width={600}
                height={800}
                fetchPriority="high"
                decoding="async"
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
                      <span className="text-brand font-display uppercase text-4xl tracking-[0.2em]">COOLING OFF</span>
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
              <h1 className="text-7xl font-display uppercase leading-tight mb-2 flex items-center gap-4">
                {mc.name}
                {mc.id === 'ajna' && <Crown className="text-brand" size={48} />}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="text-brand font-bold uppercase tracking-[0.2em] text-sm">
                  {mc.nickname || "THE GLADIATOR"}
                </div>
                {mc.tags && mc.tags.length > 0 && (
                  <div className="flex gap-2">
                    {mc.tags.map(tag => (
                      <span key={tag} className="bg-brand text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-brand/30 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {mc.quote && (
                <div className="mb-8 border-l-4 border-brand pl-6 py-2">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <Quote size={16} fill="currentColor" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Fighter Quote</span>
                  </div>
                  <p className="text-xl font-display uppercase text-zinc-200 leading-tight">
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
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.wins}-{mc.losses} Record</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                  <Mic2 size={16} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.battles === 1 ? "1 Battle" : `${mc.battles} Battles`}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                  <Zap size={16} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{mc.style}</span>
                </div>
              </div>
              
              {(mc.instagram || mc.tiktok || mc.youtube || mc.soundcloud || mc.spotify || mc.facebook || mc.email) && (
                <div className="flex flex-wrap items-center gap-4 mt-8">
                  {mc.instagram && (
                    <a 
                      href={mc.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Follow ${mc.name} on Instagram`}
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
                      aria-label={`Follow ${mc.name} on TikTok`}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                      </svg>
                    </a>
                  )}
                  {mc.youtube && (
                    <a 
                      href={mc.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Subscribe to ${mc.name} on YouTube`}
                    >
                      <Youtube size={20} />
                    </a>
                  )}
                  {mc.facebook && (
                    <a 
                      href={mc.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Follow ${mc.name} on Facebook`}
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {mc.soundcloud && (
                    <a 
                      href={mc.soundcloud} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Listen to ${mc.name} on SoundCloud`}
                    >
                      <Music size={20} />
                    </a>
                  )}
                  {mc.spotify && (
                    <a 
                      href={mc.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Listen to ${mc.name} on Spotify`}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.216.354-.675.465-1.028.249-2.815-1.72-6.358-2.107-10.531-1.153-.404.092-.808-.162-.9-.566-.092-.404.162-.808.566-.9 4.568-1.044 8.484-.606 11.644 1.327.353.216.464.675.249 1.042zm1.472-3.256c-.272.442-.848.583-1.29.311-3.222-1.98-8.134-2.555-11.944-1.399-.498.151-1.023-.133-1.174-.631-.151-.498.133-1.023.631-1.174 4.356-1.322 9.776-.677 13.466 1.59.442.272.583.848.311 1.303zm.127-3.388c-3.864-2.294-10.245-2.506-13.944-1.383-.593.18-1.22-.155-1.4-.748-.18-.593.155-1.22.748-1.4 4.25-1.29 11.294-1.036 15.736 1.601.533.316.707 1.004.391 1.537-.316.533-1.004.707-1.531.393z"/>
                      </svg>
                    </a>
                  )}
                  {mc.email && (
                    <a 
                      href={`mailto:${mc.email}`}
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      aria-label={`Email ${mc.name}`}
                    >
                      <Mail size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="text-2xl font-display uppercase mb-4 text-white border-l-4 border-brand pl-4">
                {mc.isActive ? "Biography" : "Status: Cooling off"}
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                {mc.bio}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display uppercase mb-6 text-white border-l-4 border-brand pl-4">Battle History</h2>
              <div className="space-y-4">
                {mcBattles.map((battle) => {
                  const opponentId = battle.mc1 === mc.id ? battle.mc2 : battle.mc1;
                  const opponent = mcs.find(m => m.id === opponentId);
                  return (
                    <div 
                      key={battle.id} 
                      onClick={() => navigate(`/battle/${battle.slug}`)}
                      className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand/30 transition-all cursor-pointer hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                          <img 
                            src={opponent?.image} 
                            alt={opponent?.name} 
                            width={48}
                            height={48}
                            loading="lazy"
                            decoding="async"
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
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-xs text-zinc-300 uppercase tracking-widest font-bold">vs Opponent</div>
                            {battle.winner && (
                              <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                battle.winner === mc.id 
                                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                              }`}>
                                {battle.winner === mc.id ? 'WIN' : 'LOSS'}
                              </div>
                            )}
                          </div>
                          <Link 
                            to={`/mc/${opponent?.slug}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="text-xl font-display uppercase group-hover:text-brand transition-colors hover:underline decoration-brand/30 underline-offset-4"
                          >
                            {opponent?.name}
                          </Link>
                        </div>
                      </div>
                      <div 
                        className="bg-zinc-800 p-3 rounded-full group-hover:bg-brand group-hover:text-black transition-all"
                        aria-label={`Watch battle vs ${opponent?.name}`}
                      >
                        <Play size={20} fill="currentColor" />
                      </div>
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
