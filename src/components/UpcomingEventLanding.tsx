import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';

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
    id: "badee-roman",
    title: "Badee Harz vs Roman",
    src: "/flyers/september-26-2026-badee-harz-vs-roman.jpg",
  },
  {
    id: "1flaymah-zk",
    title: "1Flaymah vs Z.K",
    src: "/flyers/september-26-2026-1flaymah-vs-zk.png",
  },
];

export const UpcomingEventLanding = () => {
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveFlyerIndex((prev) => (prev + 1) % septemberFlyers.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#050505]">
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
                {septemberFlyers.map((flyer, idx) => {
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
                  October 2026
                </h2>
                <p className="font-display text-lg sm:text-xl uppercase tracking-wider text-brand">
                  Event Details Coming Soon
                </p>
              </div>

              <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-4">
                <p>
                  Our 26th September event has now taken place. Badee Harz vs Roman is out now. The remaining battles from the night are currently in production and will be released on the official Gzone YouTube channel.
                </p>

                <p className="font-display text-xl sm:text-2xl uppercase tracking-wide text-brand leading-relaxed">
                  October 2026 details coming soon
                </p>

                <p className="text-zinc-400 text-sm sm:text-base">
                  Keep an eye on Gzone for the next date, venue, lineup, and ticket announcement.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-brand/40 bg-brand/15 text-brand px-8 py-4 font-display text-lg uppercase tracking-wider text-center"
                >
                  September Battles In Production <Film size={18} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
