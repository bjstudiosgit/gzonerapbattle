import { motion } from "motion/react";
import { Calendar, MapPin, Ticket } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Season 1",
    date: "Saturday, March 14, 2026",
    location: "G ZONE HQ",
    price: "£13.69",
    image: "/gzonebattle.png"
  },
  {
    id: 2,
    title: "G ZONE: APRIL SHOWDOWN",
    date: "April 2026 - Date tbc",
    location: "G ZONE HQ",
    price: "TBC",
    image: "https://picsum.photos/seed/april/800/600"
  },
  {
    id: 3,
    title: "G ZONE: MAY MADNESS",
    date: "May 2026 - Date tbc",
    location: "G ZONE HQ",
    price: "TBC",
    image: "https://picsum.photos/seed/may/800/600"
  },
  {
    id: 4,
    title: "G ZONE: JUNE JUBILEE",
    date: "June 2026 - Date tbc",
    location: "G ZONE HQ",
    price: "TBC",
    image: "https://picsum.photos/seed/june/800/600"
  }
];

export default function Events() {
  return (
    <section id="events" className="relative py-24 overflow-hidden">
      {/* Background with Gorilla Flow */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/gorilla-viking/1920/1080?blur=10" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950 z-10" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px] pointer-events-none z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-brand uppercase tracking-[0.3em] mb-4">Upcoming Battles</h2>
            <h3 className="text-5xl font-display italic uppercase">Secure Your <span className="text-brand">Tickets</span></h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-brand text-black px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand/20">
                  {event.price}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className={`text-xl font-display italic uppercase mb-4 group-hover:text-brand transition-colors ${event.title === "Season 1" ? "text-orange-500" : ""}`}>{event.title}</h4>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Calendar size={14} className="text-brand" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <MapPin size={14} className="text-brand" />
                    {event.location}
                  </div>
                </div>
                
                <a 
                  href="https://www.eventbrite.com/e/the-gzone-rap-battle-league-tickets-1983773740660#location"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-zinc-900 hover:bg-brand hover:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all inline-flex"
                >
                  <Ticket size={18} /> Buy Tickets
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
