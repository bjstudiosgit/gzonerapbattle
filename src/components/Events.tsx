import { motion } from "motion/react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 2,
    title: "G ZONE: APRIL SHOWDOWN",
    date: "April 26th 2026",
    location: "Peacock Gymnasium, London",
    price: "Tickets from £10",
    image: "/flyers/26thAprilall.png",
    description: "Featuring World renowned WBO CHAMPION DENZEL BENTLEY doing live match commentary and judging.",
    ticketLink: "https://www.eventbrite.com/e/the-gzone-rap-battle-league-tickets-1985821281911?aff=erelexpmlt",
    card: [
      { mc1: "Tapped 24", mc2: "Grams", isMain: true },
      { mc1: "Ricko", mc2: "Deeno" },
      { mc1: "Ryno", mc2: "Roman" },
      { mc1: "Deeno", mc2: "Badee Harz" },
      { mc1: "Btizz", mc2: "1Flaymr" }
    ],
    doors: "4:00 PM",
    firstBattle: "5:00 PM"
  },
  {
    id: 3,
    title: "G ZONE: MAY MADNESS",
    date: "May 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattlemay.png"
  },
  {
    id: 4,
    title: "G ZONE: JUNE JUMP",
    date: "June 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattlejune.png"
  },
  {
    id: 5,
    title: "G ZONE: JULY JAM",
    date: "July 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattlejuly.png"
  },
  {
    id: 6,
    title: "G ZONE: AUGUST ATTACK",
    date: "August 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattleaugust.png"
  },
  {
    id: 7,
    title: "G ZONE: SEPTEMBER STORM",
    date: "September 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattleseptember.png"
  },
  {
    id: 8,
    title: "G ZONE: OCTOBER ONSLAUGHT",
    date: "October 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattleoctober.png"
  },
  {
    id: 9,
    title: "G ZONE: NOVEMBER NIGHTMARE",
    date: "November 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattlenovember.png"
  },
  {
    id: 10,
    title: "G ZONE: DECEMBER DECIMATION",
    date: "December 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattledecember.png"
  }
];

export default function Events({ limit }: { limit?: number }) {
  const displayedEvents = limit ? events.slice(0, limit) : events;

  return (
    <section id="events" className="relative py-24 md:py-32 overflow-hidden bg-[#050505] scroll-mt-24">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-sm font-black text-brand uppercase tracking-[0.4em] mb-6">Live Experience</h2>
            <h3 className="text-5xl md:text-8xl font-display uppercase leading-[0.8] tracking-tighter mb-10">
              Upcoming <span className="text-zinc-800">Events</span>
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
               <p className="text-zinc-400 text-lg md:text-2xl uppercase tracking-tight font-medium">No politics. No protection. Just Battle Rap.</p>
               <p className="text-zinc-400 text-sm md:text-lg leading-relaxed font-medium opacity-80">
                 Hosted by Ginja Jay alongside UFC & Cage Warriors’ Darren Stewart, with elite judges Passive and Denzel Bentley. 
                 The movement gains momentum with every event.
               </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group bg-black/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand/40 shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="absolute top-6 right-6 bg-brand/90 text-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-brand/40 shadow-xl">
                  {event.price}
                </div>
              </div>
              
              <div className="p-8 md:p-10">
                <h4 className="text-2xl md:text-3xl font-display uppercase mb-6 group-hover:text-brand transition-colors leading-none tracking-tight">
                  {event.title}
                </h4>
                
                {event.description && (
                  <p className="text-zinc-500 text-xs md:text-sm uppercase font-bold tracking-widest leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    {event.description}
                  </p>
                )}

                {event.card && (
                  <div className="mb-8 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-3 border-b border-brand/20 pb-2">Full Battle Card</div>
                    {event.card.map((match, i) => (
                      <div key={i} className={`flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-wider ${match.isMain ? 'text-white' : 'text-zinc-400'}`}>
                        <span className={match.isMain ? 'text-brand' : ''}>{match.mc1}</span>
                        <span className="text-brand/40 mx-2 italic">VS</span>
                        <span className={match.isMain ? 'text-brand' : ''}>{match.mc2}</span>
                        {match.isMain && <span className="ml-2 text-[8px] bg-brand text-black px-1.5 py-0.5 rounded font-black">MAIN</span>}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-4 mb-10 pt-6 border-t border-white/5">
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
                </div>
                
                {event.ticketLink ? (
                  <a 
                    href={event.ticketLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-brand hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-transparent shadow-[0_15px_40px_rgba(242,125,38,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] text-xs"
                  >
                    GET TICKETS <Ticket size={16} />
                  </a>
                ) : (
                  <div className="w-full bg-zinc-900/50 text-zinc-500 py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-white/5 uppercase tracking-[0.3em] text-xs cursor-not-allowed">
                    FIGHT CARD PENDING...
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

