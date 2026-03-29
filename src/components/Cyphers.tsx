import { motion } from "motion/react";

export default function Cyphers() {
  const cypherVideos = [
    { id: "I4ieQV35pdk", title: "G Zone Cypher 1" },
    { id: "LwiRdIpkwNs", title: "G Zone Cypher 2" },
    { id: "qANdhQ1otLc", title: "G Zone Cypher 3" }
  ];

  return (
    <section id="cyphers" className="py-24 relative bg-zinc-950 overflow-hidden scroll-mt-24">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-full h-full bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display italic uppercase mb-6">
            G Zone <span className="text-brand">Cypher</span>
          </h2>
          <div className="w-24 h-1 bg-brand mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cypherVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl group"
            >
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?modestbranding=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
              
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none group-hover:shadow-none transition-shadow duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
