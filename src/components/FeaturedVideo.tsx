import { motion } from "motion/react";

export default function FeaturedVideo() {
  return (
    <section className="relative w-full bg-black min-h-[70vh] overflow-hidden flex flex-col items-center justify-center py-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/80 to-zinc-950 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-10 pointer-events-none" />
        {/* Orange Contrast Gradient */}
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
        {/* Flow Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 w-full"
        >
          <h2 className="text-5xl md:text-6xl font-display italic uppercase mb-6 tracking-tighter leading-tight">
            Ginga Entertainment <br /> Presents the <span className="text-brand">G Zone</span>
          </h2>
          <p className="text-zinc-200 text-sm uppercase tracking-widest max-w-2xl mx-auto">
            The UK’s most authentic uncensored rap battle scene
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(242,125,38,0.15)] group"
        >
          <iframe
            className="w-full h-full border-0"
            src="https://www.youtube-nocookie.com/embed/oUDDrQtoTHM?autoplay=1&mute=1&loop=1&playlist=oUDDrQtoTHM"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
          
          {/* Cinematic Vignette for the video */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
