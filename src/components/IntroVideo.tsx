"use client";
import { motion } from "motion/react";

export default function IntroVideo() {
  return (
    <section className="relative w-full bg-black min-h-[70vh] overflow-hidden flex items-center z-30 border-b border-brand/30">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-[position:68%_center] sm:bg-center brightness-125 contrast-110"
          style={{ backgroundImage: "url('/hero-archives-emblem.png')" }}
        />
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/75 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 z-10" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent z-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-30 pt-32 pb-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative rounded-2xl border border-white/10 bg-black/15 px-5 py-7 sm:px-8 sm:py-9 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-[2px] before:absolute before:left-0 before:top-8 before:h-16 before:w-1 before:rounded-r-full before:bg-brand before:shadow-[0_0_24px_rgba(255,215,0,0.65)]"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-brand/80">
                UK Grime History
              </p>
              <h1 className="text-3xl md:text-6xl font-display italic leading-[1.1] uppercase tracking-tight">
                The <span className="text-brand">Lord of the Archives</span>.
                <br />
                Every MC. Every Clash. Every Era.
              </h1>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative lg:pl-12"
          >
            <div className="relative" />
          </motion.div>
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none z-40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent z-40" />
    </section>
  );
}
