import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Star, Ticket, Trophy } from "lucide-react";
import { flyerImage } from "../lib/images";
import { battles } from "../data/battles";
import { mcs } from "../data/mcs";

const defaultEventImage = "/gzonebattlemay.png";
const aprilShowdownEventImage = flyerImage("/flyers/26thAprilall.png", "event");
const mayMadnessEventImage = flyerImage("/flyers/tymelessvsdeeno.png", "event");
const juneEventImages = [
  flyerImage("/flyers/1flaymahvsbadeeharz.jpeg", "event"),
  flyerImage("/flyers/b-tizzcsmarnigramz.jpeg", "event"),
  flyerImage("/flyers/trickyvsroman.jpeg", "event"),
  flyerImage("/flyers/zkvscjzino.jpeg", "event"),
];

const events = [
  {
    id: 1,
    title: "G ZONE: DECEMBER THROWDOWN",
    date: "December 2025",
    location: "Peacock Gymnasium, London",
    price: "ARCHIVE",
    image: defaultEventImage,
    description: "The winter card that set the tone for the season and locked in the G Zone energy.",
    isCompleted: true,
    card: [
      { mc1: "Renzo", mc2: "Proty" },
      { mc1: "Mikez", mc2: "2MWAD" },
      { mc1: "Mikez", mc2: "Deluxx" },
      { mc1: "Roman", mc2: "Prince" },
      { mc1: "Tapped 24", mc2: "Deeno", isMain: true }
    ]
  },
  {
    id: 2,
    title: "G ZONE: FEBRUARY FRENZY",
    date: "February 2026",
    location: "Peacock Gymnasium, London",
    price: "ARCHIVE",
    image: defaultEventImage,
    description: "A sharp, heavy card with the room fully locked in from the first bar to the last.",
    isCompleted: true,
    card: [
      { mc1: "Deluxx", mc2: "Btizz", isMain: true },
      { mc1: "Tapped 24", mc2: "Roman" },
      { mc1: "Ryno", mc2: "2MWAD" },
      { mc1: "C.J", mc2: "Proty" }
    ]
  },
  {
    id: 3,
    title: "G ZONE: MARCH MAYHEM",
    date: "March 2026",
    location: "Peacock Gymnasium, London",
    price: "ARCHIVE",
    image: defaultEventImage,
    description: "March brought the temperature up again with another stacked night of live clashes.",
    isCompleted: true,
    card: [
      { mc1: "C.J", mc2: "Btizz" },
      { mc1: "Deeno", mc2: "Grams", isMain: true },
      { mc1: "Ryno", mc2: "Tymeless" },
      { mc1: "A.J", mc2: "Tapped 24" },
      { mc1: "Natty", mc2: "Prince" }
    ]
  },
  {
    id: 4,
    title: "G ZONE: APRIL SHOWDOWN",
    date: "April 26th 2026",
    location: "Peacock Gymnasium, London",
    price: "BATTLES COMING SOON",
    image: aprilShowdownEventImage,
    description: "Featuring World renowned WBO CHAMPION DENZEL BENTLEY doing live match commentary and judging.",
    ticketLink: "#",
    isCompleted: true,
    card: [
      { mc1: "Grams", mc2: "Tapped 24", isMain: true },
      { mc1: "Roman", mc2: "Ryno" },
      { mc1: "Deeno", mc2: "Badee Harz" },
      { mc1: "Btizz", mc2: "1Flaymah" }
    ],
    doors: "4:00 PM",
    firstBattle: "5:00 PM"
  },
  {
    id: 5,
    title: "G ZONE: MAY MADNESS",
    date: "31st May 2026",
    location: "G ZONE HQ",
    price: "VIDEOS OUT NOW",
    image: mayMadnessEventImage,
    description: "May Madness is complete. NattyEBK vs Z.K and C.J Zino vs 1 Flaymah are out now.",
    isCompleted: true,
    card: [
      { episode: "1x19", mc1: "C.J Zino", mc2: "1 Flaymah" },
      { episode: "1x20", mc1: "Natty EBK", mc2: "Z.K" },
      { episode: "1x21", mc1: "Deeno", mc2: "Tymeless" },
    ]
  },
  {
    id: 6,
    title: "G ZONE: JUNE CARD - POSTPONED",
    date: "Postponed",
    location: "Peacocks Boxing, Canning Town",
    price: "POSTPONED",
    image: juneEventImages[0],
    images: juneEventImages,
    description: "Due to unforeseen circumstances, the GZone Live event on the 27th June has been postponed. We apologise for any inconvenience this has caused anyone planning on attending. New dates with the same battles plus more will be announced very soon.",
    ticketsOnSale: false,
    card: [
      { episode: "1x22", mc1: "Badee Harz", mc2: "1Flaymr" },
      { episode: "1x23", mc1: "B-Tizz", mc2: "Marni Gramz" },
      { episode: "1x24", mc1: "Tricky", mc2: "Roman" },
      { episode: "1x25", mc1: "Z.K", mc2: "C.J Zino" },
    ]
  },
  {
    id: 7,
    title: "G ZONE: JULY CARD",
    date: "July 2026",
    location: "G ZONE HQ",
    price: "COMING SOON",
    image: defaultEventImage,
    description: "The July card is scheduled. Battle announcements and ticket details are coming soon."
  },
  {
    id: 8,
    title: "G ZONE: AUGUST CARD",
    date: "August 2026",
    location: "G ZONE HQ",
    price: "COMING SOON",
    image: defaultEventImage,
    description: "The August card is scheduled. Battle announcements and ticket details are coming soon."
  },
  {
    id: 9,
    title: "G ZONE: SEPTEMBER CARD",
    date: "September 2026",
    location: "G ZONE HQ",
    price: "COMING SOON",
    image: defaultEventImage,
    description: "The September card is scheduled. Battle announcements and ticket details are coming soon."
  },
  {
    id: 10,
    title: "G ZONE: OCTOBER CARD",
    date: "October 2026",
    location: "G ZONE HQ",
    price: "COMING SOON",
    image: defaultEventImage,
    description: "The October card is scheduled. Battle announcements and ticket details are coming soon."
  },
];

