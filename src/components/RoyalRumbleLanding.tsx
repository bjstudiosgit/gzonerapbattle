import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const battleCard = [
  ["Badee Harz", "1 Flaymah"],
  ["Badee Harz", "Roman"],
  ["Deeno", "Natty EBK"],
  ["Tricky", "Roman"],
  ["Z.K", "7Wave"],
];

const eventFlyers = [
  { src: "/flyers/august-29-2026-deeno-vs-natty-ebk.png", alt: "Deeno vs Natty EBK event flyer" },
  { src: "/flyers/august-29-2026-zk-vs-7wave.png", alt: "Z.K vs 7Wave event flyer" },
  { src: "/flyers/august-29-2026-badee-harz-vs-1flaymah.png", alt: "Badee Harz vs 1 Flaymah event flyer" },
  { src: "/flyers/august-29-2026-tricky-vs-roman.png", alt: "Tricky vs Roman event flyer" },
  { src: "/flyers/august-29-2026-badee-harz-vs-roman-essex.png", alt: "Badee Harz vs Roman Essex event flyer" },
];

export default function RoyalRumbleLanding() {
  const [flyerIndex, setFlyerIndex] = useState(0);
  const activeFlyer = eventFlyers[flyerIndex];

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setFlyerIndex((current) => (current + 1) % eventFlyers.length);
    }, 4000);

    return () => window.clearInterval(rotation);
  }, []);

  return (
    <section id="next-event" className="relative overflow-hidden bg-[#050505] py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-brand/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-4">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 w-full lg:order-1 lg:w-1/2"
          >
            <div className="relative group">
              <div className="absolute inset-4 -right-2 top-6 -z-10 rounded-3xl border border-white/5 bg-zinc-800 transition-all duration-500 group-hover:-right-4" />
              <div className="absolute inset-8 -right-4 top-12 -z-20 rounded-3xl border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:-right-8" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand to-orange-600 opacity-25 blur transition duration-1000 group-hover:opacity-50" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={activeFlyer.src}
                    src={activeFlyer.src}
                    alt={activeFlyer.alt}
                    width={1080}
                    height={1350}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-display text-4xl uppercase leading-none tracking-tighter md:text-6xl">
                    29th <span className="text-brand">August</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-5 text-xs font-bold uppercase tracking-widest text-zinc-200 md:text-sm">
                    <span className="flex items-center gap-2"><Calendar size={16} className="text-brand" />29th August 2026</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-brand" />Canning Town</span>
                  </div>
                </div>
                <div className="absolute right-5 top-5 flex gap-2" aria-label={`Flyer ${flyerIndex + 1} of ${eventFlyers.length}`}>
                  {eventFlyers.map((flyer, index) => (
                    <span
                      key={flyer.src}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === flyerIndex ? "w-7 bg-brand" : "w-1.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="order-1 w-full lg:order-2 lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 text-[clamp(0.75rem,1.35vw,1.25rem)] font-black uppercase tracking-[0.16em] text-white md:mb-6">
                Gzone <span className="text-brand">29th August</span> - next event
              </h2>
              <h3 className="mb-6 font-display text-4xl uppercase leading-[1.02] tracking-tight sm:text-5xl md:mb-8 md:text-7xl">
                29th August 2026
                <span className="mt-2 block text-[clamp(1.45rem,3vw,3rem)] text-zinc-700">Peacocks Boxing, Canning Town</span>
              </h3>

              <p className="mb-8 text-base font-medium leading-relaxed text-zinc-400 md:text-lg">
                The next GZone card lands at Peacocks Boxing on 29th August. Tickets on sale soon.
              </p>

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {battleCard.map(([mc1, mc2], index) => (
                  <div key={`${mc1}-${mc2}`} className={`rounded-2xl border p-4 ${index === 0 ? "border-brand/40 bg-brand/10" : "border-white/10 bg-white/5"}`}>
                    <div className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500">
                      Battle
                    </div>
                    <div className="flex items-center justify-between gap-3 font-display text-lg uppercase md:text-xl">
                      <span>{mc1}</span>
                      <span className="text-brand">VS</span>
                      <span className="text-right">{mc2}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/events"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-6 py-4 font-display text-xl uppercase text-black transition-colors hover:bg-white"
              >
                Tickets On Sale Soon <Ticket size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
