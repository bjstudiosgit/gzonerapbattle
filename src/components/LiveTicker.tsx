import { BookOpen, Zap, Ticket, Play, Sword, ShoppingBag } from "lucide-react";

export default function LiveTicker() {
  const items = [
    { text: "LATEST RESULT: 1 FLAYMAH DEFEATED BADEE HARZ", type: "live" },
    { text: "LATEST RESULT: DEENO DEFEATED CJ ZINO", type: "live" },
    { text: "LATEST RESULT: Z.K DEFEATED 7WAVE", type: "live" },
    { text: "LATEST RESULT: DEENO DEFEATED BTIZZ - 1X22", type: "live" },
    { text: "LATEST RESULT: Z.K DEFEATED C.J ZINO - 1X23", type: "live" },
    { text: "LATEST FREESTYLE RESULT: DEENO DEFEATED AFRODON - FX1", type: "live" },
    { text: "LEAGUE UPDATE: AFRODON JOINS THE GZONE LEAGUE", type: "editorial" },
    { text: "THE BARS HAVE BEEN BROKEN DOWN: FULL BATTLE WRITE-UPS NOW LIVE", type: "editorial" },
    { text: "TYMELESS VS DEENO: THE AFTERMATH IS LIVE", type: "editorial" },
    { text: "GZONE MERCH HAS DROPPED: SHOP THE LATEST COLLECTION", type: "merch" },
    { text: "ROYAL RUMBLE VIDEOS OUT NOW", type: "live" },
    { text: "MAY MADNESS VIDEOS ARE LANDING", type: "upcoming" },
  ];

  const tickerItems = [...items, ...items];

  return (
    <div className="w-full bg-brand text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/20 relative z-50 shadow-[0_0_30px_rgba(242,125,38,0.3)]">
      <div
        className="flex w-max items-center gap-12 px-4 animate-marquee"
        style={{ animationDuration: "60s" }}
      >
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex shrink-0 items-center gap-3">
            {item.type === "live" && !item.text.includes("DEFEATED") && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}

            {item.type === "ticket" && <Ticket size={14} className="animate-bounce" />}
            {item.type === "merch" && <ShoppingBag size={14} />}
            {item.type === "editorial" && <BookOpen size={14} />}
            {item.type === "live" && (item.text.includes("DEFEATED") ? (
              <Sword size={14} className="fill-current" />
            ) : (
              <Play size={14} className="fill-current" />
            ))}
            {item.type === "upcoming" && <Zap size={14} className="animate-pulse" />}

            <span className="font-black text-[11px] md:text-[13px] uppercase tracking-tighter">
              {item.text}
            </span>

            <span className="text-black/30 font-black px-4">/</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-carbon" />
    </div>
  );
}
