import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { decemberBattles } from "../data/battles";

const flyers = decemberBattles.filter((battle) => battle.flyer);

export const UpcomingEventLanding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion || flyers.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % flyers.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return (
    <section aria-labelledby="upcoming-event-heading" className="relative w-full pt-8 pb-16 md:pb-24">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:col-span-7">
          <p className="text-brand font-black uppercase tracking-[0.24em] mb-4">Next Event</p>
          <h2 id="upcoming-event-heading" className="text-4xl sm:text-5xl md:text-6xl font-display uppercase text-white">December battles</h2>
          <p className="text-brand font-display text-xl uppercase mt-3">18 December 2026 · Peacocks Boxing, Canning Town</p>
          <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2 font-display text-lg uppercase tracking-wide">
            {decemberBattles.map((battle) => (
              <li key={battle.id}>
                <Link to={`/battle/${battle.slug}`} className="hover:text-brand transition-colors">{battle.title}</Link>
              </li>
            ))}
          </ul>
          <p className="text-zinc-400 mt-5">Tickets on sale soon.</p>
          <div className="flex flex-wrap gap-6 mt-6 text-brand font-bold uppercase">
            <Link to="/events" className="hover:text-white">View events</Link>
            <Link to="/flyers" className="hover:text-white">View all flyers</Link>
          </div>
        </div>

        {flyers.length > 0 && (
          <div className="order-1 w-full max-w-md mx-auto lg:max-w-none lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-950 border border-brand/30 shadow-[0_0_45px_rgba(242,125,38,0.16)]">
              {flyers.map((battle, index) => (
                <img
                  key={battle.id}
                  src={battle.flyer}
                  alt={`${battle.title} flyer`}
                  aria-hidden={index !== activeIndex}
                  loading={index === activeIndex ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-contain motion-safe:transition-opacity motion-safe:duration-700 ${index === activeIndex ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {flyers.map((battle, index) => (
                <button
                  key={battle.id}
                  type="button"
                  aria-label={`Show ${battle.title} flyer`}
                  aria-pressed={index === activeIndex}
                  className="grid size-8 place-items-center rounded-full [&[aria-pressed=true]>span]:bg-brand"
                  onClick={() => { setActiveIndex(index); setPaused(true); }}
                >
                  <span className="size-2 rounded-full bg-white/40" />
                </button>
              ))}
              {!reduceMotion && (
                <button type="button" className="px-2 text-sm text-zinc-300 hover:text-white" onClick={() => setPaused(!paused)}>
                  {paused ? "Play" : "Pause"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
