import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { judges } from "../data/judges";
import { ArrowLeft, Star, MapPin, Instagram, Youtube, Quote } from "lucide-react";

export default function JudgeProfile() {
  const { id } = useParams<{ id: string }>();
  const judge = judges.find(j => j.id === id);

  if (!judge) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Judge not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-12 uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Back to Home
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
                src={judge.image} 
                alt={judge.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${judge.id}/400/500`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand rounded-full flex items-center justify-center font-display text-5xl text-black -rotate-12 z-20 shadow-xl">
              {judge.name[0]}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <h1 className="text-7xl font-display italic uppercase leading-tight mb-2">
                {judge.name}
              </h1>
              <div className="flex items-center gap-3 text-brand font-bold uppercase tracking-[0.2em] text-sm mb-6">
                <span>{judge.nickname || judge.role}</span>
              </div>

              {judge.quote && (
                <div className="mb-8 border-l-4 border-brand pl-6 py-2">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <Quote size={16} fill="currentColor" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Judge Quote</span>
                  </div>
                  <p className="text-xl font-display italic uppercase text-zinc-300 leading-tight">
                    "{judge.quote}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                {judge.location && (
                  <div className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <MapPin size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{judge.location}</span>
                  </div>
                )}
                {judge.fields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#161a22] px-4 py-2 rounded-xl border border-brand/35 hover:border-brand hover:shadow-[0_0_10px_rgba(242,125,38,0.35)] transition-all group cursor-default">
                    <Star size={16} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{field}</span>
                  </div>
                ))}
              </div>

              {(judge.instagram || judge.tiktok || judge.youtube) && (
                <div className="flex items-center gap-4 mt-8">
                  {judge.instagram && (
                    <a 
                      href={judge.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-110 flex items-center justify-center shadow-lg shadow-brand/20"
                      title="Follow on Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {judge.tiktok && (
                    <a 
                      href={judge.tiktok} 
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
                  {judge.youtube && (
                    <a 
                      href={judge.youtube} 
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
              <h2 className="text-2xl font-display italic uppercase mb-4 text-white border-l-4 border-brand pl-4">Biography</h2>
              <div className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line">
                {judge.bio}
              </div>
            </div>

            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              <h3 className="text-xl font-display italic uppercase mb-4 text-brand">League Role</h3>
              <div className="text-zinc-500 leading-relaxed relative z-10 whitespace-pre-line">
                {judge.leagueRoleDescription || `As a ${judge.role}, ${judge.name} provides expert analysis and scoring for the battles in the G Zone.`}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
