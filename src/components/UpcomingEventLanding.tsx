import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { novemberBattles } from '../data/battles';

const novemberFlyers = novemberBattles.map((battle) => ({
  id: battle.slug,
  title: battle.title,
  src: battle.flyer,
}));

export const UpcomingEventLanding = () => {
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveFlyerIndex((prev) => (prev + 1) % novemberFlyers.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section aria-labelledby="upcoming-event-heading" className="relative w-full overflow-hidden pt-6 pb-16 sm:pt-10 md:pb-24">
      <div className="relative z-10 w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Side: Auto-Scrolling Flyer Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full order-2 lg:order-1 lg:col-span-5"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="relative bg-zinc-950 rounded-sm sm:rounded-lg overflow-hidden border border-white/10 aspect-[3/4] w-full flex items-center justify-center">
                {novemberFlyers.map((flyer, idx) => {
                  const isActive = idx === activeFlyerIndex;
                  return (
                    <img
                      key={flyer.id}
                      src={flyer.src}
                      alt={flyer.title}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className={`absolute inset-0 w-full h-full object-contain bg-black select-none transition-opacity duration-700 ease-in-out ${
                        isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Event Details & Battles in Text */}
          <div className="w-full order-1 lg:order-2 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-xl"
            >
              <div>
                <p className="mb-4 flex items-center gap-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.24em] text-brand">
                  <span aria-hidden="true" className="h-px w-8 bg-brand" />
                  Next Event
                </p>
                <h2 id="upcoming-event-heading" className="text-4xl sm:text-5xl md:text-6xl font-display uppercase leading-[1.02] tracking-tight text-white mb-2">
                  14 November 2026
                </h2>
                <p className="font-display text-lg sm:text-xl uppercase tracking-wider text-brand">
                  Peacocks Boxing, Canning Town
                </p>
              </div>

              <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-4">
                <p>
                  Deeno and K.I.M.E. Mello and Ryno. Tricky and 7wxve. Six matchups, one night at Peacocks Boxing. Who are you backing?
                </p>

                <ul className="space-y-2 font-display text-lg sm:text-xl uppercase tracking-wide">
                  {novemberBattles.map((battle) => (
                    <li key={battle.id}>
                      <Link to={`/battle/${battle.slug}`} className="hover:text-brand transition-colors">
                        {battle.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="text-zinc-400 text-sm sm:text-base">
                  Keep an eye on Gzone for the ticket release announcement.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/events"
                  className="inline-block font-display text-3xl sm:text-4xl uppercase leading-none tracking-tight text-brand transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  Tickets on sale soon
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
