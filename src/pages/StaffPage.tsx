import HostsAndJudges from "../components/HostsAndJudges";
import { Users, Info, ShieldCheck } from "lucide-react";
import GlobalDisclaimer from "../components/GlobalDisclaimer";
import { motion } from "motion/react";

export default function StaffPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden bg-zinc-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 font-display text-[20vw] text-white/[0.02] uppercase leading-none select-none tracking-tighter">
          Promoters
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-24 px-4 md:px-0 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-[8rem] font-display uppercase leading-[0.75] tracking-tighter mb-12 shadow-2xl">
                MEET THE <br/><span className="text-brand drop-shadow-[0_0_30px_rgba(242,125,38,0.3)]">TEAM</span>
              </h1>
              
              <div className="h-1 w-48 bg-gradient-to-r from-brand to-transparent mb-12 origin-left mx-auto lg:mx-0" />
              
              <p className="text-zinc-500 text-xs md:text-sm uppercase font-black tracking-[0.2em] leading-relaxed max-w-4xl border-l-0 lg:border-l-2 border-brand/20 lg:pl-6 py-2 mx-auto lg:mx-0">
                Behind the scenes, G Zone is not run like a typical league, it is controlled by people who understand pressure, performance, and what it takes to hold a room. Figures like Darren Stewart bring a level of discipline and real world experience that most platforms cannot replicate, setting a standard where presence and composure actually matter. Alongside that, Jays brings precision and structure, making sure every matchup, every decision, and every moment carries weight instead of noise. This balance is what separates G Zone from the rest
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="hidden lg:flex relative justify-end items-center z-0"
            >
              <div className="relative group w-full max-w-[400px] xl:max-w-[500px] ml-auto">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand/30 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                
                <img 
                  src="/gingerjaymodel.png" 
                  alt="Ginga Jay" 
                  className="relative z-10 w-full max-h-[60vh] object-contain object-right transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4 drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </header>

        <div className="bg-zinc-950/40 backdrop-blur-3xl p-4 md:p-16 rounded-[5rem] border border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-display uppercase text-white mb-2">Season 1</h3>
            <p className="text-brand font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">"Most Wanted"</p>
          </div>
          <HostsAndJudges />
        </div>
      </div>
    </div>
  );
}
