import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Logo = () => (
    <a href="/" className="text-2xl font-bold font-display">
      <span className="text-brand-orange">BJS</span>
      <span className="text-white">tudio</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-black text-white relative">
      <nav className="fixed top-0 w-full py-6 px-4 sm:px-6 flex justify-between items-center z-50 bg-transparent">
        <Logo />
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-sm uppercase tracking-widest hover:text-brand-orange transition-colors"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-4 p-6 bg-black border border-slate rounded-lg flex flex-col gap-4 min-w-[150px]"
            >
              <Link to="/clients" className="text-sm uppercase tracking-widest hover:text-brand-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Work</Link>
              <Link to="/journey" className="text-sm uppercase tracking-widest hover:text-brand-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Journey</Link>
              <Link to="/values" className="text-sm uppercase tracking-widest hover:text-brand-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Values</Link>
              <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-brand-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </motion.div>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
