import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, MessageSquare, Play } from "lucide-react";

export default function BackstagePromo() {
  return <section className="relative px-4 sm:px-6 lg:px-10 py-10 md:py-16" aria-labelledby="backstage-promo-title">
    <div className="relative max-w-[1432px] mx-auto overflow-hidden rounded-xl border border-orange-300/20 bg-[#ed7828] text-[#24170f]">
      <div className="relative grid md:grid-cols-[1.3fr_1fr]">
        <div className="relative z-10 p-7 sm:p-10 lg:p-14">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5">NEW · THE GZONE MEMBERS’ AREA</p>
          <h2 id="backstage-promo-title" className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] uppercase">The battle ends.<br /><span className="text-[#fff2dc]">Backstage begins.</span></h2>
          <p className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed">Raw reactions. Ginger transformations. Unfiltered chat. Get inside and see the other side of Gzone.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-3 mt-6 text-xs font-bold">
            <li className="flex items-center gap-2"><Play size={16} aria-hidden="true" /> Ginga Reactions</li>
            <li className="flex items-center gap-2"><Camera size={16} aria-hidden="true" /> Ginga Cam</li>
            <li className="flex items-center gap-2"><MessageSquare size={16} aria-hidden="true" /> Gingahoo chat</li>
          </ul>
          <Link to="/backstage" className="inline-flex items-center justify-center gap-6 mt-8 px-7 py-4 rounded bg-[#24170f] text-[#fff2dc] hover:bg-[#49301e] transition-colors text-xs font-black tracking-widest">ENTER BACKSTAGE <ArrowUpRight size={20} aria-hidden="true" /></Link>
          <p className="mt-3 text-[11px] text-[#583016]">Sign in with Google · Adults only</p>
        </div>
        <div className="relative min-h-64 md:min-h-full overflow-hidden bg-[#21170f]">
          <img src="/portraits/ginga-jay-updated-2026.png" alt="Ginga Jay" loading="lazy" width={1320} height={1191} className="absolute inset-0 w-full h-full object-cover object-top opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#21170f] via-transparent to-[#21170f]/20" />
          <p className="absolute bottom-7 left-7 right-7 font-display text-5xl lg:text-6xl text-[#fff2dc] uppercase leading-none">Same Gzone.<br /><span className="text-orange-400">Less filter.</span></p>
        </div>
      </div>
    </div>
  </section>;
}
