import { Star } from "lucide-react";
import { battles } from "../data/battles";
import { hosts } from "../data/hosts";
import { judges } from "../data/judges";
import { mcs } from "../data/mcs";
import { calculateRankings } from "../lib/ranking";
import MCCarousel, { type CarouselItem } from "./MCCarousel";

export default function MCBios() {
  const rankings = calculateRankings(battles, mcs);

  const activeMcs = mcs
    .filter((mc) => mc.isActive !== false && mc.id !== "ldn-mikez")
    .sort((a, b) => {
      const rankA = rankings.find((ranking) => ranking.id === a.id)?.rank || 999;
      const rankB = rankings.find((ranking) => ranking.id === b.id)?.rank || 999;
      return rankA - rankB;
    });

  const getDisplayRank = (mcId: string) => {
    const position = activeMcs.findIndex((mc) => mc.id === mcId);
    return position >= 0 ? position + 1 : rankings.find((ranking) => ranking.id === mcId)?.rank || 0;
  };

  const getPoints = (mcId: string) =>
    rankings.find((ranking) => ranking.id === mcId)?.totalScore || 0;

  const items: CarouselItem[] = [
    ...hosts.map((host) => ({
      type: "staff" as const,
      id: host.id,
      name: host.name,
      role: host.role,
      nickname: host.nickname,
      image: host.image,
      listImage: host.listImage,
      bio: host.bio,
      profileType: "host" as const,
      isMystery: undefined,
    })),
    ...judges.map((judge) => ({
      type: "staff" as const,
      id: judge.id,
      name: judge.name,
      role: judge.role,
      nickname: judge.nickname,
      image: judge.image,
      listImage: undefined,
      bio: judge.bio,
      profileType: "judge" as const,
      isMystery: judge.isMystery,
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
            Gzone <span className="text-brand">&quot;Most Wanted&quot;</span> Season One
          </h3>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="text-yellow-500 fill-yellow-500 animate-pulse" size={20} />
            ))}
          </div>
        </div>

        <MCCarousel items={items} />
      </div>
    </section>
  );
}
