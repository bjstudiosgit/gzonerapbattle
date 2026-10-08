import HostsAndJudges from "../components/HostsAndJudges";

type StaffPageProps = {
  embedded?: boolean;
};

export default function StaffPage({ embedded = false }: StaffPageProps) {
  return (
    <div className={embedded ? "relative mt-20 md:mt-28" : "min-h-screen pt-44 pb-24 relative overflow-hidden bg-zinc-950"}>
      {/* Decorative Background Elements */}
      {!embedded && <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 font-display text-[20vw] text-white/[0.02] uppercase leading-none select-none tracking-tighter">
          Gzone Team
        </div>
      </div>}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className={embedded ? "mb-8" : "mb-10 px-4 md:px-0 text-center lg:text-left"}>
          <div>
            <div className="max-w-4xl">
              <h1 className={embedded ? "font-display text-4xl uppercase text-white md:text-6xl" : "mb-6 font-display text-4xl uppercase md:text-6xl"}>
                <span className={embedded ? "" : "text-brand"}>GZONE TEAM</span>
              </h1>

              {!embedded && <div className="h-1 w-48 bg-gradient-to-r from-brand to-transparent origin-left mx-auto lg:mx-0" />}
            </div>

          </div>
        </header>

        <div className={embedded ? "" : "bg-zinc-950/40 backdrop-blur-3xl p-4 md:p-16 rounded-[5rem] border border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.6)] ring-1 ring-white/10 overflow-hidden"}>
          <HostsAndJudges embedded={embedded} />
        </div>
      </div>
    </div>
  );
}
