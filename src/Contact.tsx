import React from "react";
import { motion } from "motion/react";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const scrollingText = "WEBSITES. AI SYSTEMS. CONTENT. BUILT FAST. BUILT PROPER.";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] -z-10" />

      <div className="p-6 md:p-12 pt-24 md:pt-32 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-12 md:mb-24">
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-none">Get In Touch</h2>
          <div className="h-[1px] flex-grow bg-brand-orange/30 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-32 items-start">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 md:space-y-12"
          >
            <div>
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight leading-tight">
                Let's build something <br/>
                <span className="text-brand-orange italic">high-leverage</span>.
              </h3>
              <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-lg mb-12">
                Currently taking on select projects for Q2 2024. If you have a challenge that needs technical grit and speed, let's talk.
              </p>
            </div>

            <div className="p-8 border border-brand-orange/20 bg-brand-orange/5 rounded-[2rem] backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/10 transition-colors" />
              <p className="text-gray-300 italic text-xl border-l-2 border-brand-orange pl-8 py-3 leading-relaxed relative z-10">
                "I don't just build websites; I build digital leverage for your business. Let's discuss how we can cut your costs and improve your UX."
              </p>
              <p className="mt-6 text-brand-orange font-bold uppercase tracking-widest text-sm relative z-10 ml-8">— Bradley James Smith</p>
            </div>
          </motion.div>

          {/* Direct Access Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-xs uppercase tracking-[0.4em] font-bold text-gray-500 mb-8 border-b border-white/5 pb-4">Direct Access</div>
            
            <a 
              href="mailto:bradleyjsmithuk@gmail.com"
              className="group block p-10 border border-white/5 bg-zinc-900/30 rounded-[2.5rem] hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-brand-orange/60 font-bold uppercase tracking-widest text-[10px]">
                    <Mail className="w-3 h-3" /> Priority Email
                  </div>
                  <div className="text-2xl md:text-3xl font-display font-medium text-white group-hover:text-brand-orange transition-colors tracking-tight">
                    bradleyjsmithuk@gmail.com
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all">
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                </div>
              </div>
            </a>

            <div className="p-10 border border-white/5 bg-zinc-900/30 rounded-[2.5rem] relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-brand-orange/60 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">
                    Manchester, UK
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12">
               <div className="text-xs uppercase tracking-[0.4em] font-bold text-gray-800 mb-8">Social Presence</div>
               <div className="flex gap-4">
                  {['LinkedIn', 'X/Twitter', 'GitHub'].map((social) => (
                    <button key={social} className="px-6 py-3 border border-white/5 bg-zinc-950 rounded-xl text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-orange hover:border-brand-orange/20 transition-all">
                      {social}
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Scrolling Text Section */}
        <div className="mt-40 relative py-16 border-y border-brand-orange/20 overflow-hidden bg-brand-orange/[0.02]">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16"
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter opacity-10 text-brand-orange">
                {scrollingText}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

