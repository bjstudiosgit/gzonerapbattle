import { BookOpen, Zap, Ticket, Play, Sword } from "lucide-react";

export default function LiveTicker() {
  const items = [
    { text: "BREAKING NEWS! TYMELESS BEHEADS THE VIKING", type: "live" },
    { text: "LATEST RESULT: NATTYEBK DEFEATED Z.K", type: "live" },
    { text: "NEW DROP: 1FLAYMR VS CJ ZINO OUT NOW ON YOUTUBE", type: "live" },
    { text: "THE BARS HAVE BEEN BROKEN DOWN: FULL BATTLE WRITE-UPS NOW LIVE", type: "editorial" },
    { text: "TYMELESS VS DEENO: THE AFTERMATH IS LIVE", type: "editorial" },
    { text: "JUNE CARD LOCKED IN: FIVE NEW CLASHES", type: "upcoming" },
    { text: "JUNE TICKETS ON SALE NOW", type: "ticket" },
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
