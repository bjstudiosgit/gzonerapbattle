import { motion } from "motion/react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 2,
    title: "G ZONE: APRIL SHOWDOWN",
    date: "April 26th 2026",
    location: "G ZONE HQ",
    price: "Tickets Available",
    image: "/gzonebattleapril.png",
    description: "Featuring World renowned WBO CHAMPION DENZEL BENTLEY doing live match commentary and judging.",
    ticketLink: "https://www.eventbrite.com/e/the-gzone-rap-battle-league-tickets-1985821281911?aff=erelexpmlt"
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
    <section id="events" className="relative py-24 md:py-32 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h3 className="text-5xl md:text-8xl font-display uppercase leading-[0.8] tracking-tighter mb-8 shadow-2xl">
              THE NEXT BATTLES <span className="text-brand font-black">ARE LOCKED</span>
            </h3>
            <div className="flex flex-col items-center gap-2 mb-12">
               <p className="text-zinc-500 text-sm md:text-2xl uppercase font-black tracking-[0.3em]">No politics. No protection.</p>
               <p className="text-zinc-600 text-[10px] md:text-sm uppercase font-bold tracking-[0.5em] opacity-60">Hosted by Ginja Jay alongside UFC & Cage Warriors’ Darren Stewart, with elite judges Passive and Denzel Bentley, the movement gains momentum with every event.</p>
            </div>
            <div className="inline-block bg-brand hover:bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.3em] text-xs md:text-sm animate-pulse shadow-2xl shadow-brand/20 transition-colors">
              April tickets on sale now
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
                
                <div className="space-y-4 mb-10 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4 text-zinc-300 text-xs font-black uppercase tracking-[0.2em]">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <Calendar size={14} className="text-brand" />
                    </div>
                    {event.date}
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

