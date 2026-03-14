import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ringGirls } from "../data/ringgirls";
import { ArrowLeft, Heart, Star, MapPin, Ruler, Instagram, Youtube } from "lucide-react";

export default function RingGirlProfile() {
  const { id } = useParams<{ id: string }>();
  const girl = ringGirls.find(g => g.id === id);

  if (!girl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Profile not found. <Link to="/" className="text-brand ml-2">Go back</Link>
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
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand/20">
              <img 
                src={girl.image} 
                alt={girl.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${girl.id}/400/500`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand rounded-full flex items-center justify-center font-display text-5xl text-black -rotate-12 z-20 shadow-xl">
              {girl.name[0]}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <h1 className="text-7xl font-display italic uppercase leading-tight mb-2">
                {girl.name} <br />
                <span className="text-brand">{girl.nickname || girl.role}</span>
              </h1>
              <div className="flex flex-wrap gap-6 mt-6">
                {girl.height && (
                  <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                    <Ruler size={18} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-xs">{girl.height}</span>
                  </div>
                )}
                {girl.location && (
                  <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                    <MapPin size={18} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-xs">{girl.location}</span>
                  </div>
                )}
                {girl.fields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                    <Star size={18} className="text-brand" />
                    <span className="font-bold uppercase tracking-widest text-xs">{field}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                  <Heart size={18} className="text-brand" />
                  <span className="font-bold uppercase tracking-widest text-xs">
                    G Zone {girl.role}
                  </span>
                </div>
              </div>

              {(girl.instagram || girl.tiktok || girl.youtube) && (
                <div className="flex items-center gap-4 mt-6">
                  {girl.instagram && (
                    <a 
                      href={girl.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                      title="Follow on Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {girl.tiktok && (
                    <a 
                      href={girl.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                      title="Follow on TikTok"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </a>
                  )}
                  {girl.youtube && (
                    <a 
                      href={girl.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-brand hover:bg-brand-dark text-black p-3 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                      title="Subscribe on YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="text-2xl font-display italic uppercase mb-4 text-white">Biography</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {girl.bio}
              </p>
            </div>

            <div className="p-8 bg-zinc-900/30 rounded-3xl border border-white/5">
              <h3 className="text-xl font-display italic uppercase mb-4 text-brand">League Role</h3>
              <p className="text-zinc-500 leading-relaxed">
                As a {girl.role}, {girl.name} is the face of the rounds in the G Zone. Her presence adds to the professional atmosphere of Ginga Entertainment events, ensuring that the transition between rounds is as high-energy as the battles themselves.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
