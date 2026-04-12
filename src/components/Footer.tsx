import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-carbon opacity-5 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-16">
          <div className="lg:col-span-2 text-left">
            <Link to="/" className="inline-flex items-center gap-4 mb-8 group/logo">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-display text-2xl text-black shadow-[0_0_20px_rgba(242,125,38,0.3)] transition-transform group-hover/logo:scale-110">G</div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-tighter uppercase leading-none text-white group-hover/logo:text-white transition-colors">THE <span className="text-brand">GZONE</span></span>
                <span className="text-[7px] text-zinc-500 uppercase font-black tracking-[0.3em] mt-1.5 opacity-60">In Association with <br /> Peacock Gymnasium</span>
              </div>
            </Link>
            
            <p className="text-zinc-500 text-sm md:text-base uppercase font-black tracking-widest leading-relaxed max-w-md mb-10 opacity-80">
              The UK’s uncensored arena for the next generation of MCs. Where battle rap meets real entertainment.
            </p>
            
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@gingajay" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black hover:border-brand transition-all duration-300 shadow-xl" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://www.tiktok.com/@the.gzone.rbl" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black hover:border-brand transition-all duration-300 shadow-xl" aria-label="TikTok">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 lg:col-span-2">
            <div>
              <h5 className="font-black uppercase tracking-[0.3em] text-[10px] mb-8 text-brand">Directory</h5>
              <ul className="space-y-2">
                <li><Link to="/battles" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Gzone Rap Battles</Link></li>
                <li><Link to="/events" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Next Event</Link></li>
                <li><Link to="/mcs" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">The Roster</Link></li>
                <li><Link to="/map" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">The Gzone MC Map</Link></li>
                <li><Link to="/promo" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Promo Material</Link></li>
                <li><Link to="/lost-property" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Lost Property</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-black uppercase tracking-[0.3em] text-[10px] mb-8 text-brand">Community</h5>
              <ul className="space-y-2">
                <li><Link to="/chat" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">GINJAHOO v1.2</Link></li>
                <li><Link to="/staff" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Meet the Team</Link></li>
                <li><Link to="/league" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">League</Link></li>
                <li><Link to="/apply" className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">Apply Now</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em] order-2 md:order-1">
            © 2026 GINJA ENTERTAINMENT LTD. Company number 16258136
          </p>
          <div className="flex gap-8 text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em] order-1 md:order-2">
            <span>Powered by <a href="https://www.bjstudio.co.uk" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-brand transition-colors">BJSTUDIO</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
