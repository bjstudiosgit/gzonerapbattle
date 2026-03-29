import { motion } from "motion/react";
import { Mic2, Play, Calendar, Clock } from "lucide-react";

const cyphers = [
  {
    id: 1,
    title: "G Zone Cypher #01",
    date: "Coming Soon",
    duration: "TBD",
    thumbnail: "https://picsum.photos/seed/cypher1/800/450",
    description: "The first official G Zone cypher featuring a heavy lineup of UK talent."
  },
  {
    id: 2,
    title: "G Zone Cypher #02",
    date: "Coming Soon",
    duration: "TBD",
    thumbnail: "https://picsum.photos/seed/cypher2/800/450",
    description: "Raw bars and heavy beats. The second installment of our cypher series."
  }
];

export default function CyphersPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-white selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.4em] mb-4">The Series</h1>
          <h2 className="text-4xl md:text-7xl font-display italic uppercase leading-none mb-6">
            G Zone <span className="text-brand">Cyphers</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto md:mx-0">
            Unfiltered talent from the UK underground. Our cypher series brings together the sharpest lyricists for raw, high-energy sessions.
          </p>
        </div>

        {/* Cyphers Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {cyphers.map((cypher, index) => (
            <motion.div
              key={cypher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-zinc-900/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-brand/30 transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={cypher.thumbnail} 
                  alt={cypher.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-brand text-black rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-display italic uppercase group-hover:text-brand transition-colors">{cypher.title}</h3>
                  <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                    Upcoming
                  </span>
                </div>
                
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  {cypher.description}
                </p>
                
                <div className="flex items-center gap-6 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand" />
                    {cypher.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brand" />
                    {cypher.duration}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center p-12 bg-zinc-900/20 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <Mic2 className="absolute -left-12 -bottom-12 w-64 h-64 text-brand/5 -rotate-12" />
          <div className="relative z-10">
            <h3 className="text-3xl font-display italic uppercase mb-4">Want to jump in?</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              We're always looking for new talent to feature in our cyphers. Apply now to join the next session.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand/90 transition-colors"
            >
              Apply to MC
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
