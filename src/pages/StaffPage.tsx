import HostsAndJudges from "../components/HostsAndJudges";
import { Users, Info, ShieldCheck } from "lucide-react";

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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full mb-10 shadow-2xl shadow-brand/5 mx-auto lg:mx-0">
                <ShieldCheck size={14} className="text-brand" />
                <span className="text-[10px] md:text-xs uppercase font-black tracking-[0.4em] text-brand">The Board of Control</span>
              </div>
              
              <h1 className="text-6xl md:text-[8rem] font-display uppercase leading-[0.75] tracking-tighter mb-12 shadow-2xl">
                MEET THE <br/><span className="text-brand drop-shadow-[0_0_30px_rgba(242,125,38,0.3)]">TEAM</span>
              </h1>
              
              <div className="h-1 w-48 bg-gradient-to-r from-brand to-transparent mb-12 origin-left mx-auto lg:mx-0" />
              
              <p className="text-zinc-500 text-sm md:text-lg uppercase font-black tracking-[0.2em] leading-relaxed max-w-2xl border-l-0 lg:border-l-2 border-brand/20 lg:pl-6 py-2 mx-auto lg:mx-0">
                The promoters and decision makers running the UK's most <span className="text-white">uncensored arena.</span> <br className="hidden md:block" />
                From the commentary to the judges' bench, every verdict is final. No gas allowed.
              </p>
            </div>

            <div className="lg:text-right bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] backdrop-blur-sm self-center lg:self-start">
              <h2 className="text-3xl md:text-5xl font-display uppercase leading-none mb-6 text-brand">THE GZONE ARENA</h2>
              <p className="text-zinc-500 text-[9px] md:text-xs tracking-normal leading-relaxed max-w-xs ml-auto">
                No filters. No protection. All performances occur within a controlled environment and are for entertainment purposes only. The GZone does not endorse prejudice, racism, or discrimination of any kind. <br/>
              </p>
            </div>
          </div>
        </header>

        <div className="bg-zinc-950/40 backdrop-blur-3xl p-4 md:p-16 rounded-[5rem] border border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden">
          <HostsAndJudges />
        </div>
      </div>
    </div>
  );
}
