import { Zap, Ticket, Play, Sword } from "lucide-react";

export default function LiveTicker() {
  const items = [
    { text: "BREAKING NEWS! TYMELESS TAKES OUT THE VIKING", type: "live" },
    { text: "LATEST: TYMELESS DEFEATED DEENO", type: "live" },
    { text: "LATEST: ROMAN DEFEATED RYNO", type: "live" },
    { text: "LATEST: DEENO DEFEATED BADEE HARZ", type: "live" },
    { text: "LATEST: BTIZZ DEFEATED 1FLAYMR", type: "live" },
    { text: "LATEST: NATTYEBK DEFEATED Z.K", type: "live" },
    { text: "DEENO VS BADEE HARZ OUT NOW ON YOUTUBE", type: "live" },
    { text: "MAY MADNESS VIDEOS COMING SOON", type: "upcoming" },
    { text: "MORE APRIL SHOWDOWN DROPS COMING NEXT", type: "upcoming" },
  ];

  const tickerItems = [...items, ...items];

  return (
    <div className="w-full bg-brand text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/20 relative z-50 shadow-[0_0_30px_rgba(242,125,38,0.3)]">
      <div
        className="flex w-max items-center gap-12 px-4 animate-marquee"
        style={{ animationDuration: "60s" }}
      >
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 shrink-0">
            {item.type === "live" && !item.text.includes("DEFEATED") && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}

            {item.type === "ticket" && <Ticket size={14} className="animate-bounce" />}
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
