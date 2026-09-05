import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { flyerImage } from "../lib/images";

const defaultEventImage = "/gzonebattlemay.png";
const aprilShowdownEventImage = flyerImage("/flyers/26thAprilall.png", "event");
const mayMadnessEventImage = flyerImage("/flyers/tymelessvsdeeno.png", "event");
const augustEventImages = [
  "/flyers/august-2026-likkle-man.jpeg",
  "/flyers/august-2026-deeno-vs-btizz.jpeg",
  "/flyers/august-2026-zk-vs-cj-zino.jpeg",
];
const august29EventImages = [
  "/flyers/august-29-2026-deeno-vs-cj.jpg",
  "/flyers/august-29-2026-zk-vs-7wxve.png",
  "/flyers/august-29-2026-badee-harz-vs-1flaymah.png",
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
    id: 8,
    title: "G ZONE: ROYAL RUMBLE",
    date: "1st August 2026",
    location: "Peacocks Boxing, Canning Town",
    price: "VIDEOS OUT NOW",
    image: augustEventImages[0],
    images: augustEventImages,
    description: "The 1st August Royal Rumble is complete. Deeno vs Btizz, Z.K vs C.J Zino, Deeno vs Afrodon, and the 9-MC Royal Rumble are out now.",
    isCompleted: true,
    card: [
      { episode: "1x22", mc1: "Deeno", mc2: "Btizz", isMain: true },
      { episode: "1x23", mc1: "Z.K", mc2: "C.J Zino" },
      { episode: "Fx1", mc1: "Deeno", mc2: "Afrodon" },
      { episode: "Fx2", mc1: "Royal Rumble", mc2: "9-MC Clash" },
    ]
  },
  {
    id: 9,
    title: "G ZONE: 29TH AUGUST",
    date: "29th August 2026",
    location: "Peacocks Boxing, Canning Town",
    price: "EVENT COMPLETE",
    image: august29EventImages[0],
    images: august29EventImages,
    description: "The 29th August event is complete. 1 Flaymah defeated Badee Harz, Deeno defeated CJ Zino, and Z.K defeated 7wxve.",
    isCompleted: true,
    card: [
      { episode: "1x24", mc1: "Badee Harz", mc2: "1 Flaymah", winner: "1 Flaymah" },
      { episode: "1x25", mc1: "Deeno", mc2: "CJ Zino", winner: "Deeno" },
      { episode: "1x26", mc1: "Z.K", mc2: "7wxve", winner: "Z.K" },
    ]
  },
  {
    id: 7,
    title: "G ZONE: STREET EDITION",
    date: "Dates to be confirmed",
    location: "The Streets",
    price: "APPLICATIONS OPEN",
    image: defaultEventImage,
    video: "/streetpromo.mp4",
    description: "Gzone is coming to Manchester to find street-ready battle rappers. The best performers from Street Edition will earn spots in Gzone Season 2.",
    applyLink: "/apply"
  },
  {
    id: 10,
    title: "G ZONE: 26TH SEPTEMBER",
    date: "26th September 2026",
    location: "Peacocks Boxing, Canning Town",
    price: "TICKETS £12",
    doors: "5:00 PM",
    image: "/flyers/september-26-2026-marni-gramz-vs-btizz.jpg",
    images: [
      "/flyers/september-26-2026-marni-gramz-vs-btizz.jpg",
      "/flyers/september-26-2026-tymeless-vs-kime.jpg",
      "/flyers/september-26-2026-badee-harz-vs-roman.jpg",
      "/flyers/september-26-2026-afrodon-vs-akzzey.jpg"
    ],
    description: "Official 4-battle card locked in for Saturday 26th September at Peacocks Boxing, Canning Town. Tickets £12 available on Eventbrite, live streaming exclusively on YouTube.",
    isCompleted: false,
    ticketLink: "https://www.eventbrite.co.uk",
    card: [
      { episode: "1x27", mc1: "TYMELESS", mc2: "K.I.M.E" },
      { episode: "1x28", mc1: "AFRODON", mc2: "AKZZEY" },
      { episode: "1x29", mc1: "MARNI GRAMZ", mc2: "BTIZZ" },
      { episode: "1x30", mc1: "BADEE HARZ", mc2: "ROMAN" }
    ]
  }
];

