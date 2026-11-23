import { Link } from "react-router-dom";

export const UpcomingEventLanding = () => (
  <section aria-labelledby="upcoming-event-heading" className="relative w-full overflow-hidden py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-brand font-black uppercase tracking-[0.24em] mb-4">Next Event</p>
      <h2 id="upcoming-event-heading" className="text-4xl sm:text-5xl md:text-6xl font-display uppercase text-white">December battles · 18 December 2026</h2>
      <p className="text-zinc-400 mt-5">Tickets on sale soon.</p>
      <Link to="/events" className="inline-block mt-6 text-brand font-bold uppercase hover:text-white">View events</Link>
    </div>
  </section>
);
