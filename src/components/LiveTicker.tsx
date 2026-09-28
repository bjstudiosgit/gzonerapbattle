import { Zap, Play } from "lucide-react";

export default function LiveTicker() {
  const items = [
    { text: "OCTOBER TICKETS ON SALE SOON", type: "upcoming" },
    { text: "Z.K VS CJ ZINO OUT NOW", type: "live" },
    { text: "TRICKY - THE FALL OF THE ROMAN EMPIRE MUSIC VIDEO OUT NOW", type: "live" },
    { text: "ROYAL RUMBLE EP1 OUT NOW ON YOUTUBE", type: "live" },
    { text: "SEPTEMBER 26TH BATTLES ARE NOW IN PRODUCTION", type: "upcoming" },
  ];

  const tickerItems = [...items, ...items];

  return (
    <div className="w-full bg-brand text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/20 relative z-50 shadow-[0_0_30px_rgba(242,125,38,0.3)]">
      <div
        className="flex w-max items-center gap-12 px-4 animate-marquee"
        style={{ animationDuration: "90s" }}
      >
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex shrink-0 items-center gap-3">
            {item.type === "live" && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}

            {item.type === "live" && <Play size={14} className="fill-current" />}
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
