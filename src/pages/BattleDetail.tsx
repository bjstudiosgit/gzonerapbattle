import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { battles as allBattles } from "../data/battles";
import { mcs } from "../data/mcs";
import { ArrowLeft, Play, Share2, Trophy } from "lucide-react";

export default function BattleDetail() {
  const { id } = useParams<{ id: string }>();
  const battle = allBattles.find(b => b.id === id);

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Battle not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  const mc1 = mcs.find(m => m.id === battle.mc1);
  const mc2 = mcs.find(m => m.id === battle.mc2);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/mc/${mc1?.id}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-12 uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Back to MC Profile
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Battle Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-display italic uppercase leading-tight mb-8">
                {mc1?.name} <span className="text-brand">VS</span> {mc2?.name}
              </h1>
              
              <div className="aspect-video bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden relative group">
                {battle.videoUrl ? (
                  <iframe
                    src={battle.videoUrl}
                    title={battle.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img 
                      src={`https://picsum.photos/seed/${battle.id}/1280/720`} 
                      alt="Battle Thumbnail" 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-24 h-24 bg-brand text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-brand/50">
                        <Play size={40} fill="currentColor" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Battle Result */}
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display italic uppercase text-white">Battle Result</h2>
                <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">
                  {battle.winner ? "Official Judges' Decision" : "Awaiting Decision"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center font-display italic text-zinc-500 z-10">
                  VS
                </div>

                {/* MC1 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${battle.winner === mc1?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc1?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc1?.id ? 'mt-8' : ''}`}>
                    <div className="text-3xl font-display italic uppercase">{mc1?.name}</div>
                  </div>
                </div>

                {/* MC2 Result */}
                <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${battle.winner === mc2?.id ? 'border-brand bg-brand/5 ring-2 ring-brand ring-offset-4 ring-offset-zinc-950' : 'border-white/5 bg-zinc-900/30'}`}>
                  {battle.winner === mc2?.id && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                      <Trophy size={14} /> Official Winner
                    </div>
                  )}
                  <div className={`relative z-10 ${battle.winner === mc2?.id ? 'mt-8' : ''}`}>
                    <div className="text-3xl font-display italic uppercase">{mc2?.name}</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-display italic uppercase mb-6 text-white">Battle Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">Date</span>
                  <span className="text-zinc-100 font-bold">{battle.date || "TBD"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">Views</span>
                  <span className="text-zinc-100 font-bold">{battle.views || "0"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">League</span>
                  <span className="text-orange-500 font-bold">Season 1</span>
                </div>
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl transition-colors font-bold uppercase tracking-widest text-xs">
                <Share2 size={16} /> Share Battle
              </button>
            </div>

            <div className="bg-brand/10 p-8 rounded-3xl border border-brand/20">
              <h3 className="text-xl font-display italic uppercase mb-4 text-brand">Support the Zone</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Watch the battles on YouTube and leave your comments there to support the culture.
              </p>
              <Link to="/merch" className="block text-center bg-brand text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                Visit Merch Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
