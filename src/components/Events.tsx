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
    <section id="events" className="relative py-24 overflow-hidden scroll-mt-24 bg-black">
      {/* Background with Gorilla Flow */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/gorilla-viking/1920/1080?blur=10" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10 grayscale"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-10" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px] pointer-events-none z-20" />
        {/* Flow Overlays */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl md:text-7xl font-display italic uppercase leading-none">Upcoming <span className="text-brand">Events</span></h3>
            <div className="mt-8 inline-block bg-brand text-black px-8 py-3 rounded-full font-bold uppercase tracking-[0.2em] text-xs md:text-sm animate-pulse shadow-lg shadow-brand/20">
              Tickets Now On Sale
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-zinc-950/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-brand/30 transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-zinc-900 text-brand px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest border border-brand/20">
                  {event.price}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-display italic uppercase mb-4 group-hover:text-brand transition-colors">{event.title}</h4>
                
                {event.description && (
                  <p className="text-zinc-400 text-sm mb-4">{event.description}</p>
                )}
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-zinc-200 text-sm">
                    <Calendar size={14} className="text-brand" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200 text-sm">
                    <MapPin size={14} className="text-brand" />
                    {event.location}
                  </div>
                </div>
                
                {event.ticketLink ? (
                  <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="w-full bg-brand text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-brand hover:bg-brand/90 transition-colors">
                    Get Tickets <Ticket size={18} />
                  </a>
                ) : (
                  <div className="w-full bg-zinc-900/50 text-zinc-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/5">
                    Available Soon...
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

