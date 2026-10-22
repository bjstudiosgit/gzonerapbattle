import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { portraitImage } from "../lib/images";

interface HostsAndJudgesProps {
  embedded?: boolean;
  excludeIds?: string[];
}

export type StaffCardPerson = {
  id: string;
  name: string;
  role: string;
  image: string;
  listImage?: string;
  type: "hosts" | "judges";
  isMystery?: boolean;
  instagram?: string;
};

export function StaffCard({ person, index, plainRole = false, hideRole = false }: { person: StaffCardPerson; index: number; plainRole?: boolean; hideRole?: boolean }) {
  const image = portraitImage(person.listImage || person.image, "card");

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
        className={`h-full w-full object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 ${person.isMystery ? "blur-xl opacity-40" : ""}`}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        {!hideRole && <span className={plainRole ? "mb-2 inline-block text-xs font-black uppercase tracking-[0.2em] text-brand" : "mb-2 inline-block rounded bg-brand px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-black"}>
          {person.role}
        </span>}
        <h4 className={`font-display uppercase leading-none text-white transition-colors group-hover:text-brand ${(person.id === "louis-bowers" || person.role === "Celebrity Guest") ? "text-xl" : "truncate text-2xl"}`}>
          {person.name}
        </h4>
      </div>
    </motion.div>
  );

  if (person.role === "Celebrity Guest") {
    return person.instagram ? (
      <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label={`View ${person.name} on Instagram`}>
        {card}
      </a>
    ) : <div className="block w-full h-full">{card}</div>;
  }

  return person.isMystery ? (
    <div className="block w-full h-full">{card}</div>
  ) : (
    <Link to={`/${person.id}`} className="block w-full h-full" aria-label={`View ${person.name} profile`}>
      {card}
    </Link>
  );
}

export default function HostsAndJudges({ embedded = false, excludeIds = [] }: HostsAndJudgesProps) {
  const staffHosts = hosts.map((person) => ({ ...person, type: "hosts" as const }));
  const staffJudges = judges.map((person) => ({ ...person, type: "judges" as const }));
  const gingaJay = staffHosts.find((h) => h.id === "ginga-jay");
  const darrenStewart = staffHosts.find((h) => h.id === "darren-stewart");
  const passive = staffHosts.find((h) => h.id === "passive");
  const louisBowers = staffHosts.find((h) => h.id === "louis-bowers");
  const behindTheScenesIds = ["del-sajiwandani", "scientificbrad", "n-studios"];
  const remainingHosts = staffHosts.filter(
    (h) => !["ginga-jay", "darren-stewart", "passive", "louis-bowers", ...behindTheScenesIds].includes(h.id)
  );

  const staff = [
    ...(gingaJay ? [{ ...gingaJay, role: "Host" }] : []),
    ...(darrenStewart ? [{ ...darrenStewart, role: "Host" }] : []),
    ...(passive ? [{ ...passive, role: "Judge", type: "judges" as const }] : []),
    ...(louisBowers ? [louisBowers] : []),
    ...remainingHosts,
    ...staffJudges.filter((person) => person.role !== "Celebrity Guest"),
    ...staffHosts.filter((person) => behindTheScenesIds.includes(person.id)),
  ].filter((person) => !excludeIds.includes(person.id));
  const celebrityGuests = staffJudges.filter(
    (person) => person.role === "Celebrity Guest" && !excludeIds.includes(person.id)
  );

  return (
    <section id="staff" className={`relative scroll-mt-24 overflow-hidden ${embedded ? "" : "py-24"}`}>
      {!embedded && <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />}
      {!embedded && <div className="absolute -bottom-1/4 -left-1/4 h-full w-full rounded-full bg-brand/10 blur-[120px] pointer-events-none" />}

      <div className={`relative z-10 mx-auto max-w-7xl ${embedded ? "" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className={embedded ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5" : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6"}>
          {staff.map((person, index) => (
            <StaffCard key={`${person.type}-${person.id}`} person={person} index={index} />
          ))}
        </div>
        {celebrityGuests.length > 0 && (
          <div className={embedded ? "mt-20 md:mt-28" : "mt-16 border-t border-white/10 pt-12"}>
            <h2 className="mb-8 font-display text-4xl uppercase text-white md:text-6xl">Celebrity Guests</h2>
            <div className={embedded ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5" : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6"}>
              {celebrityGuests.map((person, index) => (
                <StaffCard key={`${person.type}-${person.id}`} person={person} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
