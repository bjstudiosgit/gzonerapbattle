import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center font-display text-2xl text-black italic">G</div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-2xl tracking-tighter uppercase italic">The G Zone</span>
                  <span className="text-[8px] text-zinc-300 uppercase tracking-widest font-bold">In association with Peacock Gymnasium</span>
                </div>
              </Link>
            </div>
            <p className="text-zinc-300 max-w-sm mb-8">
              G Zone is where entertainment meets battle rap. The UK’s uncensored arena showcasing some of the best up-and-coming MCs.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@gingajay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://www.tiktok.com/@gzoneofficialclips" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-brand hover:text-black transition-all" aria-label="Follow us on TikTok">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-zinc-200">Platform</h5>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li><Link to="/events" className="hover:text-brand transition-colors">Events</Link></li>
              <li><Link to="/#mcs" className="hover:text-brand transition-colors">MCs</Link></li>
              <li><Link to="/league" className="hover:text-brand transition-colors">League Table</Link></li>
              <li><Link to="/merch" className="hover:text-brand transition-colors">Merch Store</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-zinc-200">Support</h5>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li><Link to="/apply" className="hover:text-brand transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-300 text-xs">
            © 2024 The G Zone. All rights reserved.
          </p>
          <div className="flex gap-8 text-zinc-300 text-xs">
            <span>Designed by BJ Studios, Manchester</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
