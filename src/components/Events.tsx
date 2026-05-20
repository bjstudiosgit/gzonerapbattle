import { motion } from "motion/react";
import { Calendar, MapPin, Star, Ticket } from "lucide-react";
import { flyerImage } from "../lib/images";

const defaultEventImage = "/gzonebattlemay.png";
const aprilShowdownEventImage = flyerImage("/flyers/26thAprilall.png", "event");
const mayMadnessEventImage = flyerImage("/flyers/tymelessvsdeeno.png", "event");
const mayMadnessTicketLink = "https://www.eventbrite.co.uk/e/the-gzone-rap-battle-league-live-show-30th-may-tickets-1988709260934";

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
    price: "ON SALE NOW",
    image: mayMadnessEventImage,
    ticketLink: mayMadnessTicketLink,
    card: [
      { episode: "1x19", mc1: "Deeno", mc2: "Tymeless" },
      { episode: "1x20", mc1: "C.J Zino", mc2: "1 Flaymah" },
      { episode: "1x21", mc1: "Natty EBK", mc2: "Z.K" },
    ]
  },
  {
    id: 6,
    title: "G ZONE: JUNE CARD",
    date: "27th June 2026",
    location: "G ZONE HQ",
    price: "TO BE CONFIRMED",
    image: defaultEventImage,
    description: "The next live G Zone date is locked. Full battle card and ticket details to be confirmed.",
  },
];

type EventItem = (typeof events)[number];

function EventCard({ event, index, isCompleted = false }: { event: EventItem; index: number; isCompleted?: boolean }) {
  const isFlyerImage = event.image.startsWith("/flyers/");

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
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image}
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

      <div className="p-8 md:p-10">
        <h4 className="text-2xl md:text-3xl font-display uppercase mb-6 group-hover:text-brand transition-colors leading-none tracking-tight">
          {event.title}
        </h4>

        {event.description && (
          <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
            {event.description}
          </p>
        )}

        {event.card && (
          <div className="mb-8 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-3 border-b border-brand/20 pb-2">Full Battle Card</div>
            {event.card.map((match, i) => (
              <div key={i} className={`flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider ${match.isMain ? 'text-white' : 'text-zinc-400'}`}>
                <span className={`${match.isMain ? 'text-brand' : ''} truncate`}>{match.mc1}</span>
                <span className="text-brand/40 mx-2 italic">VS</span>
                <span className={`${match.isMain ? 'text-brand' : ''} truncate ml-auto text-right`}>{match.mc2}</span>
                {match.isMain && <span className="ml-2 text-[8px] bg-brand text-black px-1.5 py-0.5 rounded font-black">MAIN</span>}
              </div>
            ))}
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

        {!isCompleted && event.ticketLink ? (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] text-xs"
          >
            GET TICKETS <Ticket size={16} />
          </a>
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
  const completedEvents = events.filter((event) => event.isCompleted);
  const displayedEvents = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;

  return (
    <section id="events" className="relative pt-6 md:pt-10 pb-24 md:pb-32 overflow-hidden bg-[#050505] scroll-mt-24">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start gap-6"
          >
            <h3 className="text-3xl sm:text-4xl md:text-7xl font-display uppercase text-white tracking-tighter whitespace-nowrap">
              Season 1 <span className="text-brand">"Most Wanted"</span>
            </h3>
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={28} />
              ))}
            </div>
            <p className="text-zinc-400 text-sm md:text-lg max-w-3xl leading-relaxed tracking-tight font-medium opacity-80">
              The archive of high-stakes collisions. Every clash recorded here is a piece of Gzone history, where the UK's top-tier MCs settled scores and established dominance.
            </p>
          </motion.div>
        </div>

        <div className="mb-24">
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
          <div className="pt-16 border-t border-white/10">
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

