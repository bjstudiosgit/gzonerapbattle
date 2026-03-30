import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand rounded flex items-center justify-center font-display text-xl text-black italic">G</div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-xl tracking-tighter uppercase italic leading-none text-brand">THE G ZONE</span>
                  <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-medium mt-0.5">In Association with Peacock Gymnasium</span>
                </div>
              </Link>
            </div>
            <p className="text-zinc-400 text-sm tracking-widest max-w-sm mb-4">
              The UK’s uncensored arena for the next generation of MCs. Where battle rap meets real entertainment.
              Presented by Ginja Entertainment in association with Peacock Gymnasium. Hosted by Ginga Jay.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://www.youtube.com/@gingajay" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on YouTube">
                <Youtube size={16} />
              </a>
              <a href="https://www.tiktok.com/@gzoneofficialclips" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on TikTok">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2 text-zinc-500">Platform</h5>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><Link to="/events" className="hover:text-brand transition-colors">Events</Link></li>
              <li><Link to="/#mcs" className="hover:text-brand transition-colors">MCs</Link></li>
              <li><Link to="/league" className="hover:text-brand transition-colors">League Table</Link></li>
              <li><Link to="/merch" className="hover:text-brand transition-colors">Merch Store</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2 text-zinc-500">Support</h5>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li><Link to="/apply" className="hover:text-brand transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
            © 2024 THE G ZONE. All rights reserved.
          </p>
          <div className="flex gap-8 text-zinc-500 text-[10px] uppercase tracking-widest">
            <span>Designed by <span className="text-zinc-400">BJ Studios</span>, Manchester</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
