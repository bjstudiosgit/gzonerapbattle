import { motion } from "motion/react";
import { Ticket, ShoppingBag, Users, Trophy, Menu, X, Youtube, Instagram, Play, Mic2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Battles", href: "/battles", icon: Play },
    { name: "Tickets", href: "/events", icon: Ticket },
    { name: "MCs", href: "/#mcs", icon: Users },
    { name: "Staff", href: "/#staff", icon: Mic2 },
    { name: "League", href: "/league", icon: Trophy },
    { name: "Merch", href: "/merch", icon: ShoppingBag },
  ];

  const isHome = location.pathname === "/";

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (isHome && href.startsWith("/#")) {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        // Calculate position accounting for the 80px (h-20) fixed navbar
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/20 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center font-display text-2xl text-black italic">G</div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-tighter uppercase italic">The G Zone</span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">In association with Peacock Gymnasium</span>
              </div>
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-zinc-400 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 ml-4">
                <a 
                  href="https://www.youtube.com/@gingajay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand hover:bg-brand-dark text-black p-2 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                  title="Follow us on YouTube"
                >
                  <Youtube size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand hover:bg-brand-dark text-black p-2 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                  title="Follow us on Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand hover:bg-brand-dark text-black p-2 rounded-full transition-all transform hover:scale-105 flex items-center justify-center"
                  title="Follow us on TikTok"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-zinc-900 border-b border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-zinc-300 hover:text-orange-500 block px-3 py-4 rounded-md text-base font-medium flex items-center gap-3"
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-4 flex items-center justify-center gap-4">
              <a 
                href="https://www.youtube.com/@gingajay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-black p-3 rounded-xl transition-all flex items-center justify-center"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-black p-3 rounded-xl transition-all flex items-center justify-center"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-black p-3 rounded-xl transition-all flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
