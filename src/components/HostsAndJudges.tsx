import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { portraitImage } from "../lib/images";

interface HostsAndJudgesProps {
  embedded?: boolean;
}

export default function HostsAndJudges({ embedded = false }: HostsAndJudgesProps) {
  const staffHosts = hosts.map((person) => ({ ...person, type: "hosts" as const }));
  const staffJudges = judges.map((person) => ({ ...person, type: "judges" as const }));
  const staff = [
    { ...staffHosts[0], role: "Host" },
    { ...staffHosts[1], role: "Host" },
    { ...staffHosts[3], role: "Judge", type: "judges" as const },
    staffHosts[2],
    ...staffJudges,
  ];

  return (
    <section id="staff" className={`relative scroll-mt-24 overflow-hidden ${embedded ? "mt-4" : "py-24"}`}>
      {!embedded && <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />}
      {!embedded && <div className="absolute -bottom-1/4 -left-1/4 h-full w-full rounded-full bg-brand/10 blur-[120px] pointer-events-none" />}

      <div className={`relative z-10 mx-auto max-w-7xl ${embedded ? "" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
          {staff.map((person, index) => {
            const isMystery = person.isMystery;
            const profileType = person.type === "judges" ? "judge" : "host";
            const image = person.type === "hosts" && person.id === "ginga-jay"
              ? "/jay.png"
              : portraitImage(person.listImage || person.image, "card");

            const card = (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 transition-all hover:border-brand/60 hover:-translate-y-1"
              >
                <img
                  src={image}
                  alt={person.name}
                  width={400}
                  height={533}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 ${isMystery ? "blur-xl opacity-40" : ""}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                  <span className="mb-2 inline-block rounded bg-brand px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-black">
                    {person.role}
                  </span>
                  <h4 className="truncate text-2xl font-display uppercase leading-none text-white transition-colors group-hover:text-brand">
                    {person.name}
                  </h4>
                </div>
              </motion.div>
            );

            return isMystery ? (
              <div key={`${person.type}-${person.id}`}>{card}</div>
            ) : (
              <Link key={`${person.type}-${person.id}`} to={`/${profileType}/${person.id}`} aria-label={`View ${person.name} profile`}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
