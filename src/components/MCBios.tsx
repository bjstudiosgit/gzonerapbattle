import MCCarousel, { type CarouselItem } from "./MCCarousel";
import { Star } from "lucide-react";
import { mcs } from "../data/mcs";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { calculateRankings } from "../lib/ranking";
import { battles } from "../data/battles";

export default function MCBios() {
  const rankings = calculateRankings(battles, mcs);

  const activeMcs = mcs
    .filter((mc) => mc.isActive !== false)
    .sort((a, b) => {
      const rankA = rankings.find((r) => r.id === a.id)?.rank || 999;
      const rankB = rankings.find((r) => r.id === b.id)?.rank || 999;
      return rankA - rankB;
    });

  const getDisplayRank = (mcId: string) => {
    const position = activeMcs.findIndex((mc) => mc.id === mcId);
    return position >= 0 ? position + 1 : rankings.find((r) => r.id === mcId)?.rank || 0;
  };

  const getPoints = (mcId: string) =>
    rankings.find((r) => r.id === mcId)?.totalScore || 0;

  // Build combined list: staff first, then active MCs.
  const items: CarouselItem[] = [
    ...hosts.map((h) => ({
      type: "staff" as const,
      id: h.id,
      name: h.name,
      role: h.role,
      nickname: h.nickname,
      image: h.image,
      listImage: h.listImage,
      bio: h.bio,
      profileType: "host" as const,
      isMystery: undefined,
    })),
    ...judges.map((j) => ({
      type: "staff" as const,
      id: j.id,
      name: j.name,
      role: j.role,
      nickname: j.nickname,
      image: j.image,
      listImage: undefined,
      bio: j.bio,
      profileType: "judge" as const,
      isMystery: j.isMystery,
    })),
    ...activeMcs.map((mc) => ({
      type: "mc" as const,
      mc,
      rank: getDisplayRank(mc.id),
      points: getPoints(mc.id),
    })),
  ];

  return (
    <section id="mcs" className="py-24 md:py-32 relative scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-7xl font-display uppercase leading-none">
            The Season <span className="text-brand">&quot;Most Wanted&quot;</span>
          </h3>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
            ))}
          </div>
        </div>

        <MCCarousel items={items} />
      </div>
    </section>
  );
}
