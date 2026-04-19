import { motion } from "motion/react";
import { Zap, Ticket, Play } from "lucide-react";

export default function LiveTicker() {
  const items = [
    { text: "LIVE NOW: DEENO THE VIKING Vs MARNI THE SHADOW GRAMS", type: "live" },
    { text: "TICKETS: APRIL TICKETS ON SALE NOW", type: "ticket" },
    { text: "UPCOMING: TAPPED24 Vs MARNI THE SHADOW GRAMS - APRIL 26TH", type: "upcoming" },
    { text: "OFFICIAL GZONE MERCH COMING SOON!", type: "merch" },
    { text: "MAKE SURE TO SUBSCRIBE TO BOTH CHANNELS!", type: "info" },
  ];

  // Duplicate items for seamless loop
  const tickerItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-brand text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/20 relative z-50 shadow-[0_0_30px_rgba(242,125,38,0.3)]">
      <motion.div
        className="flex items-center gap-12 px-4"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 shrink-0">
            {item.type === 'live' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}
            {item.type === 'ticket' && <Ticket size={14} className="animate-bounce" />}
            {item.type === 'live' && <Play size={14} className="fill-current" />}
            {item.type === 'upcoming' && <Zap size={14} className="animate-pulse" />}

            <span className="font-black text-[11px] md:text-[13px] uppercase tracking-tighter">
              {item.text}
            </span>

            <span className="text-black/30 font-black px-4">/</span>
          </div>
        ))}
      </motion.div>

      {/* Gritty Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}