type EventItem = (typeof events)[number];

// Normalize a name for fuzzy matching: lowercase, strip punctuation/spacing/leetspeak.
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[·.·'']/g, "")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z]/g, "");
}

// Map every event matchup (by display name) to a winner display name, using the battles data.
// Returns "mc1" | "mc2" | null per matchup.
function resolveWinners(event: EventItem): Record<number, "mc1" | "mc2" | null> {
  const result: Record<number, "mc1" | "mc2" | null> = {};
  if (!event.card) return result;

  // Build an index of battles keyed by normalized MC pair.
  const battleIndex = battles
    .filter((b) => b.winner)
    .map((b) => {
      const mc1Name = normalizeName(mcs.find((m) => m.id === b.mc1)?.name || b.mc1);
      const mc2Name = normalizeName(mcs.find((m) => m.id === b.mc2)?.name || b.mc2);
      const winnerName = normalizeName(mcs.find((m) => m.id === b.winner)?.name || b.winner);
      return { mc1Name, mc2Name, winnerName, episode: b.episode };
    });

  event.card.forEach((match, i) => {
    const n1 = normalizeName(match.mc1);
    const n2 = normalizeName(match.mc2);
    const pairKey = [n1, n2].sort().join("|");

    // Prefer matching on episode, then fall back to the opponent pair.
    const hit = battleIndex.find(
      (b) =>
        (match.episode && b.episode === match.episode) ||
        [b.mc1Name, b.mc2Name].sort().join("|") === pairKey ||
        n1 === b.mc1Name ||
        n1 === b.mc2Name ||
        n2 === b.mc1Name ||
        n2 === b.mc2Name
    );

    if (!hit) {
      result[i] = null;
    } else if (hit.winnerName === n1 || (hit.winnerName && n1.includes(hit.winnerName))) {
      result[i] = "mc1";
    } else if (hit.winnerName === n2 || (hit.winnerName && n2.includes(hit.winnerName))) {
      result[i] = "mc2";
    } else {
      result[i] = null;
    }
  });

  return result;
}

