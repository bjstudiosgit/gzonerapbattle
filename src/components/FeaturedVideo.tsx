import { motion } from "motion/react";

export default function FeaturedVideo() {
  return (
    <section className="relative w-full min-h-[40vh] overflow-hidden flex flex-col items-center justify-center py-12 md:py-24">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-carbon opacity-15 z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 w-full"
        >
          <h2 className="text-3xl md:text-6xl font-display uppercase mb-6 tracking-tighter leading-tight text-brand">
            Ginga Entertainment
          </h2>
          <p className="text-zinc-200 text-sm md:text-base tracking-widest max-w-2xl mx-auto">
            Presents the Gzone, an uncensored platform for real rap battles
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
            src="https://www.youtube-nocookie.com/embed/Omge-TNTrhQ"
            title="YouTube video player"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          
          {/* Cinematic Vignette for the video */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
