import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { battles as allBattles } from "../data/battles";
import { mcs } from "../data/mcs";
import { ArrowLeft, MessageSquare, ThumbsUp, Play, Share2 } from "lucide-react";
import React, { useState } from "react";

export default function BattleDetail() {
  const { id } = useParams<{ id: string }>();
  const battle = allBattles.find(b => b.id === id);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: number; user: string; text: string; date: string }[]>([]);

  const [votes, setVotes] = useState({ mc1: 0, mc2: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Battle not found. <Link to="/" className="text-brand ml-2">Go back</Link>
      </div>
    );
  }

  const mc1 = mcs.find(m => m.id === battle.mc1);
  const mc2 = mcs.find(m => m.id === battle.mc2);

  const handleVote = (side: 'mc1' | 'mc2') => {
    if (hasVoted) return;
    setVotes(prev => ({ ...prev, [side]: prev[side] + 1 }));
    setHasVoted(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "Guest User",
      text: comment,
      date: "Just now"
    };
    setComments([newComment, ...comments]);
    setComment("");
  };

  const totalVotes = votes.mc1 + votes.mc2;
  const mc1Percent = totalVotes > 0 ? Math.round((votes.mc1 / totalVotes) * 100) : 0;
  const mc2Percent = totalVotes > 0 ? Math.round((votes.mc2 / totalVotes) * 100) : 0;

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

            {/* Voting System */}
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display italic uppercase text-white">Who Won This Battle?</h2>
                <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Cast your vote below</p>
              </div>

              <div className="grid grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center font-display italic text-zinc-500 z-10">
                  VS
                </div>

                {/* MC1 Vote */}
                <button 
                  onClick={() => handleVote('mc1')}
                  disabled={hasVoted}
                  className={`relative group overflow-hidden rounded-2xl border transition-all p-8 text-center ${hasVoted ? (votes.mc1 >= votes.mc2 ? 'border-brand bg-brand/5' : 'border-white/5') : 'border-white/10 hover:border-brand/50 bg-zinc-900/30'}`}
                >
                  <div className="relative z-10">
                    <div className="text-3xl font-display italic uppercase mb-2">{mc1?.name}</div>
                    <motion.div 
                      key={votes.mc1}
                      initial={{ scale: 1.2, color: '#FF6321' }}
                      animate={{ scale: 1, color: hasVoted ? '#FF6321' : '#FFFFFF' }}
                      className="text-5xl font-bold mb-1"
                    >
                      {hasVoted ? `${mc1Percent}%` : votes.mc1}
                    </motion.div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Votes</div>
                  </div>
                  {hasVoted && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${mc1Percent}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-brand/10 -z-0"
                    />
                  )}
                </button>

                {/* MC2 Vote */}
                <button 
                  onClick={() => handleVote('mc2')}
                  disabled={hasVoted}
                  className={`relative group overflow-hidden rounded-2xl border transition-all p-8 text-center ${hasVoted ? (votes.mc2 > votes.mc1 ? 'border-brand bg-brand/5' : 'border-white/5') : 'border-white/10 hover:border-brand/50 bg-zinc-900/30'}`}
                >
                  <div className="relative z-10">
                    <div className="text-3xl font-display italic uppercase mb-2">{mc2?.name}</div>
                    <motion.div 
                      key={votes.mc2}
                      initial={{ scale: 1.2, color: '#FF6321' }}
                      animate={{ scale: 1, color: hasVoted ? '#FF6321' : '#FFFFFF' }}
                      className="text-5xl font-bold mb-1"
                    >
                      {hasVoted ? `${mc2Percent}%` : votes.mc2}
                    </motion.div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Votes</div>
                  </div>
                  {hasVoted && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${mc2Percent}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-brand/10 -z-0"
                    />
                  )}
                </button>
              </div>

              {hasVoted && (
                <div className="mt-12 space-y-4">
                  <div className="flex justify-between text-xs uppercase tracking-widest font-bold">
                    <span className="text-brand">{mc1?.name} {mc1Percent}%</span>
                    <span className="text-brand">{mc2?.name} {mc2Percent}%</span>
                  </div>
                  <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mc1Percent}%` }}
                      className="h-full bg-brand"
                    />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mc2Percent}%` }}
                      className="h-full bg-zinc-700"
                    />
                  </div>
                </div>
              )}

              {hasVoted && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-zinc-500 text-xs mt-6 uppercase tracking-widest"
                >
                  Thanks for voting!
                </motion.p>
              )}
            </section>

            {/* Comment Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <MessageSquare className="text-brand" />
                <h2 className="text-2xl font-display italic uppercase text-white">Comments</h2>
                <span className="text-zinc-500 font-mono text-sm">({comments.length})</span>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave your thoughts on this battle..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 text-zinc-100 focus:outline-none focus:border-brand transition-colors min-h-[120px] resize-none"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-brand text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {comments.map((c) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-brand uppercase">
                          {c.user[0]}
                        </div>
                        <span className="font-bold text-zinc-100">{c.user}</span>
                      </div>
                      <span className="text-xs text-zinc-600 uppercase tracking-widest">{c.date}</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      {c.text}
                    </p>
                  </motion.div>
                ))}
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
                Your votes and comments help us rank the MCs and keep the culture growing.
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
