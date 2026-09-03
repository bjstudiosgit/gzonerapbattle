import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from 'lucide-react';

const septemberFlyers = [
  {
    id: "marni-btizz",
    title: "Marni Gramz vs Btizz",
    src: "/flyers/september-26-2026-marni-gramz-vs-btizz.jpg",
  },
  {
    id: "tymeless-kime",
    title: "Tymeless vs K.I.M.E",
    src: "/flyers/september-26-2026-tymeless-vs-kime.jpg",
  },
  {
    id: "afrodon-akeezy",
    title: "Afrodon vs Akeezy",
    src: "/flyers/september-26-2026-afrodon-vs-akeezy.jpg",
  },
  {
    id: "trickyy-zk",
    title: "Trickyy vs Z.K",
    src: "/flyers/september-26-2026-trickyy-vs-zk.jpg",
  },
  {
    id: "badiee-roman",
    title: "Badiee Harz vs Roman",
    src: "/flyers/september-26-2026-badiee-harz-vs-roman.jpg",
  },
];

export const UpcomingEventLanding = () => {
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFlyerIndex((prev) => (prev + 1) % septemberFlyers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeFlyer = septemberFlyers[activeFlyerIndex];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative py-20 md:py-28 overflow-hidden bg-[#050505]"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side: Auto-Scrolling Flyer Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 order-2 lg:order-1"
          >
            <div className="relative group max-w-md mx-auto lg:max-w-lg">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand via-orange-600 to-brand rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-700 pointer-events-none" />

              {/* Main Flyer Card */}
              <div className="relative bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[3/4] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeFlyer.id}
                    src={activeFlyer.src}
                    alt={activeFlyer.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-contain bg-black select-none"
                  />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Event Details & Battles in Text */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-xl"
            >
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase leading-[1.02] tracking-tight text-white mb-2">
                  26th September 2026
                </h2>
                <p className="font-display text-lg sm:text-xl uppercase tracking-wider text-brand">
                  Peacocks Boxing, Canning Town
                </p>
              </div>

              <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-4">
                <p>
                  The next official Gzone event lands on Saturday 26th September at Peacocks Boxing, Canning Town. 5 high-stakes clashes locked in for the night:
                </p>

                <p className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white leading-relaxed">
                  <span className="text-brand">Marni Gramz vs Btizz</span> &bull;{" "}
                  <span className="text-brand">Tymeless vs K.I.M.E</span> &bull;{" "}
                  <span className="text-brand">Afrodon vs Akeezy</span> &bull;{" "}
                  <span className="text-brand">Trickyy vs Z.K</span> &bull;{" "}
                  <span className="text-brand">Badiee Harz vs Roman</span>
                </p>

                <p className="text-zinc-400 text-sm sm:text-base">
                  Tickets are £12 available on Eventbrite, with exclusive live streaming broadcasting directly on the official Gzone YouTube channel.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="https://www.eventbrite.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand hover:bg-white text-black px-8 py-4 font-display text-lg uppercase tracking-wider transition-all duration-300 shadow-[0_10px_30px_rgba(242,125,38,0.3)] hover:scale-[1.02] active:scale-95 text-center"
                >
                  Get Tickets £12 <Ticket size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
