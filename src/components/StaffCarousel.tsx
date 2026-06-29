import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { portraitImage } from "../lib/images";
import { soundManager } from "../lib/sounds";

export interface CarouselStaff {
  id: string;
  name: string;
  role: string;
  nickname?: string;
  image: string;
  listImage?: string;
  bio: string;
  profileType: "host" | "judge";
  isMystery?: boolean;
}

interface StaffCarouselProps {
  items: CarouselStaff[];
}

const AUTO_ADVANCE_MS = 6000;

export default function StaffCarousel({ items }: StaffCarouselProps) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (active > count - 1) setActive(Math.max(0, count - 1));
  }, [count, active]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
      soundManager.playImpact();
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchX.current = null;
  };

  if (count === 0) return null;

  const spacing = isMobile ? 230 : 330;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[540px] sm:h-[600px] overflow-hidden">
        {items.map((person, index) => {
          const offset = index - active;
          const distance = Math.abs(offset);
          const isCenter = offset === 0;

          return (
            <motion.div
              key={`${person.profileType}-${person.id}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                x: offset * spacing,
                scale: isCenter ? 1 : 0.66,
                opacity: distance > 1 ? 0 : isCenter ? 1 : 0.32,
                rotateY: offset * -18,
                zIndex: 20 - distance,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              style={{ pointerEvents: isCenter ? "auto" : "none", transformPerspective: 1400 }}
            >
              <StaffCard person={person} isCenter={isCenter} onHoverPlay={() => soundManager.playHover()} />
            </motion.div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-0 sm:-left-2 top-[calc(50%-2.5rem)] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white hover:bg-brand hover:text-black hover:border-brand transition flex items-center justify-center backdrop-blur"
        aria-label="Previous staff"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-0 sm:-right-2 top-[calc(50%-2.5rem)] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white hover:bg-brand hover:text-black hover:border-brand transition flex items-center justify-center backdrop-blur"
        aria-label="Next staff"
      >
        <ChevronRight size={24} />
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 px-4">
        {items.map((person, index) => (
          <button
            key={`${person.profileType}-${person.id}`}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${person.name}`}
            className={`h-2 rounded-full transition-all ${index === active ? "w-8 bg-brand" : "w-2 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function StaffCard({
  person,
  isCenter,
  onHoverPlay,
}: {
  person: CarouselStaff;
  isCenter: boolean;
  onHoverPlay: () => void;
}) {
  const isMystery = person.isMystery;
  const image = person.id === "ginga-jay" ? "/jay.png" : portraitImage(person.listImage || person.image, "card");

  // Side (non-centre) cards: a quieter preview.
  if (!isCenter) {
    return (
      <div className="relative w-[240px] sm:w-[320px] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 pointer-events-none">
        <img
          src={image}
          alt={person.name}
          className={`w-full h-full object-cover object-top ${isMystery ? "blur-xl opacity-40" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-brand text-[10px] font-black tracking-[0.3em] uppercase">{person.role}</span>
          <h4 className="text-2xl font-display uppercase leading-none mt-1">{person.name}</h4>
        </div>
      </div>
    );
  }

  // Centre (featured) card: full detail.
  const bioPreview = person.bio.split("\n")[0];

  const card = (
    <motion.div
      onMouseEnter={onHoverPlay}
      className="group relative w-[300px] sm:w-[440px] aspect-[3/4] rounded-[2rem]"
    >
      {/* Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand to-orange-600 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />

      <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-brand/30 bg-zinc-950 shadow-[0_0_80px_rgba(242,125,38,0.25)]">
        <img
          src={image}
          alt={person.name}
          loading="lazy"
          className={`w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition duration-700 ${isMystery ? "blur-xl opacity-40" : ""}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("picsum")) {
              target.src = `https://picsum.photos/seed/${person.id}/400/533`;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-95" />

        {/* Role badge */}
        <div className="absolute top-4 left-4 z-30">
          <div className="bg-brand text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            {person.role}
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 sm:p-7">
          {person.nickname && (
            <p className="text-brand text-[10px] font-black tracking-[0.3em] uppercase mb-1">
              &quot;{person.nickname}&quot;
            </p>
          )}
          <h3 className="text-4xl sm:text-5xl font-display uppercase leading-none mb-3">{person.name}</h3>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
            {bioPreview}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (isMystery) {
    return card;
  }

  return (
    <div className="relative">
      {card}
      <div className="absolute inset-0 z-20">
        <Link
          to={`/${person.profileType}/${person.id}`}
          onClick={() => soundManager.playImpact()}
          className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 z-30 inline-flex items-center gap-2 bg-brand text-black px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white transition"
        >
          View Profile <ArrowUpRight size={14} />
        </Link>
        {/* Full-card link */}
        <Link
          to={`/${person.profileType}/${person.id}`}
          onClick={() => soundManager.playImpact()}
          className="absolute inset-0"
          aria-label={`View ${person.name} profile`}
        />
      </div>
    </div>
  );
}
