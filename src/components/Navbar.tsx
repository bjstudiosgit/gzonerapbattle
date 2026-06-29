"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Users, Trophy, Menu, X, Youtube, Play, Scale } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

function TiktokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navGroups = [
    {
      label: "PenGame",
      tone: "brand",
      links: [
        { name: "Archive", href: "/pengame", icon: Play },
        { name: "League", href: "/league", icon: Trophy },
      ],
    },
    {
      label: "Gzone",
      tone: "gzone",
      links: [
        { name: "Archive", href: "/gzone", icon: Trophy },
        { name: "League", href: "/gzone/league", icon: Trophy },
      ],
    },
    {
      label: "LOTA",
      tone: "neutral",
      links: [
        { name: "MCs", href: "/mcs", icon: Users },
        { name: "Hosts & Judges", href: "/hosts-judges", icon: Scale },
        { name: "Overall League", href: "/lota-league", icon: Trophy },
      ],
    },
  ];

  const isHome = pathname === "/";

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
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-black/75 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brand rounded-xl border border-yellow-200/60 flex items-center justify-center font-display text-xl text-black italic shadow-[0_0_22px_rgba(255,215,0,0.22)] transition-transform group-hover:-rotate-3">L</div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg sm:text-xl tracking-tighter uppercase italic leading-none text-brand">LORD OF THE ARCHIVES</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center gap-4">
              {navGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-1">
                  <div
                    className={`px-2 text-[9px] font-black uppercase tracking-[0.22em] ${
                      group.tone === "gzone" ? "text-gzone" : group.tone === "brand" ? "text-brand" : "text-zinc-500"
                    }`}
                  >
                    {group.label}
                  </div>
                  <div className="flex items-center gap-1">
                    {group.links.map((link) => {
                      const isActive = pathname === link.href;
                      const toneClasses =
                        group.tone === "gzone"
                          ? isActive
                            ? "border-gzone/35 bg-gzone/10 text-gzone"
                            : "border-transparent text-gzone hover:border-gzone/20 hover:bg-gzone/5"
                          : group.tone === "brand"
                            ? isActive
                              ? "border-brand/35 bg-brand/10 text-brand"
                              : "border-transparent text-brand hover:border-brand/20 hover:bg-brand/5"
                            : isActive
                              ? "border-brand/35 bg-brand/10 text-brand"
                              : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/5 hover:text-brand";

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-medium transition-all ${toneClasses}`}
                        >
                          <link.icon size={15} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <a 
                  href="https://www.youtube.com/@LordoftheArchives" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-brand/40 bg-brand/10 hover:bg-brand text-brand hover:text-black p-2 rounded-xl transition-all flex items-center justify-center"
                  aria-label="Follow us on YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a 
                  href="https://www.tiktok.com/@lordofthearchives" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-brand/40 bg-brand/10 hover:bg-brand text-brand hover:text-black p-2 rounded-xl transition-all flex items-center justify-center"
                  aria-label="Follow us on TikTok"
                >
                  <TiktokIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand border border-brand/30 bg-brand/10 hover:bg-brand hover:text-black rounded-xl p-2 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
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
          className="md:hidden border-t border-white/10 bg-black/95 rounded-b-2xl"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navGroups.map((group) => (
              <div key={group.label} className="border-b border-white/5 py-2 last:border-b-0">
                <div
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] ${
                    group.tone === "gzone" ? "text-gzone" : group.tone === "brand" ? "text-brand" : "text-zinc-500"
                  }`}
                >
                  {group.label}
                </div>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium ${
                      group.tone === "gzone"
                        ? "text-gzone hover:bg-gzone/5"
                        : group.tone === "brand"
                          ? "text-brand hover:bg-brand/5"
                          : "text-zinc-200 hover:text-brand"
                    }`}
                  >
                    <link.icon size={20} />
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
            <div className="px-3 py-4 flex items-center justify-center gap-4">
              <a 
                href="https://www.youtube.com/@LordoftheArchives" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-black p-3 rounded-xl transition-all flex items-center justify-center"
                aria-label="Follow us on YouTube"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="https://www.tiktok.com/@lordofthearchives" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand text-black p-3 rounded-xl transition-all flex items-center justify-center"
                aria-label="Follow us on TikTok"
              >
                <TiktokIcon size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
