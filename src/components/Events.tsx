import { motion } from "motion/react";
import { Calendar, MapPin, Ticket, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 2,
    title: "G ZONE: APRIL SHOWDOWN",
    date: "April 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattleapril.png"
  },
  {
    id: 3,
    title: "G ZONE: MAY MADNESS",
    date: "May 2026 - Date TBC",
    location: "G ZONE HQ",
    price: "TBC",
    image: "/gzonebattlemay.png"
  }
];

export default function Events() {
  return (
    <section id="events" className="relative py-24 overflow-hidden scroll-mt-24">
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
            <h3 className="text-5xl md:text-6xl font-display italic uppercase">Upcoming <span className="text-brand">Events</span></h3>
            <p className="text-zinc-400 mt-4">Don't miss our next UK battle rap league events.</p>
          </motion.div>
          <Link to="/events" className="text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
            View All Events <TrendingUp size={18} />
          </Link>
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
                <div className="absolute top-4 right-4 bg-zinc-900 text-brand px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest border border-brand/20">
                  {event.price}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-display italic uppercase mb-4 group-hover:text-brand transition-colors">{event.title}</h4>
                
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
                
                <div className="w-full bg-zinc-900/50 text-zinc-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/5">
                  Coming Soon
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