type EventItem = (typeof events)[number];

function EventCard({ event, index, isCompleted = false }: { event: EventItem; index: number; isCompleted?: boolean }) {
  const images = "images" in event ? event.images : undefined;
  const [imageIndex, setImageIndex] = useState(0);
  const activeImage = images?.[imageIndex] || event.image;
  const isFlyerImage = activeImage.startsWith("/flyers/");

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
        {"video" in event ? (
          <video
            src={event.video}
            className="h-full w-full object-cover opacity-80 transition-transform duration-[1.5s] group-hover:scale-105"
            autoPlay
            controls
            loop
            playsInline
          />
        ) : images && images.length > 1 ? (
          <>
            {images.map((imgSrc, imgIdx) => {
              const isCurrent = imgIdx === imageIndex;
              return (
                <img
                  key={imgSrc}
                  src={imgSrc}
                  alt={event.title}
                  width={640}
                  height={360}
                  className={`absolute inset-0 w-full h-full object-cover object-top bg-black transition-opacity duration-700 ease-in-out ${
                    isCurrent ? "opacity-95 z-10" : "opacity-0 pointer-events-none z-0"
                  }`}
                  referrerPolicy="no-referrer"
                  loading={imgIdx === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith(defaultEventImage)) return;
                    target.src = defaultEventImage;
                  }}
                />
              );
            })}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
              {images.map((_, imgIdx) => (
                <span
                  key={imgIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    imgIdx === imageIndex ? "w-5 bg-brand" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            key={activeImage}
            src={activeImage}
            alt={event.title}
            width={640}
            height={360}
            className={`w-full h-full transition-transform duration-[1.5s] ${
              isFlyerImage
                ? "object-cover object-top bg-black group-hover:scale-105 opacity-95"
                : "object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith(defaultEventImage)) return;
              target.src = defaultEventImage;
            }}
          />
        )}
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
          <div className="mb-8 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-3 border-b border-brand/20 pb-2">Full Battle Card</div>
            {event.card.map((match, i) => {
              const winner = "winner" in match ? match.winner : undefined;
              return (
                <div key={i} className={`flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider ${match.isMain ? 'text-white' : 'text-zinc-400'}`}>
                  <span className={`${match.isMain || winner === match.mc1 ? 'text-brand' : ''} truncate`}>{match.mc1}</span>
                  <span className="text-brand/40 mx-2 italic">VS</span>
                  <span className={`${match.isMain || winner === match.mc2 ? 'text-brand' : ''} truncate ml-auto text-right`}>{match.mc2}</span>
                  {winner && <span className="ml-2 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 text-[8px] font-black text-black">{winner} WON</span>}
                  {match.isMain && <span className="ml-2 text-[8px] bg-brand text-black px-1.5 py-0.5 rounded font-black">MAIN</span>}
                </div>
              );
            })}
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

        {!isCompleted && "applyLink" in event ? (
          <Link
            to={event.applyLink}
            className="w-full bg-brand hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] text-xs"
          >
            APPLY NOW <Ticket size={16} />
          </Link>
        ) : !isCompleted && "ticketLink" in event && event.ticketLink ? (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] text-xs"
          >
            GET TICKETS <Ticket size={16} />
          </a>
        ) : !isCompleted && "ticketsOnSale" in event && event.ticketsOnSale ? (
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
  const upcomingEvents = events
    .filter((event) => !event.isCompleted)
    .sort((a, b) => b.id - a.id);
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
              The 29th August event is complete. Results are confirmed and the battle videos are now in production.
            </p>
          </motion.div>
        </div>

        <div className="mb-16 md:mb-24">
          <div className="flex items-end justify-between gap-8 mb-10">
            <div>
              <h4 className="text-3xl md:text-5xl font-display uppercase text-white tracking-tight">Upcoming Events</h4>
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