function EventCard({ event, index, isCompleted = false }: { event: EventItem; index: number; isCompleted?: boolean }) {
  const images = "images" in event ? event.images : undefined;
  const [imageIndex, setImageIndex] = useState(0);
  const activeImage = images?.[imageIndex] || event.image;
  const isFlyerImage = activeImage.startsWith("/flyers/");
  const isPostponed = event.price === "POSTPONED";
  const winners = isCompleted ? resolveWinners(event) : {};

  useEffect(() => {
    if (!images || images.length < 2) return;
    const rotation = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(rotation);
  }, [images]);

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className={`group bg-black/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
        isCompleted
          ? "border-white/10 hover:border-zinc-500/40 opacity-85"
          : "border-white/10 hover:border-brand/40"
      }`}
    >
      <div className="relative h-44 overflow-hidden md:h-64">
        <img
          key={activeImage}
          src={activeImage}
          alt={event.title}
          width={640}
          height={360}
          className={`w-full h-full object-cover transition-transform duration-[1.5s] ${
            isFlyerImage
              ? "group-hover:scale-105 opacity-95"
              : "group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith(defaultEventImage)) return;
            target.src = defaultEventImage;
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isFlyerImage ? "from-black/70 via-transparent to-black/20" : "from-black via-transparent to-black/40"
          }`}
        />
      </div>

      <div className="p-5 md:p-10">
        <h4 className="text-2xl md:text-3xl font-display uppercase mb-6 group-hover:text-brand transition-colors leading-none tracking-tight">
          {event.title}
        </h4>

        {event.description && (
          <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
            {event.description}
          </p>
        )}

        {event.card && (
          <div className="mb-8 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-3 border-b border-brand/20 pb-2">Full Battle Card</div>
            <div className="space-y-2">
              {event.card.map((match, i) => {
                const winnerSide = winners[i];
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
                      match.isMain
                        ? "bg-brand/10 border-brand/40"
                        : "bg-white/[0.03] border-white/5"
                    }`}
                  >
                    <span className={`flex-1 min-w-0 text-right text-xs md:text-sm font-display uppercase tracking-tight leading-tight ${match.isMain ? "text-brand" : "text-white"}`}>
                      {match.mc1}
                      {winnerSide === "mc1" && (
                        <Trophy size={12} className="inline-block ml-1.5 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                    </span>
                    <span className="shrink-0 text-brand/40 italic text-[9px] font-black tracking-widest">VS</span>
                    <span className={`flex-1 min-w-0 text-left text-xs md:text-sm font-display uppercase tracking-tight leading-tight ${match.isMain ? "text-brand" : "text-white"}`}>
                      {winnerSide === "mc2" && (
                        <Trophy size={12} className="inline-block mr-1.5 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                      {match.mc2}
                    </span>
                    {match.isMain ? (
                      <span className="shrink-0 text-[8px] bg-brand text-black px-1.5 py-0.5 rounded font-black tracking-widest">MAIN</span>
                    ) : match.episode ? (
                      <span className="shrink-0 text-[8px] text-zinc-600 font-black tracking-widest">{match.episode}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-10 pt-6 border-t border-white/5">
          {!isCompleted && (
            <>
              <div className="flex items-center gap-4 text-zinc-300 text-xs font-black uppercase tracking-[0.2em]">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Calendar size={14} className="text-brand" />
                </div>
                {event.date}
                {event.doors && <span className="text-zinc-500 ml-auto text-[10px]">Doors: {event.doors}</span>}
              </div>
              <div className="flex items-center gap-4 text-zinc-300 text-xs font-black uppercase tracking-[0.2em]">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <MapPin size={14} className="text-brand" />
                </div>
                {event.location}
              </div>
            </>
          )}
        </div>

        {!isCompleted && isPostponed ? (
          <div className="w-full bg-brand/20 text-brand py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-brand/40 uppercase tracking-[0.3em] text-xs">
            EVENT POSTPONED
          </div>
        ) : !isCompleted && event.ticketLink ? (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] text-xs"
          >
            GET TICKETS <Ticket size={16} />
          </a>
        ) : !isCompleted && event.ticketsOnSale ? (
          <div className="w-full bg-brand text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-brand shadow-[0_15px_40px_rgba(242,125,38,0.2)] uppercase tracking-[0.3em] text-xs">
            TICKETS ON SALE NOW <Ticket size={16} />
          </div>
        ) : !isCompleted && event.card ? (
          <div className="w-full bg-brand/20 text-brand py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-brand/40 uppercase tracking-[0.3em] text-xs">
            ON SALE SOON! <Ticket size={16} />
          </div>
        ) : !isCompleted ? (
          <div className="w-full bg-zinc-900/50 text-zinc-500 py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-white/5 uppercase tracking-[0.3em] text-xs cursor-not-allowed">
            FIGHT CARD PENDING...
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Events({ limit }: { limit?: number }) {
  const upcomingEvents = events.filter((event) => !event.isCompleted);
  const completedEvents = events
    .filter((event) => event.isCompleted)
    .sort((a, b) => b.id - a.id);
  const displayedEvents = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;

  return (
    <section id="events" className="relative pt-6 md:pt-10 pb-24 md:pb-32 overflow-hidden bg-[#050505] scroll-mt-24">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center md:text-left mb-10 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-3 md:gap-6"
          >
            <h3 className="text-3xl sm:text-4xl md:text-7xl font-display uppercase text-white tracking-tighter leading-[0.9]">
              Season 1 <span className="text-brand">"Most Wanted"</span>
            </h3>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
              ))}
            </div>
            <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-80">
              Tickets for GZone events are available now on Eventbrite. Choose your event, book your spot, and be there live when the battles go down.
            </p>
          </motion.div>
        </div>

        <div className="mb-16 md:mb-24">
          <div className="flex items-end justify-between gap-8 mb-10">
            <div>
              <h4 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight">Upcoming Events</h4>
              <p className="mt-3 text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.25em]">Confirm battles</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {displayedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {completedEvents.length > 0 && (
          <div className="pt-10 md:pt-16 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h4 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight">Previous Events</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {completedEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} isCompleted />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
