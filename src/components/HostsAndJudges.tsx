import StaffCarousel, { type CarouselStaff } from "./StaffCarousel";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";

interface HostsAndJudgesProps {
  embedded?: boolean;
}

export default function HostsAndJudges({ embedded = false }: HostsAndJudgesProps) {
  const staffHosts = hosts.map((person) => ({ ...person, type: "hosts" as const }));
  const staffJudges = judges.map((person) => ({ ...person, type: "judges" as const }));

  // Same ordering used previously, flattened into carousel items.
  const orderedRaw = [
    { ...staffHosts[0], role: "Host" },
    { ...staffHosts[1], role: "Host" },
    { ...staffHosts[3], role: "Co-Host" },
    { ...staffJudges[0], role: staffJudges[0].role },
    staffHosts[2],
  ];

  const items: CarouselStaff[] = orderedRaw.map((person) => {
    const profileType = person.type === "judges" ? "judge" : "host";
    return {
      id: person.id,
      name: person.name,
      role: person.role,
      nickname: "nickname" in person ? person.nickname : undefined,
      image: person.image,
      listImage: "listImage" in person ? person.listImage : undefined,
      bio: person.bio,
      profileType,
      isMystery: "isMystery" in person ? person.isMystery : undefined,
    };
  });

  return (
    <section id="staff" className={`relative scroll-mt-24 overflow-hidden ${embedded ? "mt-4 pt-12 md:pt-20" : "py-24"}`}>
      {!embedded && <div className="absolute inset-0 bg-carbon opacity-10 pointer-events-none" />}
      {!embedded && <div className="absolute -bottom-1/4 -left-1/4 h-full w-full rounded-full bg-brand/10 blur-[120px] pointer-events-none" />}

      <div className={`relative z-10 mx-auto max-w-7xl ${embedded ? "" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-5xl font-display uppercase tracking-tight">
            Hosts &amp; <span className="text-brand">Judges</span>
          </h3>
        </div>
        <StaffCarousel items={items} />
      </div>
    </section>
  );
}
