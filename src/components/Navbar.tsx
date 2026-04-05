import { motion, AnimatePresence } from "motion/react";
import { Ticket, ShoppingBag, Users, Trophy, Menu, X, Youtube, Instagram, Play, Mic2, MessageSquare, FileText, MapPin } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Battles", href: "/battles", icon: Play },
    { name: "Tickets", href: "/events", icon: Ticket },
    { name: "MCs", href: "/mcs", icon: Users },
    { name: "Gzone", href: "/map", icon: MapPin },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Staff", href: "/staff", icon: Mic2 },
    { name: "League", href: "/league", icon: Trophy },
    { name: "Apply", href: "/apply", icon: FileText },
  ];

  const isHome = location.pathname === "/";

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    setIsOpen(false);
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-b border-white/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center shrink-0">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 group/logo">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-display text-2xl text-black italic shadow-[0_0_20px_rgba(242,125,38,0.3)] group-hover:scale-110 transition-transform">G</div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-tighter uppercase italic leading-none text-white group-hover:text-brand transition-colors">THE G <span className="text-brand group-hover:text-white">ZONE</span></span>
                <span className="text-[7px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1.5 opacity-60">In Association with Peacock Gymnasium</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 justify-end">
            <div className="ml-8 flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 group/nav
                    ${location.pathname === link.href ? 'text-brand bg-brand/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  <link.icon size={14} className={location.pathname === link.href ? 'text-brand' : 'text-zinc-500 group-hover/nav:text-brand transition-colors'} />
                  {link.name}
                </Link>
              ))}
              
              <div className="h-4 w-px bg-white/10 mx-4" />
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.youtube.com/@gingajay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-brand text-zinc-400 hover:text-black rounded-xl transition-all duration-300 flex items-center justify-center border border-white/5 hover:border-brand shadow-xl"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a 
                  href="https://www.tiktok.com/@the.gzone.rbl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-brand text-zinc-400 hover:text-black rounded-xl transition-all duration-300 flex items-center justify-center border border-white/5 hover:border-brand shadow-xl"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-300 hover:text-brand transition-all"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`flex items-center gap-6 px-6 py-6 rounded-[1.5rem] text-lg font-display italic uppercase tracking-widest transition-all
                    ${location.pathname === link.href ? 'bg-brand text-black shadow-2xl shadow-brand/20' : 'text-zinc-400 active:bg-white/5'}`}
                >
                  <link.icon size={20} className={location.pathname === link.href ? 'text-black' : 'text-brand'} />
                  {link.name}
                </Link>
              ))}
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                <a 
                  href="https://www.youtube.com/@gingajay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-zinc-900 text-white p-6 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border border-white/5"
                >
                  <Youtube size={20} className="text-red-500" /> YouTube
                </a>
                <a 
                  href="https://www.tiktok.com/@the.gzone.rbl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-zinc-900 text-white p-6 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border border-white/5"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.89-.12 3.78-.12 5.67 0 1.23-.19 2.48-.65 3.62-.46 1.14-1.2 2.18-2.12 3.01-1.84 1.67-4.45 2.37-6.87 1.85-2.42-.52-4.55-2.26-5.54-4.52-.99-2.26-.8-4.99.51-7.09 1.31-2.1 3.73-3.48 6.22-3.5V11.5c-1.12.01-2.26.47-3.01 1.3-.75.83-1.1 1.97-1.01 3.08.09 1.11.64 2.17 1.51 2.85.87.68 2.03.95 3.13.75 1.1-.2 2.06-.93 2.6-1.91.54-.98.67-2.13.67-3.23V0l.02.02z"/>
                  </svg>
                  TikTok
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
